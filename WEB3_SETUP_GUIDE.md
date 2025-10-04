# Web3 Setup Guide for Zerify

This guide will help you set up the Web3 functionality for the Zerify application.

## Prerequisites

1. **MetaMask Extension**: Install MetaMask browser extension
2. **Node.js**: Version 18 or higher
3. **Git**: For cloning the repository

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile Smart Contracts

```bash
npm run compile
```

### 3. Deploy Contracts to Local Network

```bash
# Start Hardhat node (in one terminal)
npm run node

# Deploy contracts (in another terminal)
npm run deploy
```

### 4. Configure MetaMask

1. Open MetaMask extension
2. Click on the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add network" → "Add network manually"
4. Enter the following details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: (leave empty)

### 5. Import Test Account

The Hardhat node provides test accounts with pre-funded ETH. To import one:

1. In MetaMask, click the account icon → "Import Account"
2. Select "Private Key" as import type
3. Use this private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
4. This account has 10,000 ETH for testing

### 6. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Web3 Configuration  
WEB3_STORAGE_TOKEN=your_web3_storage_token_here
```

### 7. Start the Application

```bash
npm run dev
```

## Web3 Features

Once set up, you'll have access to:

- **Token Balance**: View your ZERIFY token balance
- **Staking**: Stake tokens to become a validator
- **Reputation System**: Earn reputation points for accurate verifications
- **NFT Badges**: Receive NFT badges for achievements
- **Blockchain Verification**: Submit verification results to the blockchain
- **Decentralized Watchlist**: Store watchlist data on IPFS

## Contract Addresses

The deployed contracts are automatically configured in `services/web3Service.ts`:

- **ZerifyToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **VerificationRegistry**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **TrustBadgeNFT**: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is unlocked
- Check that you're on the correct network (Hardhat Local)
- Try refreshing the page

### Contract Interaction Errors
- Verify the Hardhat node is running
- Check that contracts are deployed
- Ensure you have sufficient ETH for gas fees

### IPFS Issues
- Verify your Web3.storage token is correct
- Check network connectivity

## Development Notes

- The application uses Hardhat's local network for development
- All contract addresses are hardcoded for the local network
- For production deployment, update contract addresses in `web3Service.ts`
- The application gracefully handles Web3 failures and continues without blockchain features
