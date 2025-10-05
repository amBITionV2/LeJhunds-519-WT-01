const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Zerify Testnet Deployment Script');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create .env.local with your configuration:');
  console.log(`
VITE_GEMINI_API_KEY=your_gemini_api_key_here
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_here
  `);
  process.exit(1);
}

// Check environment variables
require('dotenv').config({ path: envPath });

const requiredVars = ['SEPOLIA_URL', 'PRIVATE_KEY'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`  - ${varName}`));
  console.log('\nPlease update your .env.local file.');
  process.exit(1);
}

console.log('✅ Environment configuration found');
console.log('✅ Sepolia RPC URL configured');
console.log('✅ Private key configured\n');

// Deployment steps
const steps = [
  {
    name: 'Installing dependencies',
    command: 'npm install',
    description: 'Installing required packages...'
  },
  {
    name: 'Compiling contracts',
    command: 'npm run compile',
    description: 'Compiling Solidity contracts...'
  },
  {
    name: 'Deploying to Sepolia',
    command: 'npm run deploy:sepolia',
    description: 'Deploying contracts to Sepolia testnet...'
  }
];

async function runStep(step, index) {
  console.log(`[${index + 1}/${steps.length}] ${step.name}`);
  console.log(`📝 ${step.description}`);
  
  try {
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✅ ${step.name} completed\n`);
  } catch (error) {
    console.log(`❌ ${step.name} failed:`);
    console.log(error.message);
    process.exit(1);
  }
}

async function deploy() {
  console.log('Starting deployment process...\n');
  
  for (let i = 0; i < steps.length; i++) {
    await runStep(steps[i], i);
  }
  
  console.log('🎉 Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Check contract-addresses.json for deployed addresses');
  console.log('2. Update your frontend services/web3Service.ts');
  console.log('3. Add Sepolia network to MetaMask');
  console.log('4. Test your deployed contracts');
  console.log('\n🔗 Useful links:');
  console.log('- Sepolia Etherscan: https://sepolia.etherscan.io/');
  console.log('- Sepolia Faucet: https://sepoliafaucet.com/');
  console.log('- MetaMask Network Config: https://chainlist.org/');
}

deploy().catch(console.error);
