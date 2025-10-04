const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Zerify Local Development Environment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'hardhat.config.cjs',
  'contracts/ZerifyToken.sol'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Required file missing: ${file}`);
    process.exit(1);
  }
}

// Function to run command and handle output
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Function to wait for a service to be ready
function waitForService(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkService = () => {
      fetch(url)
        .then(() => {
          console.log(`✅ Service ready at ${url}`);
          resolve();
        })
        .catch(() => {
          if (Date.now() - startTime > timeout) {
            reject(new Error(`Service not ready after ${timeout}ms`));
          } else {
            setTimeout(checkService, 1000);
          }
        });
    };
    
    checkService();
  });
}

async function startLocalDevelopment() {
  try {
    console.log('📦 Installing dependencies...');
    await runCommand('npm', ['install', '--legacy-peer-deps']);
    
    // Install missing Hardhat dependency if needed
    console.log('🔧 Installing missing Hardhat dependencies...');
    try {
      await runCommand('npm', ['install', '--save-dev', '@nomicfoundation/hardhat-ethers@^3.1.0']);
    } catch (error) {
      console.log('⚠️  Hardhat ethers dependency already installed or failed to install');
    }
    
    console.log('\n🔨 Compiling contracts...');
    await runCommand('npm', ['run', 'compile']);
    
    console.log('\n🌐 Starting Hardhat node...');
    const hardhatProcess = spawn('npm', ['run', 'node'], {
      stdio: 'pipe',
      shell: true
    });

    // Wait for Hardhat to start
    console.log('⏳ Waiting for Hardhat node to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n📝 Deploying contracts with faucet...');
    await runCommand('npm', ['run', 'deploy:faucet']);
    
    console.log('\n🌍 Starting development server...');
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });

    // Wait for dev server to start
    console.log('⏳ Waiting for development server to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n🎉 Zerify is now running!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open http://localhost:5173 in your browser');
    console.log('2. Import a test account from the Hardhat output above');
    console.log('3. Add Hardhat network to MetaMask (Chain ID: 1337)');
    console.log('4. Click "Claim 1000 Tokens" to get free tokens for testing!');
    console.log('\n🔑 Test Account Private Keys (copy any one):');
    console.log('Account #0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
    console.log('Account #1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
    console.log('Account #2: 0x5de4111daa5ba4e5a4b434438e4eac0aa0b7a92bc0c83f4c8d3c602796b29222');
    console.log('\n⚡ All services are running in the background');
    console.log('Press Ctrl+C to stop all services');

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping all services...');
      hardhatProcess.kill();
      devProcess.kill();
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Error starting local development:', error.message);
    process.exit(1);
  }
}

startLocalDevelopment();
