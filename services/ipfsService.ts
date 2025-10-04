// services/ipfsService.ts

// This is a mock IPFS service for the hackathon.
// In a real application, this would use an IPFS client and a pinning service like Pinata or web3.storage.

const MOCK_IPFS_STORAGE_PREFIX = 'mock-ipfs-';

// Simple hash function to generate a "CID" from content
const generateCid = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    // Mock a base32 CID v1 format to look realistic
    return `bafybei${hashHex.substring(0, 52)}`;
};


/**
 * "Uploads" a JSON object to our mock IPFS (localStorage).
 * @param data The JSON object to upload.
 * @returns A promise that resolves with the content identifier (CID).
 */
export const uploadJsonToIpfs = async (data: object): Promise<string> => {
    const jsonString = JSON.stringify(data, null, 2);
    const cid = await generateCid(jsonString);
    try {
        // In this simulation, we store the content itself in localStorage, keyed by its CID.
        localStorage.setItem(`${MOCK_IPFS_STORAGE_PREFIX}${cid}`, jsonString);
    } catch (e) {
        console.error("Mock IPFS (localStorage) is full or unavailable.", e);
        throw new Error("Failed to store data in mock IPFS.");
    }
    return cid;
};

/**
 * "Retrieves" a JSON object from our mock IPFS (localStorage) using its CID.
 * @param cid The content identifier of the JSON to retrieve.
 * @returns A promise that resolves with the parsed JSON object, or null if not found.
 */
export const getJsonFromIpfs = async <T>(cid: string): Promise<T | null> => {
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
