/**
 * MinKYC Identity Status Command
 * 
 * This command checks the on-chain status of the user's identity PDA.
 * It attempts to resolve the PDA from local `passport.json` metadata or
 * by querying the on-chain identity counter for the latest identity.
 * 
 * Usage:
 * $ npx tsx cli/src/index.ts identity status
 * 
 * Output:
 * - Displays PDA Address, Owner, Index, Revocation status, and Commitment hash.
 */
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { getProvider, getProgram } from '../utils/connection';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export const statusCommand = new Command('status')
    .description('Check identity PDA status')
    .action(async () => {
        console.log(chalk.magenta('╔════════════════════════════════════╗'));
        console.log(chalk.magenta('║        MinKYC — Identity Status    ║'));
        console.log(chalk.magenta('╚════════════════════════════════════╝\n'));

        const spinner = ora('Fetching identity status...').start();
        
        try {
            const provider = getProvider();
            const program = getProgram(provider);
            const owner = provider.wallet.publicKey;
            
            // Try to load from local state first
            const passportPath = path.join(process.cwd(), 'passport.json');
            let identityPda: PublicKey | null = null;
            let index: number | null = null;

            if (fs.existsSync(passportPath)) {
                try {
                    const passportData = JSON.parse(fs.readFileSync(passportPath, 'utf-8'));
                    if (passportData._meta) {
                        identityPda = new PublicKey(passportData._meta.identityPda);
                        index = passportData._meta.identityIndex;
                        spinner.info(`Loaded identity from passport.json (Index: ${index})`);
                    }
                } catch (e) {
                    // Ignore error
                }
            }

            if (!identityPda) {
                // Fallback: Try to find latest identity via counter
                 const [counterPda] = PublicKey.findProgramAddressSync(
                    [Buffer.from("identity_counter"), owner.toBuffer()],
                    program.programId
                );
                
                try {
                    const info = await provider.connection.getAccountInfo(counterPda);
                    if (info) {
                        const count = new BN(info.data.slice(8, 16), 'le').toNumber();
                        if (count > 0) {
                            const latestIndex = count - 1;
                            const indexLe = new BN(latestIndex).toArrayLike(Buffer, 'le', 8);
                            [identityPda] = PublicKey.findProgramAddressSync(
                                [Buffer.from("identity"), owner.toBuffer(), indexLe],
                                program.programId
                            );
                            spinner.info(`Found latest identity on-chain (Index: ${latestIndex})`);
                        }
                    }
                } catch (e) {
                    // Ignore
                }
            }

            if (!identityPda) {
                 spinner.fail('No identity found locally or on-chain.');
                 console.log(chalk.yellow('Run "minkyc identity init" to create one.'));
                 return;
            }

            // Fetch account
            try {
                // Use getAccountInfo for generic fetch if IDL issues, but try typed fetch first
                const identityAccount = await program.account.identity.fetch(identityPda);
                
                spinner.stop();
                
                console.log(chalk.bold('Identity PDA Found:'));
                console.log(`Address:    ${identityPda.toString()}`);
                console.log(`Owner:      ${identityAccount.owner.toString()}`);
                console.log(`Index:      ${identityAccount.index.toString()}`);
                console.log(`Revoked:    ${identityAccount.revoked ? chalk.red('YES') : chalk.green('NO')}`);
                console.log(`Commitment: ${Buffer.from(identityAccount.commitment).toString('hex')}`);
                
                console.log('\n' + chalk.green('✔ Identity is active on Solana Devnet'));

            } catch (e) {
                spinner.fail('Identity PDA not found at address ' + identityPda.toString());
            }

        } catch (e: any) {
            spinner.fail('Failed to fetch status');
            console.error(chalk.red(e));
        }
    });
