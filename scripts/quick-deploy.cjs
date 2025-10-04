const { spawn } = require('child_process');
const fs = require('fs');

console.log('⚡ Quick Deploy for Zerify Local Development\n');

async function quickDeploy() {
  try {
    // Step 1: Compile contracts
    console.log('🔨 Compiling contracts...');
    await runCommand('npm', ['run', 'compile']);
    
    // Step 2: Deploy with faucet
    console.log('📝 Deploying contracts with faucet...');
    await runCommand('npm', ['run', 'deploy:faucet']);
    
    // Step 3: Show setup instructions
    console.log('\n🎉 Deployment Complete!');
    console.log('\n📋 Quick Setup:');
    console.log('1. Start Hardhat node: npm run node');
    console.log('2. Start app: npm run dev');
    console.log('3. Import test account (see instructions below)');
    console.log('4. Add Hardhat network to MetaMask');
    console.log('5. Claim 1000 free tokens and start testing!\n');
    
    // Show test accounts
    console.log('🔑 Test Account Private Keys:');
    console.log('Account #0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
    console.log('Account #1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
    console.log('Account #2: 0x5de4111daa5ba4e5a4b434438e4eac0aa0b7a92bc0c83f4c8d3c602796b78690d\n');
    
    console.log('🌐 Hardhat Network Settings:');
    console.log('Network Name: Hardhat Local');
    console.log('RPC URL: http://127.0.0.1:8545');
    console.log('Chain ID: 1337');
    console.log('Currency Symbol: ETH\n');
    
  } catch (error) {
    console.error('❌ Quick deploy failed:', error.message);
    process.exit(1);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

quickDeploy();
