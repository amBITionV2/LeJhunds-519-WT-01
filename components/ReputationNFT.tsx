import React, { useState } from 'react';
import { ReputationNFT as ReputationNFTType } from '../types';

interface ReputationNFTProps {
  account: string | null;
  reputation: number;
  reputationNFTs: ReputationNFTType[];
  onMintNFT: (source: string, reputation: number) => void;
  onTransferNFT: (tokenId: string, to: string) => void;
  onConnectWallet: () => void;
}

const ReputationNFT: React.FC<ReputationNFTProps> = ({
  account,
  reputation,
  reputationNFTs,
  onMintNFT,
  onTransferNFT,
  onConnectWallet
}) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const handleMintNFT = async () => {
    if (!account) {
      onConnectWallet();
      return;
    }

    if (!selectedSource.trim()) {
      alert('Please enter a source to mint NFT for');
      return;
    }

    setIsMinting(true);
    try {
      await onMintNFT(selectedSource, reputation);
      setSelectedSource('');
      alert('Reputation NFT minted successfully!');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const handleTransferNFT = async () => {
    if (!selectedNFT || !transferTo.trim()) {
      alert('Please select an NFT and enter recipient address');
      return;
    }

    setIsTransferring(true);
    try {
      await onTransferNFT(selectedNFT, transferTo);
      setTransferTo('');
      setSelectedNFT('');
      alert('NFT transferred successfully!');
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
      alert('Failed to transfer NFT. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  const getReputationTier = (reputation: number) => {
    if (reputation >= 1000) return { tier: 'Legendary', color: 'text-purple-600 bg-purple-100' };
    if (reputation >= 500) return { tier: 'Epic', color: 'text-blue-600 bg-blue-100' };
    if (reputation >= 100) return { tier: 'Rare', color: 'text-green-600 bg-green-100' };
    if (reputation >= 50) return { tier: 'Uncommon', color: 'text-yellow-600 bg-yellow-100' };
    return { tier: 'Common', color: 'text-gray-600 bg-gray-100' };
  };

  if (!account) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-brand-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-text-primary mb-2">Connect Wallet for NFTs</h3>
        <p className="text-brand-text-secondary mb-4">
          Connect your wallet to mint and trade reputation NFTs based on your verification achievements.
        </p>
        <button
          onClick={onConnectWallet}
          className="bg-brand-accent text-white px-6 py-2 rounded-lg hover:bg-brand-accent/90 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-brand-text-primary">🎨 Reputation NFTs</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-text-secondary">Your Reputation:</span>
          <span className="px-2 py-1 bg-brand-accent text-white rounded-full text-sm font-bold">
            {reputation}
          </span>
        </div>
      </div>

      {/* Mint NFT Form */}
      <div className="mb-6 p-4 bg-brand-bg border border-brand-border rounded-lg">
        <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Mint Reputation NFT</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Source for NFT
            </label>
            <input
              type="text"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              placeholder="e.g., cnn.com, reuters.com"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <button
            onClick={handleMintNFT}
            disabled={isMinting || !selectedSource.trim() || reputation < 10}
            className="w-full bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isMinting ? 'Minting NFT...' : `Mint NFT (Cost: 10 Reputation)`}
          </button>
          
          {reputation < 10 && (
            <p className="text-sm text-brand-text-secondary">
              You need at least 10 reputation to mint an NFT
            </p>
          )}
        </div>
      </div>

      {/* Transfer NFT Form */}
      {reputationNFTs.length > 0 && (
        <div className="mb-6 p-4 bg-brand-bg border border-brand-border rounded-lg">
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Transfer NFT</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Select NFT
              </label>
              <select
                value={selectedNFT}
                onChange={(e) => setSelectedNFT(e.target.value)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="">Select an NFT</option>
                {reputationNFTs.map((nft) => (
                  <option key={nft.id} value={nft.tokenId}>
                    {nft.metadata.name} - {nft.source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <button
              onClick={handleTransferNFT}
              disabled={isTransferring || !selectedNFT || !transferTo.trim()}
              className="w-full bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTransferring ? 'Transferring...' : 'Transfer NFT'}
            </button>
          </div>
        </div>
      )}

      {/* NFT Collection */}
      {reputationNFTs.length > 0 ? (
        <div>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Your NFT Collection</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reputationNFTs.map((nft) => {
              const tier = getReputationTier(nft.reputation);
              return (
                <div
                  key={nft.id}
                  className="bg-brand-bg border border-brand-border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-brand-text-primary">{nft.metadata.name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}>
                      {tier.tier}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-brand-text-secondary">
                      <strong>Source:</strong> {nft.source}
                    </div>
                    <div className="text-sm text-brand-text-secondary">
                      <strong>Reputation:</strong> {nft.reputation}
                    </div>
                    <div className="text-sm text-brand-text-secondary">
                      <strong>Minted:</strong> {new Date(nft.mintedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-brand-border">
                    <div className="text-xs text-brand-text-secondary">
                      Token ID: {nft.tokenId}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-brand-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-2">No NFTs Yet</h4>
          <p className="text-brand-text-secondary">
            Mint your first reputation NFT to start building your collection!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReputationNFT;
