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

export const initCommand = new Command('init')
    .description('Initialize identity PDA')
    .action(async () => {
        console.log(chalk.cyan('╔════════════════════════════════════╗'));
        console.log(chalk.cyan('║        MinKYC — Identity Init      ║'));
        console.log(chalk.cyan('╚════════════════════════════════════╝\n'));

        const spinner = ora('Loading resources...').start();
        
        try {
            // 0. Check if PDA exists to avoid overwriting local data if on-chain state exists
            const provider = getProvider();
            const program = getProgram(provider);
            const owner = provider.wallet.publicKey;

            const [identityPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("identity"), owner.toBuffer()],
                program.programId
            );

            const info = await provider.connection.getAccountInfo(identityPda);
            if (info) {
                 spinner.warn('Identity PDA already exists.');
                 console.log(chalk.magenta(`Identity PDA: ${identityPda.toString()}`));
                 
                 spinner.start('Resetting existing identity...');
                 try {
                     await program.methods.close()
                        .accounts({
                            identity: identityPda,
                            owner: owner,
                        })
                        .rpc();
                     spinner.succeed('Old identity closed/reset.');
                     await new Promise(r => setTimeout(r, 1000)); // Wait for propagation
                 } catch (e) {
                     spinner.fail('Failed to reset identity.');
                     console.error(e);
                     return;
                 }
            }

            // 1. Generate New Mock Passport
            // Per rules: "Every time a new identity is initiated, generate a completely new and unique passport"
            const passport = generateMockPassport();
            const passportPath = path.join(process.cwd(), 'passport.json');
            fs.writeFileSync(passportPath, JSON.stringify(passport, null, 2));
            
            spinner.succeed('Generated NEW mock passport data (saved to passport.json)');
            console.log(chalk.dim(JSON.stringify(passport, null, 2)));

            // 2. Generate/Load Secret
            let secret;
            if (fs.existsSync('.secret')) {
                // We reuse secret if exists, or should we rotate it? 
                // Usually secret is kept until explicitly rotated.
                secret = fs.readFileSync('.secret', 'utf-8');
                spinner.succeed('Loaded existing secret from .secret');
            } else {
                secret = randomSecret();
                fs.writeFileSync('.secret', secret);
                spinner.succeed('Generated new secret and saved to .secret');
            }
            
            // 3. Generate Commitment
            const commitment = createCommitment(passport, secret);
            const commitmentArray = Array.from(commitment);
            spinner.succeed(`Generated commitment: ${commitment.toString('hex').slice(0, 16)}...`);

            // 4. Create PDA
            spinner.start('Initializing PDA on Solana Devnet...');

            const tx = await program.methods.initialize(commitmentArray)
                .accounts({
                    identity: identityPda,
                    owner: owner,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            
            spinner.succeed('PDA created successfully!');
            console.log(chalk.green(`\nTransaction Signature: ${tx}`));
            console.log(chalk.magenta(`Identity PDA: ${identityPda.toString()}`));
            console.log(chalk.cyan(`Owner: ${owner.toString()}`));
            console.log(chalk.cyan(`Status: Active`));

        } catch (e: any) {
            spinner.fail('Initialization failed');
            console.error(chalk.red(e));
        }
    });
