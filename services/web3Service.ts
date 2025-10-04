import { WatchlistItem } from '../types';
import { uploadJsonToIpfs, getJsonFromIpfs, initializeIpfs } from './ipfsService';

// Smart contract addresses (deployed to Hardhat network)
const CONTRACT_ADDRESSES = {
  ZERIFY_TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  VERIFICATION_REGISTRY: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  TRUST_BADGE_NFT: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
};

// Contract ABIs (simplified for demo - in production, use full ABIs)
const ZERIFY_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function stakeTokens(uint256 amount)",
  "function unstakeTokens(uint256 amount)",
  "function isValidator(address user) view returns (bool)",
  "function getReputation(address user) view returns (uint256)",
  "function claimFaucet()",
  "function canClaimFaucet(address user) view returns (bool)",
  "function getFaucetCooldown(address user) view returns (uint256)",
  "event TokensRewarded(address indexed user, uint256 amount, string reason)",
  "event FaucetClaimed(address indexed user, uint256 amount)"
];

const VERIFICATION_REGISTRY_ABI = [
  "function submitVerification(string memory url, string memory domain, uint256 trustScore, string memory ipfsHash)",
  "function getVerification(string memory domain) view returns (tuple(string url, string domain, uint256 trustScore, uint256 timestamp, address reporter, string ipfsHash, bool isDisputed, uint256 disputeCount))",
  "function isVerified(string memory domain) view returns (bool)",
  "function getTrustScore(string memory domain) view returns (uint256)",
  "function createDispute(string memory domain, string memory reason)",
  "event VerificationSubmitted(string indexed domain, string url, uint256 trustScore, address indexed reporter, string ipfsHash)"
];

const TRUST_BADGE_NFT_ABI = [
  "function mintVerifiedSourceBadge(string memory domain, uint256 trustScore, string memory ipfsHash, address recipient)",
  "function mintTrustedVerifierBadge(address recipient, uint256 reputation)",
  "function mintVerificationCertificate(string memory domain, uint256 trustScore, string memory ipfsHash, address recipient)",
  "function getBadgeMetadata(uint256 tokenId) view returns (tuple(uint8 badgeType, string domain, uint256 trustScore, uint256 timestamp, string ipfsHash))",
  "function getUserBadges(address user) view returns (uint256[])",
  "function hasVerifiedSourceBadge(string memory domain) view returns (bool)",
  "event BadgeMinted(uint256 indexed tokenId, uint8 badgeType, string domain, address indexed recipient)"
];

// This key now stores the IPFS CID of the latest watchlist JSON file.
// It simulates a pointer that would be stored in a smart contract.
const WATCHLIST_CID_KEY = 'zerify-watchlist-cid-pointer';

const getInitialData = (): WatchlistItem[] => {
    return [
        { 
            domain: 'unreliable-news-source.com', 
            trustScore: 15, 
            timestamp: Date.now() - 86400000 * 2, 
            reporter: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
            url: 'http://unreliable-news-source.com/article1'
        },
        { 
            domain: 'clickbait-central.net', 
            trustScore: 25, 
            timestamp: Date.now() - 86400000, 
            reporter: '0x51b4C31f2a3E7d425f1d147A5505081b250A724A',
            url: 'http://clickbait-central.net/sensational-story'
        },
    ];
};

// Initialize IPFS with web3.storage token
export const initializeWeb3Services = async (ipfsToken: string) => {
  try {
    initializeIpfs(ipfsToken);
    console.log('Web3 services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Web3 services:', error);
    throw error;
  }
};

// Initializes the first watchlist on our mock IPFS if it doesn't exist.
const initializeWatchlist = async (): Promise<WatchlistItem[]> => {
    console.log("Initializing first watchlist on mock IPFS...");
    const initialData = getInitialData();
    const cid = await uploadJsonToIpfs(initialData);
    localStorage.setItem(WATCHLIST_CID_KEY, cid);
    console.log("Initial watchlist created with CID:", cid);
    return initialData;
};

// Web3 service functions for smart contract interactions
export const getWeb3Provider = () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

