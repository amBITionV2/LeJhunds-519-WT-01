# ⚡ Quick Testnet Deployment

## 🚀 One-Command Deployment

```bash
npm run deploy:testnet
```

## 📋 Prerequisites (5 minutes)

### 1. Get Testnet ETH
- Go to [Sepolia Faucet](https://sepoliafaucet.com/)
- Connect your MetaMask wallet
- Request testnet ETH (0.1 ETH should be enough)

### 2. Get RPC Endpoint
- Go to [Infura](https://infura.io/) (free)
- Create account → New Project
- Copy your Sepolia endpoint

### 3. Get Private Key
- Open MetaMask → Account Details → Export Private Key
- Copy your private key (starts with 0x)

### 4. Create Environment File
Create `.env.local`:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
```

## 🎯 Deploy Now

```bash
# 1. Install dependencies
npm install

# 2. Deploy to testnet
npm run deploy:testnet
```

## ✅ After Deployment

1. **Check `contract-addresses.json`** for your deployed addresses
2. **Update frontend** with new contract addresses
3. **Add Sepolia to MetaMask:**
   - Network Name: Sepolia Test Network
   - RPC URL: Your Infura endpoint
   - Chain ID: 11155111
   - Currency: ETH

## 🧪 Test Your Deployment

1. Connect MetaMask to Sepolia
2. Visit your deployed frontend
3. Test Web3 features:
   - Connect wallet
   - Claim faucet tokens
   - Stake tokens
   - Vote on reputation
   - Mint NFTs

## 🆘 Need Help?

- **No ETH?** Get more from [Sepolia Faucet](https://sepoliafaucet.com/)
- **RPC issues?** Try [Alchemy](https://alchemy.com/) instead
- **Contract errors?** Check gas limit and balance
- **Frontend issues?** Verify contract addresses

Your Zerify project will be live on testnet in minutes! 🎉
