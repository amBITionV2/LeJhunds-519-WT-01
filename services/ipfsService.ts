// services/ipfsService.ts

// Real IPFS integration using web3.storage for decentralized content storage
// This replaces the mock implementation with actual IPFS functionality

interface IpfsConfig {
  token: string;
  endpoint?: string;
}

let ipfsConfig: IpfsConfig | null = null;

// Initialize IPFS with web3.storage token
export const initializeIpfs = (token: string, endpoint?: string) => {
  ipfsConfig = { token, endpoint };
};

// Upload file to IPFS using web3.storage
const uploadToIpfs = async (file: File): Promise<string> => {
  if (!ipfsConfig) {
    throw new Error('IPFS not initialized. Call initializeIpfs() first.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.web3.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ipfsConfig.token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.cid;
};

// Upload JSON data to IPFS (internal, unexported)
const uploadJsonToIpfsInternal = async (data: object): Promise<string> => {
  if (!ipfsConfig) {
    throw new Error('IPFS not initialized. Call initializeIpfs() first.');
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const file = new File([blob], 'data.json', { type: 'application/json' });

  return await uploadToIpfs(file);
};

// Retrieve data from IPFS
const getFromIpfs = async (cid: string): Promise<string> => {
  const response = await fetch(`https://${cid}.ipfs.w3s.link/`);
  
  if (!response.ok) {
    throw new Error(`Failed to retrieve data from IPFS: ${response.statusText}`);
  }

  return await response.text();
};

// Simple hash function for fallback (when IPFS is not available)
const generateCid = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `bafybei${hashHex.substring(0, 52)}`;
};


/**
 * Uploads a JSON object to IPFS (real or fallback).
 * @param data The JSON object to upload.
 * @returns A promise that resolves with the content identifier (CID).
 */
export const uploadJsonToIpfs = async (data: object): Promise<string> => {
  try {
    // Try real IPFS first
    if (ipfsConfig) {
      return await uploadJsonToIpfsInternal(data);
    }
  } catch (error) {
    console.warn('Real IPFS failed, falling back to mock:', error);
  }

  // Fallback to mock IPFS
  const MOCK_IPFS_STORAGE_PREFIX = 'mock-ipfs-';
  const jsonString = JSON.stringify(data, null, 2);
  const cid = await generateCid(jsonString);
  
  try {
    localStorage.setItem(`${MOCK_IPFS_STORAGE_PREFIX}${cid}`, jsonString);
  } catch (e) {
    console.error("Mock IPFS (localStorage) is full or unavailable.", e);
    throw new Error("Failed to store data in IPFS.");
  }
  return cid;
};

/**
 * Retrieves a JSON object from IPFS (real or fallback).
 * @param cid The content identifier of the JSON to retrieve.
 * @returns A promise that resolves with the parsed JSON object, or null if not found.
 */
export const getJsonFromIpfs = async <T>(cid: string): Promise<T | null> => {
  try {
    // Try real IPFS first
    if (ipfsConfig) {
      const jsonString = await getFromIpfs(cid);
      return JSON.parse(jsonString) as T;
    }
  } catch (error) {
    console.warn('Real IPFS failed, falling back to mock:', error);
  }

  // Fallback to mock IPFS
  const MOCK_IPFS_STORAGE_PREFIX = 'mock-ipfs-';
  try {
    const jsonString = localStorage.getItem(`${MOCK_IPFS_STORAGE_PREFIX}${cid}`);
    if (jsonString) {
      return JSON.parse(jsonString) as T;
    }
    return null;
  } catch (e) {
    console.error(`Failed to retrieve or parse data for CID ${cid}`, e);
    return null;
  }
};

/**
 * Uploads a file to IPFS.
 * @param file The file to upload.
 * @returns A promise that resolves with the content identifier (CID).
 */
export const uploadFileToIpfs = async (file: File): Promise<string> => {
  if (!ipfsConfig) {
    throw new Error('IPFS not initialized. Call initializeIpfs() first.');
  }
  return await uploadToIpfs(file);
};

/**
 * Retrieves a file from IPFS.
 * @param cid The content identifier of the file to retrieve.
 * @returns A promise that resolves with the file content as a string.
 */
export const getFileFromIpfs = async (cid: string): Promise<string> => {
  if (!ipfsConfig) {
    throw new Error('IPFS not initialized. Call initializeIpfs() first.');
  }
  return await getFromIpfs(cid);
};
