# 🚀 Zerify Web3 Quick Start Guide

Get your Web3 features running in 5 minutes!

## ✅ Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MetaMask browser extension
- [ ] Git installed

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Start Local Blockchain
```bash
# Terminal 1: Start Hardhat node
npm run node
```
Keep this terminal running!

### Step 3: Deploy Contracts & Start App
```bash
# Terminal 2: Deploy contracts
npm run deploy

# Terminal 3: Start the app
npm run dev
```

## 🎯 Test Web3 Features

1. **Open your browser** to `http://localhost:5173`
2. **Connect MetaMask** to local network (Chain ID: 1337)
3. **Import test account** from Hardhat output (has 10,000 ETH)
4. **Test verification** - submit a URL and watch the Web3 magic!

## 🔧 MetaMask Setup

### Add Local Network:
- **Network Name**: `Hardhat Local`
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `1337`
- **Currency Symbol**: `ETH`

### Import Test Account:
Copy the first private key from the Hardhat node output and import it into MetaMask.

## 🎉 What You'll See

- ✅ **Wallet Connection** - Connect your MetaMask wallet
- ✅ **Token Balance** - View your ZERIFY token balance
- ✅ **Reputation Score** - Track your verification reputation
- ✅ **NFT Badges** - Mint badges for verified sources
- ✅ **Blockchain Verification** - Submit verifications to smart contracts
- ✅ **IPFS Storage** - Store reports on decentralized storage

## 🐛 Troubleshooting

### "MetaMask not installed"
- Install MetaMask browser extension
- Refresh the page

### "Insufficient funds"
- Use the test account from Hardhat (has unlimited ETH)
- Or get testnet ETH from faucets

### "Contract not deployed"
- Make sure you ran `npm run deploy`
- Check contract addresses in `contract-addresses.json`

### "IPFS upload failed"
- This is expected in demo mode
- App will fallback to mock IPFS

## 🚀 Next Steps

1. **Get Web3.Storage token** from https://web3.storage/
2. **Add token to .env file**
3. **Deploy to testnet** for public testing
4. **Customize contracts** for your needs

## 📚 Full Documentation

See `WEB3_SETUP.md` for complete setup instructions and advanced features.

---

**Happy coding! 🎉**
