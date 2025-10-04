# Zerify Web3 Setup Guide

This guide will help you set up the Web3 features for your Zerify application locally.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Git** for version control

## Step 1: Install Dependencies

```bash
# Install all dependencies including Hardhat (use legacy peer deps to avoid conflicts)
npm install --legacy-peer-deps

# If you encounter issues, try:
npm install --force

# Install Hardhat globally (optional)
npm install -g hardhat
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Get a Web3.Storage token:
   - Go to [web3.storage](https://web3.storage/)
   - Sign up and get your API token
   - Add it to your `.env` file:
   ```
   WEB3_STORAGE_TOKEN=your_actual_token_here
   ```

## Step 3: Deploy Smart Contracts Locally

### Option A: Local Hardhat Network (Recommended for development)

1. **Start a local Hardhat node:**
```bash
npm run node
```
This will start a local blockchain on `http://127.0.0.1:8545`

2. **In a new terminal, deploy contracts:**
```bash
npm run deploy
```

3. **Update MetaMask:**
   - Add a new network:
     - Network Name: `Hardhat Local`
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `1337`
     - Currency Symbol: `ETH`
   - Import the first account from the Hardhat output (it has 10,000 ETH for testing)

### Option B: Sepolia Testnet (For production testing)

1. **Get testnet ETH:**
   - Use [Sepolia Faucet](https://sepoliafaucet.com/)
   - Or [Alchemy Faucet](https://sepoliafaucet.com/)

2. **Update your `.env` file:**
   ```
   SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy to Sepolia:**
```bash
npm run deploy:sepolia
```

## Step 4: Update Frontend Configuration

After deployment, you'll get contract addresses. Update `services/web3Service.ts`:

```typescript
const CONTRACT_ADDRESSES = {
  ZERIFY_TOKEN: '0x...', // Replace with actual deployed address
  VERIFICATION_REGISTRY: '0x...', // Replace with actual deployed address
  TRUST_BADGE_NFT: '0x...', // Replace with actual deployed address
};
```

## Step 5: Initialize Web3 Services in Your App

Update your main App component to initialize Web3 services:

```typescript
import { initializeWeb3Services } from './services/web3Service';

// In your App component or main entry point
useEffect(() => {
  const initWeb3 = async () => {
    try {
      await initializeWeb3Services(process.env.WEB3_STORAGE_TOKEN || '');
      console.log('Web3 services initialized');
    } catch (error) {
      console.error('Failed to initialize Web3 services:', error);
    }
  };
  
  initWeb3();
}, []);
```

## Step 6: Test the Web3 Features

1. **Start your development server:**
```bash
npm run dev
```

2. **Connect MetaMask** to your local network
3. **Test the features:**
   - Connect wallet
   - Submit verifications
   - Check token balance
   - Mint badges

## Available Web3 Features

### 🔗 **Smart Contract Integration**
- **ZerifyToken**: ERC-20 token for rewards and staking
- **VerificationRegistry**: On-chain verification storage
- **TrustBadgeNFT**: NFT badges for verified sources

### 📦 **IPFS Integration**
- Real IPFS storage via Web3.Storage
- Fallback to mock IPFS for development
- Decentralized content addressing

### 🎯 **Token Economics**
- Earn tokens for accurate verifications
- Stake tokens to become a validator
- Reputation-based rewards

### 🏆 **NFT Badges**
- Verified Source Badges
- Trusted Verifier Badges
- Verification Certificates

### 🗳️ **Dispute System**
- Create disputes for questionable verifications
- Community-driven resolution
- Reputation-based voting

## Troubleshooting

### Common Issues:

1. **"MetaMask not installed"**
   - Install MetaMask browser extension
   - Refresh the page

2. **"Insufficient funds"**
   - Get testnet ETH from faucets
   - Or use local Hardhat network (has unlimited ETH)

3. **"Contract not deployed"**
   - Run `npm run deploy` first
   - Check contract addresses in `contract-addresses.json`

4. **"IPFS upload failed"**
   - Check your Web3.Storage token
   - Ensure you have sufficient storage quota

### Development Tips:

1. **Reset local blockchain:**
   ```bash
   # Stop Hardhat node (Ctrl+C)
   # Delete cache and restart
   rm -rf cache artifacts
   npm run node
   npm run deploy
   ```

2. **View contract interactions:**
   - Use Hardhat console: `npx hardhat console --network localhost`
   - Check transactions on Etherscan (for testnet)

3. **Debug smart contracts:**
   ```bash
   npm run test
   ```

## Next Steps

1. **Customize smart contracts** for your specific needs
2. **Add more Web3 features** like DAO governance
3. **Deploy to mainnet** when ready for production
4. **Implement advanced features** like cross-chain support

## Support

- Check the [Hardhat documentation](https://hardhat.org/docs)
- Visit [Web3.Storage docs](https://web3.storage/docs/)
- Join our community for help and updates

Happy coding! 🚀
