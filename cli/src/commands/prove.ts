import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { generateMockProof, hash, createCommitment } from '../utils/crypto';
import { getProvider, getProgram } from '../utils/connection';
import { PublicKey } from '@solana/web3.js';

export const proveAction = async () => {
    console.log(chalk.cyan('╔════════════════════════════════════╗'));
    console.log(chalk.cyan('║        MinKYC — Generate Proof     ║'));
    console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

    const spinner = ora('Loading resources...').start();
    
    try {
        // 1. Load Resources
        const passportPath = path.join(process.cwd(), 'passport.json');
        if (!fs.existsSync(passportPath)) {
            // Fallback to fixture if local doesn't exist? 
            // Or throw error saying "Run init first"?
            // If init was run, passport.json should exist.
            throw new Error('Passport data not found. Run "minkyc identity init" first.');
        }
        const passport = JSON.parse(fs.readFileSync(passportPath, 'utf-8'));
        
        if (!fs.existsSync('.secret')) throw new Error('Secret not found. Run init first.');
        const secret = fs.readFileSync('.secret', 'utf-8');

        if (!fs.existsSync('request.json')) throw new Error('Request not found. Run "platform request" first.');
        const request = JSON.parse(fs.readFileSync('request.json', 'utf-8'));
        
        // 2. Generate Proof
        spinner.text = 'Generating ZK Proof (Mocked)...';
        const commitment = createCommitment(passport, secret);
        
        const proof = generateMockProof(commitment, request, secret);
        // Anchor expects Vec<u8> which is Buffer or number[]
        const proofArray = Buffer.from(proof);
        
        const requirementHash = hash(JSON.stringify(request));
        const requirementHashArray = Array.from(requirementHash);

        spinner.succeed('Proof generated locally');

        // 3. Submit to Chain
        const provider = getProvider();
        const program = getProgram(provider);
        const owner = provider.wallet.publicKey;
        
        const [identityPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("identity"), owner.toBuffer()],
            program.programId
        );

        spinner.start('Verifying proof on-chain...');
        
        // @ts-ignore
        const tx = await program.methods.verifyProof(proofArray, requirementHashArray)
            .accounts({
                identity: identityPda,
            })
            .rpc();
            
        spinner.succeed('Verification Successful!');
        console.log(chalk.green(`\nTransaction Signature: ${tx}`));
        console.log(chalk.magenta(`Result: APPROVED`));

    } catch (e: any) {
        spinner.fail('Verification Failed');
        console.error(chalk.red(e));
    }
};

export const proveCommand = new Command('prove')
    .description('Generate ZK proof and submit verification')
    .action(proveAction);