// For development with Hardhat network
export const getHardhatProvider = () => {
  return new ethers.JsonRpcProvider('http://127.0.0.1:8545');
};

export const getContract = async (contractName: keyof typeof CONTRACT_ADDRESSES, abi: any[]) => {
  const provider = getWeb3Provider();
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES[contractName], abi, signer);
};

// Token functions
export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return '0';
  }
};

export const stakeTokens = async (amount: string): Promise<void> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.stakeTokens(amountWei);
    await tx.wait();
    console.log('Tokens staked successfully');
  } catch (error) {
    console.error('Failed to stake tokens:', error);
    throw error;
  }
};

export const unstakeTokens = async (amount: string): Promise<void> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.unstakeTokens(amountWei);
    await tx.wait();
    console.log('Tokens unstaked successfully');
  } catch (error) {
    console.error('Failed to unstake tokens:', error);
    throw error;
  }
};

export const isValidator = async (address: string): Promise<boolean> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    return await contract.isValidator(address);
  } catch (error) {
    console.error('Failed to check validator status:', error);
    return false;
  }
};

export const getReputation = async (address: string): Promise<number> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    const reputation = await contract.getReputation(address);
    return reputation.toNumber();
  } catch (error) {
    console.error('Failed to get reputation:', error);
    return 0;
  }
};

// Faucet functions
export const claimFaucet = async (): Promise<void> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    const tx = await contract.claimFaucet();
    await tx.wait();
    console.log('Faucet claimed successfully');
  } catch (error) {
    console.error('Failed to claim faucet:', error);
    throw error;
  }
};

export const canClaimFaucet = async (address: string): Promise<boolean> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    return await contract.canClaimFaucet(address);
  } catch (error) {
    console.error('Failed to check faucet eligibility:', error);
    return false;
  }
};

export const getFaucetCooldown = async (address: string): Promise<number> => {
  try {
    const contract = await getContract('ZERIFY_TOKEN', ZERIFY_TOKEN_ABI);
    const cooldown = await contract.getFaucetCooldown(address);
    return cooldown.toNumber();
  } catch (error) {
    console.error('Failed to get faucet cooldown:', error);
    return 0;
  }
};

// Verification Registry functions
export const submitVerification = async (
  url: string,
  domain: string,
  trustScore: number,
  ipfsHash: string
): Promise<void> => {
  try {
    const contract = await getContract('VERIFICATION_REGISTRY', VERIFICATION_REGISTRY_ABI);
    const tx = await contract.submitVerification(url, domain, trustScore, ipfsHash);
    await tx.wait();
    console.log('Verification submitted successfully');
  } catch (error) {
    console.error('Failed to submit verification:', error);
    throw error;
  }
};

export const getVerification = async (domain: string) => {
  try {
    const contract = await getContract('VERIFICATION_REGISTRY', VERIFICATION_REGISTRY_ABI);
    return await contract.getVerification(domain);
  } catch (error) {
    console.error('Failed to get verification:', error);
    return null;
  }
};

export const isDomainVerified = async (domain: string): Promise<boolean> => {
  try {
    const contract = await getContract('VERIFICATION_REGISTRY', VERIFICATION_REGISTRY_ABI);
    return await contract.isVerified(domain);
  } catch (error) {
    console.error('Failed to check domain verification:', error);
    return false;
  }
};

export const getDomainTrustScore = async (domain: string): Promise<number> => {
  try {
    const contract = await getContract('VERIFICATION_REGISTRY', VERIFICATION_REGISTRY_ABI);
    const score = await contract.getTrustScore(domain);
    return score.toNumber();
  } catch (error) {
    console.error('Failed to get domain trust score:', error);
    return 0;
  }
};

export const createDispute = async (domain: string, reason: string): Promise<void> => {
  try {
    const contract = await getContract('VERIFICATION_REGISTRY', VERIFICATION_REGISTRY_ABI);
    const tx = await contract.createDispute(domain, reason);
    await tx.wait();
    console.log('Dispute created successfully');
  } catch (error) {
    console.error('Failed to create dispute:', error);
    throw error;
  }
};

