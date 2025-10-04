const { spawn, exec } = require('child_process');
const net = require('net');

console.log('🔧 Fixing Localhost Issues...\n');

// Kill processes on common ports
async function killPorts() {
  const ports = [3000, 5173, 8545];
  
  for (const port of ports) {
    try {
      await new Promise((resolve) => {
        exec(`npx kill-port ${port}`, (error) => {
          if (!error) {
            console.log(`✅ Killed processes on port ${port}`);
          }
          resolve();
        });
      });
    } catch (error) {
      // Ignore errors
    }
  }
}

// Check if port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => {
        resolve(false); // Available
      });
      server.close();
    });
    server.on('error', () => {
      resolve(true); // In use
    });
  });
}

async function fixLocalhost() {
  try {
    console.log('🔍 Checking for port conflicts...');
    
    // Kill conflicting processes
    await killPorts();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check ports again
    const port5173 = await checkPort(5173);
    const port3000 = await checkPort(3000);
    
    console.log(`\n📊 Port Status:`);
    console.log(`  Port 5173: ${port5173 ? '🔴 In Use' : '✅ Available'}`);
    console.log(`  Port 3000: ${port3000 ? '🔴 In Use' : '✅ Available'}`);
    
    if (port5173) {
      console.log('\n⚠️  Port 5173 is still in use. Trying alternative port...');
    }
    
    console.log('\n🚀 Starting development server...');
    
    // Start the dev server
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    devProcess.on('error', (error) => {
      console.error('❌ Failed to start dev server:', error.message);
    });
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping dev server...');
      devProcess.kill();
      process.exit(0);
    });
    
    // Wait for the process
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.log('\n🔧 Manual steps:');
    console.log('1. Close all terminal windows');
    console.log('2. Run: npm run dev');
    console.log('3. Check: http://localhost:5173');
    process.exit(1);
  }
}

fixLocalhost();
