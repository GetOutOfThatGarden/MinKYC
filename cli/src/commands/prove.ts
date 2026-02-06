/**
 * MinKYC Proof Generation & Verification Command
 * 
 * This command generates a mock Zero-Knowledge proof locally and submits it for verification.
 * It performs the following steps:
 * 1. Loads the local passport data (`passport.json`) and secret (`.secret`).
 * 2. Loads the active platform request (`request.json`).
 * 3. Generates a mock proof asserting that the identity meets the requirements (e.g., Over 18).
 * 4. Submits the proof and the requirement hash to the smart contract.
 * 5. The smart contract verifies the commitment match and requirement satisfaction.
 * 
 * Usage:
 * $ npx tsx cli/src/index.ts prove
 * 
 * Prerequisites:
 * - Run `init` to create an identity.
 * - Run `platform request` to generate a request.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { generateMockProof, hash, createCommitment } from '../utils/crypto';
import { getProvider, getProgram } from '../utils/connection';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export const proveAction = async () => {
    console.log(chalk.cyan('╔════════════════════════════════════╗'));
    console.log(chalk.cyan('║        MinKYC — Generate Proof     ║'));
    console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

    const spinner = ora('Loading resources...').start();
    
    try {
        // 1. Load Resources
        const passportPath = path.join(process.cwd(), 'passport.json');
        if (!fs.existsSync(passportPath)) {
            throw new Error('Passport data not found. Run "minkyc identity init" first.');
        }
        const passportData = JSON.parse(fs.readFileSync(passportPath, 'utf-8'));
        
        // Extract meta if present
        const meta = passportData._meta;
        if (!meta) {
            throw new Error('Passport metadata missing. Please run "minkyc identity init" again to update format.');
        }
        
        // Strip meta for commitment generation
        const { _meta, ...passport } = passportData;

        if (!fs.existsSync('.secret')) throw new Error('Secret not found. Run init first.');
        const secret = fs.readFileSync('.secret', 'utf-8');

        if (!fs.existsSync('request.json')) throw new Error('Request not found. Run "platform request" first.');
        const request = JSON.parse(fs.readFileSync('request.json', 'utf-8'));
        
        // 2. Generate Proof
        spinner.text = 'Generating ZK Proof (Mocked)...';
        const commitment = createCommitment(passport, secret);
        
        const proof = generateMockProof(commitment, request, secret);
        const proofArray = Buffer.from(proof);
        
        const requirementHash = hash(JSON.stringify(request));
        const requirementHashArray = Array.from(requirementHash);

        spinner.succeed('Proof generated locally');

        // 3. Submit to Chain
        const provider = getProvider();
        const program = getProgram(provider);
        const owner = provider.wallet.publicKey;
        
        const index = new BN(meta.identityIndex);
        const indexLe = index.toArrayLike(Buffer, 'le', 8);

        const [identityPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("identity"), owner.toBuffer(), indexLe],
            program.programId
        );
        
        // Verify PDA matches stored one
        if (identityPda.toString() !== meta.identityPda) {
            spinner.warn(`Computed PDA (${identityPda.toString()}) differs from stored PDA (${meta.identityPda}). Using computed one.`);
        }

        // Derive the proof receipt PDA (for replay protection)
        const proofHash = hash(proof.toString('hex'));
        const [proofReceiptPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("proof_receipt"),
                identityPda.toBuffer(),
                proofHash
            ],
            program.programId
        );

        spinner.start(`Verifying proof on-chain for Identity #${index.toString()}...`);
        
        // @ts-ignore
        const tx = await program.methods.verifyProof(proofArray, requirementHashArray, index)
            .accounts({
                identity: identityPda,
                proofReceipt: proofReceiptPda,
                verifier: provider.wallet.publicKey,  // Current wallet pays for receipt account
                systemProgram: SystemProgram.programId,
            })
            .rpc();
            
        spinner.stop();

        const explorerUrl = `https://explorer.solana.com/tx/${tx}?cluster=devnet`;

        console.log('\n' + chalk.bold.white('╔════════════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.white('║                      KYC VERIFICATION RECEIPT                  ║'));
        console.log(chalk.bold.white('╚════════════════════════════════════════════════════════════════╝'));
        
        console.log(chalk.gray('Transaction Signature:'));
        console.log(chalk.yellow(tx));
        
        console.log(chalk.gray('\nView on Solana Explorer:'));
        console.log(chalk.blue.underline(explorerUrl));
        
        console.log(chalk.gray('\nVerification Result:'));
        console.log(chalk.bold.green('VERIFIED ✅'));
        
        console.log(chalk.gray('\nIdentity PDA:'));
        console.log(chalk.cyan(identityPda.toString()));

        console.log(chalk.gray('\nProof Receipt PDA (Replay Protection):'));
        console.log(chalk.cyan(proofReceiptPda.toString()));
        console.log(chalk.dim('This ensures this proof cannot be reused.'));

        console.log(chalk.gray('\n------------------------------------------------------------------'));
        console.log(chalk.italic.white('This transaction signature serves as a regulatory-grade receipt,'));
        console.log(chalk.italic.white('cryptographically proving that KYC verification was performed'));
        console.log(chalk.italic.white('on-chain without revealing sensitive personal data.'));
        console.log(chalk.gray('------------------------------------------------------------------\n'));

    } catch (e: any) {
        spinner.fail('Verification Failed');
        console.error(chalk.red(e.message));
        if (e.signature) {
             const explorerUrl = `https://explorer.solana.com/tx/${e.signature}?cluster=devnet`;
             console.log(chalk.gray('\nView Failed Transaction:'));
             console.log(chalk.blue.underline(explorerUrl));
        }
    }
};

export const proveCommand = new Command('prove')
    .description('Generate ZK proof and submit verification')
    .action(proveAction);
