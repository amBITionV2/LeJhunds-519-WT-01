// MetaMask Setup Helper
// This script helps users set up MetaMask for local development

console.log('🦊 MetaMask Setup Helper for Zerify Local Development\n');

const testAccounts = [
  {
    name: 'Account #0 (Recommended)',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    balance: '10000 ETH'
  },
  {
    name: 'Account #1',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    balance: '10000 ETH'
  },
  {
    name: 'Account #2',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111daa5ba4e5a4b434438e4eac0aa0b7a92bc0c83f4c8d3c602796b78690d',
    balance: '10000 ETH'
  }
];

console.log('📋 Test Accounts Available:');
console.log('========================\n');

testAccounts.forEach((account, index) => {
  console.log(`${account.name}:`);
  console.log(`  Address: ${account.address}`);
  console.log(`  Private Key: ${account.privateKey}`);
  console.log(`  Balance: ${account.balance}\n`);
});

console.log('🔧 MetaMask Setup Instructions:');
console.log('==============================\n');

console.log('1. 📥 Import Account:');
console.log('   - Open MetaMask');
console.log('   - Click account icon → "Import Account"');
console.log('   - Select "Private Key"');
console.log('   - Paste any private key from above');
console.log('   - Click "Import"\n');

console.log('2. 🌐 Add Hardhat Network:');
console.log('   - Network Name: Hardhat Local');
console.log('   - RPC URL: http://127.0.0.1:8545');
console.log('   - Chain ID: 1337');
console.log('   - Currency Symbol: ETH\n');

console.log('3. ✅ Verify Setup:');
console.log('   - Check account shows 10,000 ETH');
console.log('   - Network shows "Hardhat Local"');
console.log('   - Chain ID is 1337\n');

console.log('4. 🚀 Test the App:');
console.log('   - Open http://localhost:5173');
console.log('   - Click "Connect Wallet"');
console.log('   - Click "Claim 1000 Tokens"');
console.log('   - Start testing all features!\n');

console.log('💡 Pro Tips:');
console.log('- Use Account #0 for easiest setup');
console.log('- Keep private keys safe (test only)');
console.log('- Each account has unlimited ETH for gas');
console.log('- You can import multiple accounts for testing\n');

module.exports = { testAccounts };
