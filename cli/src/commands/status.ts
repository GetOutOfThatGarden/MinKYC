import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getProvider, getProgram } from '../utils/connection';
import { PublicKey } from '@solana/web3.js';

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
            
            const [identityPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("identity"), owner.toBuffer()],
                program.programId
            );

            // Fetch account
            try {
                const identityAccount = await program.account.identity.fetch(identityPda);
                
                spinner.stop();
                
                console.log(chalk.bold('Identity PDA Found:'));
                console.log(`Address:    ${identityPda.toString()}`);
                console.log(`Owner:      ${identityAccount.owner.toString()}`);
                console.log(`Revoked:    ${identityAccount.revoked ? chalk.red('YES') : chalk.green('NO')}`);
                console.log(`Commitment: ${Buffer.from(identityAccount.commitment).toString('hex')}`);
                
                console.log('\n' + chalk.green('✔ Identity is active on Solana Devnet'));

            } catch (e) {
                spinner.fail('Identity PDA not found');
                console.log(chalk.yellow(`\nNo identity found for owner: ${owner.toString()}`));
                console.log('Run "minkyc identity init" to create one.');
            }

        } catch (e: any) {
            spinner.fail('Failed to fetch status');
            console.error(chalk.red(e));
        }
    });