// NFT Badge functions
export const mintVerifiedSourceBadge = async (
  domain: string,
  trustScore: number,
  ipfsHash: string,
  recipient: string
): Promise<void> => {
  try {
    const contract = await getContract('TRUST_BADGE_NFT', TRUST_BADGE_NFT_ABI);
    const tx = await contract.mintVerifiedSourceBadge(domain, trustScore, ipfsHash, recipient);
    await tx.wait();
    console.log('Verified source badge minted successfully');
  } catch (error) {
    console.error('Failed to mint verified source badge:', error);
    throw error;
  }
};

export const mintTrustedVerifierBadge = async (
  recipient: string,
  reputation: number
): Promise<void> => {
  try {
    const contract = await getContract('TRUST_BADGE_NFT', TRUST_BADGE_NFT_ABI);
    const tx = await contract.mintTrustedVerifierBadge(recipient, reputation);
    await tx.wait();
    console.log('Trusted verifier badge minted successfully');
  } catch (error) {
    console.error('Failed to mint trusted verifier badge:', error);
    throw error;
  }
};

export const mintVerificationCertificate = async (
  domain: string,
  trustScore: number,
  ipfsHash: string,
  recipient: string
): Promise<void> => {
  try {
    const contract = await getContract('TRUST_BADGE_NFT', TRUST_BADGE_NFT_ABI);
    const tx = await contract.mintVerificationCertificate(domain, trustScore, ipfsHash, recipient);
    await tx.wait();
    console.log('Verification certificate minted successfully');
  } catch (error) {
    console.error('Failed to mint verification certificate:', error);
    throw error;
  }
};

export const getUserBadges = async (userAddress: string): Promise<number[]> => {
  try {
    const contract = await getContract('TRUST_BADGE_NFT', TRUST_BADGE_NFT_ABI);
    return await contract.getUserBadges(userAddress);
  } catch (error) {
    console.error('Failed to get user badges:', error);
    return [];
  }
};

export const hasVerifiedSourceBadge = async (domain: string): Promise<boolean> => {
  try {
    const contract = await getContract('TRUST_BADGE_NFT', TRUST_BADGE_NFT_ABI);
    return await contract.hasVerifiedSourceBadge(domain);
  } catch (error) {
    console.error('Failed to check verified source badge:', error);
    return false;
  }
};

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
    try {
        const cid = localStorage.getItem(WATCHLIST_CID_KEY);
        if (cid) {
            const data = await getJsonFromIpfs<WatchlistItem[]>(cid);
            // If data is found for the CID, return it
            if (data) {
                return data;
            }
        }
        // If no CID is stored or data is missing from mock IPFS, initialize a new one.
        return await initializeWatchlist();

    } catch (e) {
        console.error("Failed to get watchlist from mock IPFS", e);
        // Fallback in case of a critical error
        return getInitialData();
    }
};

export const addToWatchlist = async (item: WatchlistItem): Promise<void> => {
    console.log("Adding new item to watchlist...");
    // Simulate transaction delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 1. Get the current watchlist from IPFS
    const currentList = await getWatchlist();
    
    // 2. Add or update the item in the list
    const existingIndex = currentList.findIndex(i => i.domain === item.domain);
    if (existingIndex > -1) {
        // Update existing record to the latest submission
        currentList[existingIndex] = item;
    } else {
        // Add new record
        currentList.push(item);
    }
    // Sort by most recent submission
    currentList.sort((a, b) => b.timestamp - a.timestamp);

    // 3. Upload the new, updated list to IPFS to get a new CID
    console.log("Uploading updated watchlist to mock IPFS...");
    const newCid = await uploadJsonToIpfs(currentList);
    console.log("New watchlist CID:", newCid);
    
    // 4. Update our "smart contract pointer" with the new CID
    try {
        localStorage.setItem(WATCHLIST_CID_KEY, newCid);
        console.log("Watchlist pointer updated successfully.");
    } catch (e) {
        console.error("Failed to save new CID to localStorage", e);
        throw new Error("Could not update the watchlist pointer.");
    }
};