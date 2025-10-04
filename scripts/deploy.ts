import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Zerify contracts...");

  // Deploy ZerifyToken
  const ZerifyToken = await ethers.getContractFactory("ZerifyToken");
  const zerifyToken = await ZerifyToken.deploy();
  await zerifyToken.deployed();
  console.log("ZerifyToken deployed to:", zerifyToken.address);

  // Deploy VerificationRegistry
  const VerificationRegistry = await ethers.getContractFactory("VerificationRegistry");
  const verificationRegistry = await VerificationRegistry.deploy();
  await verificationRegistry.deployed();
  console.log("VerificationRegistry deployed to:", verificationRegistry.address);

  // Deploy TrustBadgeNFT
  const TrustBadgeNFT = await ethers.getContractFactory("TrustBadgeNFT");
  const trustBadgeNFT = await TrustBadgeNFT.deploy();
  await trustBadgeNFT.deployed();
  console.log("TrustBadgeNFT deployed to:", trustBadgeNFT.address);

  // Save contract addresses to a file for frontend use
  const contractAddresses = {
    ZERIFY_TOKEN: zerifyToken.address,
    VERIFICATION_REGISTRY: verificationRegistry.address,
    TRUST_BADGE_NFT: trustBadgeNFT.address,
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
