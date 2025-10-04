// Simple Web3 test script
const { ethers } = require("hardhat");

async function testWeb3() {
  console.log("Testing Web3 functionality...");
  
  try {
    // Get the provider
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
    // Get the first account (deployer)
    const accounts = await provider.listAccounts();
    console.log("Available accounts:", accounts.length);
    
    if (accounts.length > 0) {
      const signer = await provider.getSigner(accounts[0]);
      console.log("Testing with account:", await signer.getAddress());
      
      // Test token balance
      const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const tokenABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function name() view returns (string)",
        "function symbol() view returns (string)"
      ];
      
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const balance = await tokenContract.balanceOf(await signer.getAddress());
      
      console.log("Token Name:", name);
      console.log("Token Symbol:", symbol);
      console.log("Balance:", ethers.formatEther(balance), "tokens");
      
      console.log("✅ Web3 test completed successfully!");
    } else {
      console.log("❌ No accounts found");
    }
    
  } catch (error) {
    console.error("❌ Web3 test failed:", error.message);
  }
}

testWeb3();
