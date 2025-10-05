# 🚀 Testnet Deployment Guide

Deploy your Zerify project to Ethereum testnets (Sepolia, Goerli, etc.)

## 📋 Prerequisites

1. **Node.js** (v16+)
2. **MetaMask** browser extension
3. **Testnet ETH** for gas fees
4. **Infura/Alchemy account** (for RPC endpoints)

## 🔧 Setup Steps

### 1. Get Testnet ETH

**Sepolia Testnet (Recommended):**
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

**Other Testnets:**
- [Goerli Faucet](https://goerlifaucet.com/)
- [Mumbai (Polygon)](https://faucet.polygon.technology/)

### 2. Get RPC Endpoint

**Option A: Infura (Free)**
1. Go to [Infura](https://infura.io/)
2. Create account and project
3. Copy your Sepolia endpoint: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

**Option B: Alchemy (Free)**
1. Go to [Alchemy](https://www.alchemy.com/)
2. Create account and app
3. Copy your Sepolia endpoint: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

### 3. Configure Environment

Create `.env.local` file:
```bash
# AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Web3 Configuration  
VITE_WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# Ethereum Testnet Configuration
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
```

**⚠️ Security Note:** Never commit private keys to version control!

### 4. Get Your Private Key

**From MetaMask:**
1. Open MetaMask
2. Click account menu → Account Details
3. Export Private Key
4. Copy the private key (starts with 0x)

## 🚀 Deployment Commands

### Deploy to Sepolia Testnet

```bash
# 1. Install dependencies
npm install

# 2. Compile contracts
npm run compile

# 3. Deploy to Sepolia
npm run deploy:sepolia
```

### Deploy to Other Testnets

**Goerli:**
```bash
# Add to hardhat.config.cjs networks section
goerli: {
  url: process.env.GOERLI_URL || "",
  accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
},

# Deploy
npx hardhat run scripts/deploy.ts --network goerli
```

**Mumbai (Polygon):**
```bash
# Add to hardhat.config.cjs networks section
mumbai: {
  url: process.env.MUMBAI_URL || "",
  accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
},

# Deploy
npx hardhat run scripts/deploy.ts --network mumbai
```

## 📱 Frontend Configuration

### 1. Update Contract Addresses

After deployment, update `services/web3Service.ts`:

```typescript
// Replace with your deployed contract addresses
export const CONTRACT_ADDRESSES = {
  ZERIFY_TOKEN: "0x...", // Your deployed token address
  VERIFICATION_REGISTRY: "0x...", // Your deployed registry address
  TRUST_BADGE_NFT: "0x...", // Your deployed NFT address
};
```

### 2. Update Network Configuration

**For Sepolia:**
- **Network Name:** Sepolia Test Network
- **RPC URL:** Your Infura/Alchemy endpoint
- **Chain ID:** 11155111
- **Currency Symbol:** ETH

### 3. Build and Deploy Frontend

```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# Or serve locally
npm run preview
```

## 🌐 Frontend Hosting Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Netlify
```bash
# Build and deploy
npm run build
# Upload dist/ folder to Netlify
```

### Option 3: GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourusername.github.io/zerify"

# Deploy
npm run build
npx gh-pages -d dist
```

## 🔍 Verification

### 1. Verify Contracts on Etherscan

```bash
# Install hardhat-verify plugin
npm install --save-dev @nomicfoundation/hardhat-verify

# Add to hardhat.config.cjs
require("@nomicfoundation/hardhat-verify");

module.exports = {
  // ... existing config
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
};

# Verify contracts
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 2. Test Your Deployment

1. **Connect MetaMask** to Sepolia testnet
2. **Import test account** with testnet ETH
3. **Test Web3 features:**
   - Connect wallet
   - Claim faucet tokens
   - Stake/unstake tokens
   - Vote on reputation
   - Mint NFTs

## 🐛 Troubleshooting

### Common Issues

**"Insufficient funds"**
- Get more testnet ETH from faucets
- Check gas price settings

**"Contract not deployed"**
- Verify contract addresses in `contract-addresses.json`
- Update frontend configuration

**"Network not supported"**
- Add Sepolia network to MetaMask
- Check RPC URL configuration

**"Transaction failed"**
- Increase gas limit
- Check account balance
- Verify network connection

### Debug Commands

```bash
# Check network connection
npx hardhat console --network sepolia

# Verify contract deployment
npx hardhat verify --list --network sepolia

# Check account balance
npx hardhat run scripts/check-balance.js --network sepolia
```

## 📊 Monitoring

### 1. Track Transactions
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Goerli Etherscan](https://goerli.etherscan.io/)

### 2. Monitor Gas Usage
- Use [Gas Tracker](https://etherscan.io/gastracker)
- Optimize contract gas usage

### 3. Test User Flows
- End-to-end testing
- User experience validation
- Performance monitoring

## 🎯 Production Checklist

- [ ] Contracts deployed and verified
- [ ] Frontend deployed and accessible
- [ ] All Web3 features working
- [ ] MetaMask integration tested
- [ ] Gas optimization completed
- [ ] Security audit passed
- [ ] Documentation updated

## 🚀 Next Steps

1. **Deploy to mainnet** (when ready)
2. **Add more testnets** (Polygon, BSC, etc.)
3. **Implement monitoring** (The Graph, etc.)
4. **Add analytics** (user tracking)
5. **Scale infrastructure** (CDN, etc.)

Your Zerify project is now ready for testnet deployment! 🎉
