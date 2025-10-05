import React from 'react';
import Web3Dashboard from './Web3Dashboard';
import StakeHistory from './StakeHistory';
import ReputationSystem from './ReputationSystem';
import { StakeTransaction, ReputationVote, ReputationNFT, ReputationStake } from '../types';

interface Web3WindowProps {
  account: string | null;
  tokenBalance: string;
  reputation: number;
  isValidator: boolean;
  userBadges: number[];
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onStakeTokens: (amount: string) => void;
  onUnstakeTokens: (amount: string) => void;
  onClaimFaucet: () => void;
  canClaimFaucet: boolean;
  faucetCooldown: number;
  stakeHistory: StakeTransaction[];
  reputationVotes: ReputationVote[];
  reputationNFTs: ReputationNFT[];
  reputationStakes: ReputationStake[];
  onVote: (source: string, credibility: number) => void;
  onMintNFT: (source: string, reputation: number) => void;
  onTransferNFT: (tokenId: string, to: string) => void;
  onStakeReputation: (source: string, amount: number, duration: number) => void;
  onUnstakeReputation: (stakeId: string) => void;
}

const Web3Window: React.FC<Web3WindowProps> = ({
  account,
  tokenBalance,
  reputation,
  isValidator,
  userBadges,
  onConnectWallet,
  onDisconnectWallet,
  onStakeTokens,
  onUnstakeTokens,
  onClaimFaucet,
  canClaimFaucet,
  faucetCooldown,
  stakeHistory,
  reputationVotes,
  reputationNFTs,
  reputationStakes,
  onVote,
  onMintNFT,
  onTransferNFT,
  onStakeReputation,
  onUnstakeReputation
}) => {
  return (
    <div className="max-w-6xl mx-auto my-8 space-y-6">
      {/* Web3 Dashboard */}
      <Web3Dashboard
        account={account}
        tokenBalance={tokenBalance}
        reputation={reputation}
        isValidator={isValidator}
        userBadges={userBadges}
        onConnectWallet={onConnectWallet}
        onDisconnectWallet={onDisconnectWallet}
        onStakeTokens={onStakeTokens}
        onUnstakeTokens={onUnstakeTokens}
        onClaimFaucet={onClaimFaucet}
        canClaimFaucet={canClaimFaucet}
        faucetCooldown={faucetCooldown}
      />
      
      {/* Stake History */}
      <StakeHistory stakeHistory={stakeHistory} />
      
      {/* Reputation System */}
      <ReputationSystem
        account={account}
        reputation={reputation}
        reputationVotes={reputationVotes}
        reputationNFTs={reputationNFTs}
        reputationStakes={reputationStakes}
        onVote={onVote}
        onMintNFT={onMintNFT}
        onTransferNFT={onTransferNFT}
        onStakeReputation={onStakeReputation}
        onUnstakeReputation={onUnstakeReputation}
        onConnectWallet={onConnectWallet}
      />
    </div>
  );
};

export default Web3Window;
