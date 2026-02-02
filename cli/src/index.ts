#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { statusCommand } from './commands/status';
import { requestCommand } from './commands/request';
import { proveCommand, proveAction } from './commands/prove';

const program = new Command();

program
    .name('minkyc')
    .description('MinKYC — Privacy-Preserving KYC on Solana')
    .version('0.1.0');

// Identity Commands Group
const identity = program.command('identity')
    .description('Manage identity PDA');

identity.addCommand(initCommand);
identity.addCommand(statusCommand);

// Platform Commands Group
const platform = program.command('platform')
    .description('Platform simulation commands');

platform.addCommand(requestCommand);

// Verify Command (alias for prove in this MVP context, or root command)
program.addCommand(proveCommand);

// Also add verify as an alias/duplicate for convenience if user follows "Verification Command" section strictly
program
    .command('verify')
    .description('Run on-chain verification (Alias for prove)')
    .action(async () => {
        console.log(chalk.yellow("Running verification (alias to 'prove')..."));
        await proveAction();
    });


program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
