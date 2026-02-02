MinKYC — CLI-First MVP (Privacy-Preserving KYC on Solana)

MinKYC is a minimal, privacy-preserving KYC protocol that allows users to prove specific identity attributes (e.g. age, country eligibility, name match) to platforms without revealing raw personal data, using on-chain commitments and off-chain proof generation.
This MVP is implemented as a CLI-only demo to focus on protocol correctness and architecture.

⸻

Tech Stack
	•	Blockchain: Solana (Devnet)
	•	Smart Contracts: Anchor (Rust)
	•	CLI Runtime: Node.js
	•	Language: TypeScript
	•	CLI Framework: commander (or yargs)
	•	Terminal Styling: chalk (colors), boxen (framing), ora (spinners)
	•	Cryptography: mocked commitment + mocked ZK proof
	•	Storage:
	•	Mocked passport data → local JSON
	•	Secrets → local filesystem
	•	Commitment metadata → Solana PDA

⸻

Context & File References
	•	programs/minkyc/src/lib.rs
Anchor program managing identity PDAs and proof verification
	•	cli/src/index.ts
CLI entrypoint and command router
	•	cli/src/commands/*
Individual CLI commands (init, request, prove, verify)
	•	cli/src/fixtures/passport.json
Mocked passport data for demo
	•	Anchor.toml
Configured for Solana Devnet
	•	.cursorrules
Ensure active

⸻

Goal & Requirements

Core Goals
	•	Demonstrate minimal-disclosure KYC using on-chain commitments
	•	Show how different platforms can request different KYC attributes
	•	Prove that raw identity data never touches the blockchain

Functional Requirements
	•	Create an identity commitment from mocked passport data
	•	Store identity metadata in a PDA (owner, commitment, revoked flag)
	•	Accept platform-defined KYC requirements
	•	Generate a mocked ZK proof locally via CLI
	•	Verify proof on-chain and return true/false
	•	Display every step clearly in the terminal

Constraints
	•	CLI-only (no web UI, no mobile app)
	•	Mocked wallet public key
	•	Mocked ZK verification logic
	•	Open source
	•	Must deploy to Solana Devnet
	•	Keep implementation minimal and readable

⸻

CLI UX & Presentation Guidelines (Important)

The CLI output must be judge-friendly and visually clear.

Terminal Design
	•	Use colors to distinguish roles:
	•	User / Prover → cyan
	•	Platform → yellow
	•	Blockchain / Program → magenta
	•	Success → green
	•	Failure → red
	•	Use boxed sections for major steps
	•	Use spacing and separators between phases
	•	Print short explanations before each action

Example Output Style (Conceptual)

╔════════════════════════════════════╗
║        MinKYC — Identity Init      ║
╚════════════════════════════════════╝

✔ Loaded mocked passport data
✔ Commitment generated
✔ PDA created on Solana Devnet

Owner: 7GkQ...X3p
Status: Active

CLI Commands (Required)

User / Prover Commands
	•	minkyc identity init
	•	loads mocked passport data
	•	generates commitment
	•	creates PDA
	•	minkyc identity status
	•	fetches PDA
	•	displays owner, revoked flag, commitment hash
	•	minkyc prove
	•	loads platform request
	•	generates mocked ZK proof
	•	submits proof to chain

⸻

Platform Commands (Discord / Chairtime Simulator)
	•	minkyc platform request
	•	defines KYC requirements such as:
	•	--over-18
	•	--country-not Iran,NorthKorea,Afghanistan
	•	--name

⸻

Verification Command
	•	minkyc verify
	•	runs on-chain verification
	•	prints result (approved / rejected)

⸻

On-Chain Program Responsibilities
	•	Maintain identity PDA:
	•	owner pubkey
	•	commitment hash
	•	revoked flag
	•	Accept proof verification instructions
	•	Validate proof (mocked logic)
	•	Emit clear logs for demo purposes

⸻

Implementation Plan
	1.	Scaffold Anchor program for identity PDA
	2.	Implement PDA creation and state layout
	3.	Create CLI skeleton with command routing
	4.	Add mocked passport fixture + commitment logic
	5.	Implement platform request flow
	6.	Implement mocked proof generation
	7.	Wire CLI to on-chain verification
	8.	Polish terminal output for demo
	9.	Deploy program to Solana Devnet
	10.	Document full demo flow in README

⸻

Please review these instructions, summarize your understanding, and propose an implementation plan before writing any code.