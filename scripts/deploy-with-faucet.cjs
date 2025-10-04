const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Zerify contracts with Faucet functionality...\n");

  // Get the contract factory
  const ZerifyToken = await ethers.getContractFactory("ZerifyToken");
  const VerificationRegistry = await ethers.getContractFactory("VerificationRegistry");
  const TrustBadgeNFT = await ethers.getContractFactory("TrustBadgeNFT");

  // Deploy contracts
  console.log("📝 Deploying ZerifyToken...");
  const zerifyToken = await ZerifyToken.deploy();
  await zerifyToken.waitForDeployment();
  const tokenAddress = await zerifyToken.getAddress();
  console.log("✅ ZerifyToken deployed to:", tokenAddress);

  console.log("📝 Deploying VerificationRegistry...");
  const verificationRegistry = await VerificationRegistry.deploy();
  await verificationRegistry.waitForDeployment();
  const registryAddress = await verificationRegistry.getAddress();
  console.log("✅ VerificationRegistry deployed to:", registryAddress);

  console.log("📝 Deploying TrustBadgeNFT...");
  const trustBadgeNFT = await TrustBadgeNFT.deploy();
  await trustBadgeNFT.waitForDeployment();
  const nftAddress = await trustBadgeNFT.getAddress();
  console.log("✅ TrustBadgeNFT deployed to:", nftAddress);

  // Save contract addresses
  const contractAddresses = {
    ZERIFY_TOKEN: tokenAddress,
    VERIFICATION_REGISTRY: registryAddress,
    TRUST_BADGE_NFT: nftAddress,
    NETWORK: "hardhat"
  };

  const fs = require('fs');
  fs.writeFileSync('contract-addresses.json', JSON.stringify(contractAddresses, null, 2));

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("ZerifyToken:", tokenAddress);
  console.log("VerificationRegistry:", registryAddress);
  console.log("TrustBadgeNFT:", nftAddress);
  
  console.log("\n🪙 Faucet Features:");
  console.log("- Users can claim 1000 ZERIFY tokens every 24 hours");
  console.log("- Perfect for testing all Web3 features");
  console.log("- No need to manually transfer tokens for testing");
  
  console.log("\n🚀 Next Steps:");
  console.log("1. Start your app: npm run dev");
  console.log("2. Connect MetaMask to Hardhat network (Chain ID: 1337)");
  console.log("3. Import a test account from Hardhat node output");
  console.log("4. Click 'Claim 1000 Tokens' to get free tokens for testing!");
  console.log("5. Test staking, verification, and NFT minting features");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
