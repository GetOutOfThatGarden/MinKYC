/**
 * MinKYC Identity Initialization Command
 * 
 * This command handles the creation of a new user identity on the Solana Devnet.
 * It performs the following steps:
 * 1. Generates ICAO-compliant mock passport data (NFC-readable fields).
 * 2. Generates or loads a local secret for commitment hashing.
 * 3. Derives a unique Identity PDA using an on-chain counter to ensure uniqueness.
 * 4. Submits a commitment (hash of passport + secret) to the on-chain program.
 * 
 * Usage:
 * $ npx tsx cli/src/index.ts identity init
 * 
 * Output:
 * - Saves passport data to `passport.json`
 * - Saves secret to `.secret`
 * - Displays the transaction signature and the new PDA address with an Explorer link.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { createCommitment, randomSecret } from '../utils/crypto';
import { generateMockPassport } from '../utils/mockData';
import { getProvider, getProgram } from '../utils/connection';
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export const initCommand = new Command('init')
    .description('Initialize identity PDA')
    .action(async () => {
        console.log(chalk.cyan('╔════════════════════════════════════╗'));
        console.log(chalk.cyan('║        MinKYC — Identity Init      ║'));
        console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

        const spinner = ora('Loading resources...').start();
        
        try {
            const provider = getProvider();
            const program = getProgram(provider);
            const owner = provider.wallet.publicKey;

            // 1. Get Identity Counter to determine index
            const [counterPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("identity_counter"), owner.toBuffer()],
                program.programId
            );

            let index = new BN(0);
            try {
                // Try to fetch the counter account
                // Since we don't have the IDL fully typed in the client for the new struct yet 
                // (unless we updated types), we can try to fetch it generically or assume 0 if fails.
                // However, anchor client should handle it if we use program.account.identityCounter
                // But the program object needs to know the IDL.
                // The IDL is loaded from the on-chain program usually if not provided.
                // Let's assume fetching might fail if account doesn't exist.
                
                // Note: The IDL might not be updated on the client side instantly.
                // We can check account info manually.
                const info = await provider.connection.getAccountInfo(counterPda);
                if (info) {
                    // It exists. The data structure is [discriminator(8) + count(8)].
                    // We can decode manually to be safe.
                    const data = info.data;
                    // Skip discriminator (8 bytes)
                    const countBuffer = data.slice(8, 16);
                    index = new BN(countBuffer, 'le');
                    spinner.info(`Found existing Identity Counter. Next Index: ${index.toString()}`);
                } else {
                    spinner.info('First identity initialization (Index: 0)');
                }
            } catch (e) {
                // If fetch fails, assume 0
                console.log("Error fetching counter, assuming 0", e);
            }

            // 2. Derive Identity PDA
            // Seeds: ["identity", owner, index_le_bytes]
            const indexLe = index.toArrayLike(Buffer, 'le', 8);
            const [identityPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("identity"), owner.toBuffer(), indexLe],
                program.programId
            );

            // 3. Generate New Mock Passport
            const passport = generateMockPassport();
            
            // Add metadata to passport object (or wrap it)
            // We'll modify the object to include the identity info for local tracking
            const passportWithMeta = {
                ...passport,
                _meta: {
                    identityIndex: index.toNumber(),
                    identityPda: identityPda.toString(),
                    programId: program.programId.toString()
                }
            };

            const passportPath = path.join(process.cwd(), 'passport.json');
            fs.writeFileSync(passportPath, JSON.stringify(passportWithMeta, null, 2));
            
            spinner.succeed('Generated NEW mock passport data (saved to passport.json)');
            console.log(chalk.dim(JSON.stringify(passportWithMeta, null, 2)));

            // 4. Generate/Load Secret
            let secret;
            if (fs.existsSync('.secret')) {
                secret = fs.readFileSync('.secret', 'utf-8');
                spinner.succeed('Loaded existing secret from .secret');
            } else {
                secret = randomSecret();
                fs.writeFileSync('.secret', secret);
                spinner.succeed('Generated new secret and saved to .secret');
            }
            
            // 5. Generate Commitment
            const commitment = createCommitment(passport, secret); // Use original passport object for commitment
            const commitmentArray = Array.from(commitment);
            spinner.succeed(`Generated commitment: ${commitment.toString('hex').slice(0, 16)}...`);

            // 6. Create PDA
            spinner.start(`Initializing Identity #${index.toString()} on Solana Devnet...`);

            const tx = await program.methods.initialize(commitmentArray)
                .accounts({
                    identityCounter: counterPda,
                    identity: identityPda,
                    owner: owner,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            
            spinner.succeed('Identity created successfully!');
            
            console.log(chalk.green(`\nTransaction Signature: ${tx}`));

            const separator = chalk.gray('--------------------------------------------------');
            console.log(separator);
            console.log(chalk.green.bold(' ✅ Identity Created Successfully'));
            console.log();
            console.log(chalk.white(' PDA Address:'));
            console.log(chalk.yellow(`   ${identityPda.toString()}`));
            console.log();
            console.log(chalk.white(' View on Solana Explorer (Devnet):'));
            console.log(chalk.blue.underline(`   https://explorer.solana.com/address/${identityPda.toString()}?cluster=devnet`));
            console.log(separator);

        } catch (e: any) {
            spinner.fail('Initialization failed');
            console.error(chalk.red(e));
        }
    });
