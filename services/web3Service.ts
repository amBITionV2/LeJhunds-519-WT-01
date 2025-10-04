import { WatchlistItem } from '../types';
import { uploadJsonToIpfs, getJsonFromIpfs } from './ipfsService';

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

// Initializes the first watchlist on our mock IPFS if it doesn't exist.
const initializeWatchlist = async (): Promise<WatchlistItem[]> => {
    console.log("Initializing first watchlist on mock IPFS...");
    const initialData = getInitialData();
    const cid = await uploadJsonToIpfs(initialData);
    localStorage.setItem(WATCHLIST_CID_KEY, cid);
    console.log("Initial watchlist created with CID:", cid);
    return initialData;
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