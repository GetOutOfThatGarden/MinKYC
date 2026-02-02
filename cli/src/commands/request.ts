/**
 * MinKYC Platform Request Generator
 * 
 * This command simulates a relying party (e.g., a crypto exchange or app) requesting KYC.
 * It generates a JSON file defining the requirements for the user.
 * 
 * Options:
 * --over-18       : Require the user to be over 18 years old.
 * --country-not   : Comma-separated list of disallowed country codes (e.g., "USA,CAN").
 * --name          : Require a name match (mock).
 * 
 * Usage:
 * $ npx tsx cli/src/index.ts platform request --over-18
 * 
 * Output:
 * - Saves requirements to `request.json` for the `prove` command to use.
 */
import { Command } from 'commander';
import fs from 'fs';
import chalk from 'chalk';

export const requestCommand = new Command('request')
    .description('Generate platform KYC request')
    .option('--over-18', 'Require user to be over 18')
    .option('--country-not <countries>', 'Disallowed countries (comma separated)')
    .option('--name', 'Require name match')
    .action((options) => {
        console.log(chalk.yellow('╔════════════════════════════════════╗'));
        console.log(chalk.yellow('║      MinKYC — Platform Request     ║'));
        console.log(chalk.yellow('╚════════════════════════════════════╝\n'));
        
        const request = {
            requirements: {
                over18: options.over18 || false,
                countryNot: options.countryNot ? options.countryNot.split(',') : [],
                nameMatch: options.name || false
            },
            timestamp: Date.now()
        };
        
        fs.writeFileSync('request.json', JSON.stringify(request, null, 2));
        console.log(chalk.green('✔ Request generated successfully'));
        console.log(chalk.dim(JSON.stringify(request, null, 2)));
        console.log(chalk.yellow('\nNext: Run "minkyc prove" to generate proof.'));
    });
