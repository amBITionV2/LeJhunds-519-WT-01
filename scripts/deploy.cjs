const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Zerify contracts...");

  // Deploy ZerifyToken
  const ZerifyToken = await ethers.getContractFactory("ZerifyToken");
  const zerifyToken = await ZerifyToken.deploy();
  await zerifyToken.waitForDeployment();
  console.log("ZerifyToken deployed to:", await zerifyToken.getAddress());

  // Deploy VerificationRegistry
  const VerificationRegistry = await ethers.getContractFactory("VerificationRegistry");
  const verificationRegistry = await VerificationRegistry.deploy();
  await verificationRegistry.waitForDeployment();
  console.log("VerificationRegistry deployed to:", await verificationRegistry.getAddress());

  // Deploy TrustBadgeNFT
  const TrustBadgeNFT = await ethers.getContractFactory("TrustBadgeNFT");
  const trustBadgeNFT = await TrustBadgeNFT.deploy();
  await trustBadgeNFT.waitForDeployment();
  console.log("TrustBadgeNFT deployed to:", await trustBadgeNFT.getAddress());

  // Save contract addresses to a file for frontend use
  const contractAddresses = {
    ZERIFY_TOKEN: await zerifyToken.getAddress(),
    VERIFICATION_REGISTRY: await verificationRegistry.getAddress(),
    TRUST_BADGE_NFT: await trustBadgeNFT.getAddress(),
  };

  const fs = require('fs');
  fs.writeFileSync(
    './contract-addresses.json',
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("\nContract addresses saved to contract-addresses.json");
  console.log("Update your frontend services/web3Service.ts with these addresses:");
  console.log(JSON.stringify(contractAddresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
