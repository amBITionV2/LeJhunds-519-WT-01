# 🚀 Easy Local Deployment for Zerify

## ⚡ One-Command Setup

### **Super Easy (Recommended):**
```bash
npm run start:local
```
This single command will:
- Install dependencies
- Compile contracts
- Start Hardhat node
- Deploy contracts with faucet
- Start the development server
- Show you test accounts and setup instructions

### **Quick Deploy (If you want to manage services separately):**
```bash
# Deploy contracts only
npm run quick:deploy

# Then start services manually
npm run node    # Terminal 1
npm run dev     # Terminal 2
```

## 🦊 MetaMask Setup Helper

```bash
npm run setup:metamask
```
This shows you:
- Test account private keys
- Step-by-step MetaMask setup
- Network configuration
- Pro tips for testing

## 📋 Manual Steps (If needed)

### 1. **Start Hardhat Node:**
```bash
npm run node
```

### 2. **Deploy Contracts:**
```bash
npm run deploy:faucet
```

### 3. **Start App:**
```bash
npm run dev
```

### 4. **Setup MetaMask:**
- Import test account: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Add network: Hardhat Local (Chain ID: 1337, RPC: http://127.0.0.1:8545)

## 🎯 Test Accounts

| Account | Address | Private Key |
|---------|---------|-------------|
| #0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| #1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d |
| #2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111daa5ba4e5a4b434438e4eac0aa0b7a92bc0c83f4c8d3c602796b78690d |

## 🌐 Network Settings

- **Network Name:** Hardhat Local
- **RPC URL:** http://127.0.0.1:8545
- **Chain ID:** 1337
- **Currency Symbol:** ETH

## 🎮 Testing Features

1. **Connect Wallet** - Use any test account
2. **Claim 1000 Tokens** - Get free tokens from faucet
3. **Stake Tokens** - Become a validator
4. **Submit Verification** - Test URL analysis
5. **Mint NFT Badges** - Get rewards for verification

## 🐛 Troubleshooting

### **"Command not found"**
```bash
npm install
```

### **"Port already in use"**
```bash
# Kill processes using ports 8545 or 5173
npx kill-port 8545
npx kill-port 5173
```

### **"Contract not deployed"**
```bash
npm run quick:deploy
```

### **"MetaMask not connected"**
- Check you're on Hardhat Local network
- Verify Chain ID is 1337
- Try refreshing the page

## 💡 Pro Tips

- **Use Account #0** for easiest setup
- **Keep services running** - don't close terminals
- **Check console output** for detailed logs
- **Use multiple accounts** for different test scenarios
- **Reset MetaMask** if you need a clean slate

## 🚀 Ready to Go!

Once everything is running:
1. Open http://localhost:5173
2. Connect your wallet
3. Claim free tokens
4. Start testing all Web3 features!

---

**Happy Coding! 🎉**
