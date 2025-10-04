const { spawn, exec } = require('child_process');
const net = require('net');

console.log('🔍 Zerify Troubleshooting Tool\n');

// Check if port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false); // Port is available
      });
      server.close();
    });
    server.on('error', () => {
      resolve(true); // Port is in use
    });
  });
}

// Kill process on port
function killPort(port) {
  return new Promise((resolve) => {
    exec(`npx kill-port ${port}`, (error) => {
      if (error) {
        console.log(`⚠️  Could not kill port ${port}: ${error.message}`);
      } else {
        console.log(`✅ Killed processes on port ${port}`);
      }
      resolve();
    });
  });
}

// Check if file exists
function checkFile(filePath) {
  const fs = require('fs');
  return fs.existsSync(filePath);
}

async function troubleshoot() {
  console.log('🔍 Running diagnostics...\n');

  // Check required files
  console.log('📁 Checking required files:');
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'index.html',
    'src/main.tsx',
    'contracts/ZerifyToken.sol'
  ];

  for (const file of requiredFiles) {
    const exists = checkFile(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  }

  // Check ports
  console.log('\n🌐 Checking ports:');
  const port5173 = await checkPort(5173);
  const port8545 = await checkPort(8545);
  const port3000 = await checkPort(3000);

  console.log(`  ${port5173 ? '🔴' : '✅'} Port 5173 (Vite dev server)`);
  console.log(`  ${port8545 ? '🔴' : '✅'} Port 8545 (Hardhat node)`);
  console.log(`  ${port3000 ? '🔴' : '✅'} Port 3000 (Alternative)`);

  // Kill conflicting processes
  if (port5173) {
    console.log('\n🔧 Killing processes on port 5173...');
    await killPort(5173);
  }

  if (port3000) {
    console.log('\n🔧 Killing processes on port 3000...');
    await killPort(3000);
  }

  // Check Node.js version
  console.log('\n📦 Checking Node.js version:');
  exec('node --version', (error, stdout) => {
    if (error) {
      console.log('  ❌ Node.js not found');
    } else {
      console.log(`  ✅ Node.js ${stdout.trim()}`);
    }
  });

  // Check npm version
  exec('npm --version', (error, stdout) => {
    if (error) {
      console.log('  ❌ npm not found');
    } else {
      console.log(`  ✅ npm ${stdout.trim()}`);
    }
  });

  console.log('\n🚀 Troubleshooting complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Try: npm run start:local');
  console.log('2. Or: npm run dev');
  console.log('3. Check: http://localhost:5173');
  console.log('4. If still issues, try: npm run fix:deps');
}

troubleshoot();
