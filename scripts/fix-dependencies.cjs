const { spawn } = require('child_process');

console.log('🔧 Fixing Hardhat Dependencies...\n');

async function fixDependencies() {
  try {
    console.log('📦 Installing missing Hardhat ethers dependency...');
    await runCommand('npm', ['install', '--save-dev', '@nomicfoundation/hardhat-ethers@^3.1.0']);
    
    console.log('✅ Dependencies fixed!');
    console.log('\n🚀 You can now run:');
    console.log('npm run start:local');
    
  } catch (error) {
    console.error('❌ Failed to fix dependencies:', error.message);
    console.log('\n🔧 Manual fix:');
    console.log('npm install --save-dev @nomicfoundation/hardhat-ethers@^3.1.0');
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

fixDependencies();
