🛡️ Decentralized Insurance Platform

A peer-to-peer insurance protocol where users pool ETH to cover shared risks, with on-chain claims submission, multi-assessor voting, and admin-controlled payouts.

Show Image Show Image Show Image Show Image

📖 Overview

This project implements a decentralized insurance system on Ethereum. Instead of a traditional insurer, users form coverage pools by contributing ETH. Members of a pool can submit claims against it, which are reviewed and voted on by assessors before being approved for payout. All pool activity, claims, and votes are recorded on-chain for full transparency.

✨ Features
🏊 Coverage pools — create a pool with a minimum contribution and coverage limit; other users can join by contributing ETH
📝 Claims submission — pool members can submit claims with a description and requested amount
🗳️ Assessor voting — claims require a configurable number of assessor approvals before being marked Approved
🔐 Role-based access — Admin and Assessor roles managed via OpenZeppelin's AccessControl
💸 Admin payouts — approved claims are finalized and paid out by an admin account
📊 Live transaction ledger — the frontend surfaces a running log of on-chain actions for transparency during testing
🛠️ Tech Stack
Layer	Technology
Smart Contract	Solidity ^0.8.25, OpenZeppelin (AccessControl)
Dev Environment	Hardhat v2
Frontend	HTML, CSS, JavaScript
Blockchain Interaction	Ethers.js v5
Wallet	MetaMask
Local Network	Hardhat Network (Chain ID 31337)
📁 Project Structure
decentralized-insurance/
├── contracts/
│   └── decentralized.sol       # Main insurance contract
├── scripts/
│   └── deploy.js                # Deployment script
├── test/                         # Contract test suite
├── ignition/                     # Hardhat Ignition deployment modules
├── deployments/
│   └── deployment-info.json     # Latest deployment address & ABI reference
├── hardhat.config.js
└── README.md

The frontend (HTML/CSS/JS + Ethers.js) lives in a separate Replit project and connects to this contract once deployed.

🚀 Getting Started
Prerequisites
Node.js (v18+)
MetaMask browser extension
Installation
bash
git clone https://github.com/AllayahCodes/Decentralized-Insurance-Platform.git
cd Decentralized-Insurance-Platform
npm install
Compile the contract
bash
npx hardhat compile
Run a local blockchain

In one terminal, start a local Hardhat node:

bash
npx hardhat node

This prints 20 test accounts with pre-funded ETH and their private keys — useful for testing multiple roles (e.g. multiple assessors) via MetaMask.

Deploy the contract

In a separate terminal, with the node still running:

bash
npx hardhat run scripts/deploy.js --network localhost

This deploys the contract and prints its address, which the frontend needs to connect.

Connect MetaMask
Add a custom network in MetaMask: Hardhat Local, RPC URL http://127.0.0.1:8545, Chain ID 31337
Import one or more test accounts using the private keys printed by npx hardhat node
✅ Testing
bash
npx hardhat test
⚠️ Known Limitations
 payClaim currently has no on-chain admin check — payout restriction is enforced at the frontend level only. An on-chain require check is planned before any public/testnet deployment.
 Currently deployed and tested on a local Hardhat network only; not yet deployed to a public testnet or mainnet.
👤 Author

Built by Allayah Anderson
