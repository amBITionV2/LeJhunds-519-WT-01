# 🪙 Zerify Token Faucet Setup Guide

## Overview
The Zerify Token Faucet allows users to claim 1000 free ZERIFY tokens every 24 hours for testing all Web3 features without needing to manually transfer tokens.

## 🚀 Quick Setup

### 1. Deploy Contracts with Faucet
```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy contracts with faucet
npm run deploy:faucet

# Terminal 3: Start the app
npm run dev
```

### 2. Test the Faucet
1. Open `http://localhost:5173`
2. Connect your MetaMask wallet
3. Click "Claim 1000 Tokens" in the Web3 Dashboard
4. Confirm the transaction in MetaMask
5. You'll receive 1000 ZERIFY tokens instantly!

## 🎯 Features

### Smart Contract Features
- **Faucet Amount**: 1000 ZERIFY tokens per claim
- **Cooldown Period**: 24 hours between claims
- **Balance Check**: Can't claim if you already have 1000+ tokens
- **Event Logging**: All faucet claims are logged on-chain

### UI Features
- **Real-time Status**: Shows if faucet is available or on cooldown
- **Countdown Timer**: Displays time remaining until next claim
- **One-click Claim**: Simple button to claim tokens
- **Auto-refresh**: Updates status automatically

## 🔧 Technical Details

### Smart Contract Functions
```solidity
// Claim tokens from faucet
function claimFaucet() external

// Check if user can claim
function canClaimFaucet(address user) external view returns (bool)

// Get cooldown time remaining
function getFaucetCooldown(address user) external view returns (uint256)
```

### Frontend Integration
```typescript
// Claim faucet tokens
await claimFaucet();

// Check eligibility
const canClaim = await canClaimFaucet(userAddress);

// Get cooldown
const cooldown = await getFaucetCooldown(userAddress);
```

## 🎮 Testing Scenarios

### 1. First Time User
- Connect wallet with 0 ZERIFY tokens
- Click "Claim 1000 Tokens"
- Verify balance increases to 1000
- Button shows "Claim Unavailable" with cooldown timer

### 2. Staking Test
- Claim 1000 tokens from faucet
- Stake 1000 tokens to become validator
- Verify validator status changes
- Test unstaking functionality

### 3. Verification Test
- Claim tokens from faucet
- Submit a URL for verification
- Verify tokens are spent on verification
- Check NFT badges are minted

### 4. Cooldown Test
- Claim tokens from faucet
- Wait for cooldown period (or modify contract for testing)
- Verify button becomes available after cooldown

## 🐛 Troubleshooting

### "Faucet cooldown not expired"
- Wait 24 hours between claims
- Or modify `FAUCET_COOLDOWN` in contract for testing

### "Already have enough tokens"
- User already has 1000+ tokens
- Use tokens for staking or verification first

### "Transaction failed"
- Check MetaMask is connected to correct network
- Ensure account has enough ETH for gas fees
- Verify contract is deployed correctly

## 🔄 Customization

### Modify Faucet Amount
```solidity
// In ZerifyToken.sol
uint256 public constant FAUCET_AMOUNT = 2000 * 10**18; // 2000 tokens
```

### Modify Cooldown Period
```solidity
// In ZerifyToken.sol
uint256 public constant FAUCET_COOLDOWN = 1 hours; // 1 hour cooldown
```

### Add Daily Limit
```solidity
// Add to contract
uint256 public constant DAILY_FAUCET_LIMIT = 5000 * 10**18; // 5000 tokens per day
mapping(address => uint256) public dailyClaimed;
```

## 📊 Benefits

1. **Easy Testing**: No manual token transfers needed
2. **Realistic Experience**: Users experience actual token mechanics
3. **Cost Effective**: No need to buy tokens for testing
4. **User Friendly**: Simple one-click token claiming
5. **Secure**: Built-in cooldown prevents abuse

## 🚀 Next Steps

1. Test all Web3 features with faucet tokens
2. Deploy to testnet for public testing
3. Consider implementing referral rewards
4. Add analytics for faucet usage
5. Implement tiered faucet amounts based on user activity

---

**Happy Testing! 🎉**
