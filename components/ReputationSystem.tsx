import React, { useState } from 'react';
import ReputationVoting from './ReputationVoting';
import ReputationNFT from './ReputationNFT';
import ReputationStaking from './ReputationStaking';
import { ReputationVote, ReputationNFT as ReputationNFTType, ReputationStake } from '../types';

interface ReputationSystemProps {
  account: string | null;
  reputation: number;
  reputationVotes: ReputationVote[];
  reputationNFTs: ReputationNFTType[];
  reputationStakes: ReputationStake[];
  onVote: (source: string, credibility: number) => void;
  onMintNFT: (source: string, reputation: number) => void;
  onTransferNFT: (tokenId: string, to: string) => void;
  onStakeReputation: (source: string, amount: number, duration: number) => void;
  onUnstakeReputation: (stakeId: string) => void;
  onConnectWallet: () => void;
}

const ReputationSystem: React.FC<ReputationSystemProps> = ({
  account,
  reputation,
  reputationVotes,
  reputationNFTs,
  reputationStakes,
  onVote,
  onMintNFT,
  onTransferNFT,
  onStakeReputation,
  onUnstakeReputation,
  onConnectWallet
}) => {
  const [activeTab, setActiveTab] = useState<'voting' | 'nft' | 'staking'>('voting');

  const tabs = [
    { id: 'voting', label: '🗳️ Voting', icon: '🗳️' },
    { id: 'nft', label: '🎨 NFTs', icon: '🎨' },
    { id: 'staking', label: '💰 Staking', icon: '💰' }
  ];

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-brand-text-primary">🏆 Decentralized Reputation System</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-text-secondary">Your Reputation:</span>
          <span className="px-3 py-1 bg-brand-accent text-white rounded-full text-sm font-bold">
            {reputation}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-brand-bg p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-accent text-white'
                : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-border/20'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'voting' && (
          <ReputationVoting
            account={account}
            reputation={reputation}
            reputationVotes={reputationVotes}
            onVote={onVote}
            onConnectWallet={onConnectWallet}
          />
        )}
        
        {activeTab === 'nft' && (
          <ReputationNFT
            account={account}
            reputation={reputation}
            reputationNFTs={reputationNFTs}
            onMintNFT={onMintNFT}
            onTransferNFT={onTransferNFT}
            onConnectWallet={onConnectWallet}
          />
        )}
        
        {activeTab === 'staking' && (
          <ReputationStaking
            account={account}
            reputation={reputation}
            reputationStakes={reputationStakes}
            onStakeReputation={onStakeReputation}
            onUnstakeReputation={onUnstakeReputation}
            onConnectWallet={onConnectWallet}
          />
        )}
      </div>

      {/* System Overview */}
      <div className="mt-6 pt-6 border-t border-brand-border">
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-brand-bg border border-brand-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🗳️</span>
              <h4 className="font-semibold text-brand-text-primary">Community Voting</h4>
            </div>
            <p className="text-sm text-brand-text-secondary">
              Vote on source credibility and earn reputation for accurate assessments.
            </p>
          </div>
          
          <div className="p-4 bg-brand-bg border border-brand-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎨</span>
              <h4 className="font-semibold text-brand-text-primary">Reputation NFTs</h4>
            </div>
            <p className="text-sm text-brand-text-secondary">
              Mint tradeable NFTs representing your verification achievements and reputation.
            </p>
          </div>
          
          <div className="p-4 bg-brand-bg border border-brand-border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <h4 className="font-semibold text-brand-text-primary">Reputation Staking</h4>
            </div>
            <p className="text-sm text-brand-text-secondary">
              Stake reputation to validate sources and earn rewards for your commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationSystem;
