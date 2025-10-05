import React, { useState } from 'react';
import { ReputationStake } from '../types';

interface ReputationStakingProps {
  account: string | null;
  reputation: number;
  reputationStakes: ReputationStake[];
  onStakeReputation: (source: string, amount: number, duration: number) => void;
  onUnstakeReputation: (stakeId: string) => void;
  onConnectWallet: () => void;
}

const ReputationStaking: React.FC<ReputationStakingProps> = ({
  account,
  reputation,
  reputationStakes,
  onStakeReputation,
  onUnstakeReputation,
  onConnectWallet
}) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [stakeAmount, setStakeAmount] = useState(10);
  const [stakeDuration, setStakeDuration] = useState(30);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const handleStakeReputation = async () => {
    if (!account) {
      onConnectWallet();
      return;
    }

    if (!selectedSource.trim()) {
      alert('Please enter a source to stake reputation for');
      return;
    }

    if (stakeAmount > reputation) {
      alert('Insufficient reputation to stake');
      return;
    }

    setIsStaking(true);
    try {
      await onStakeReputation(selectedSource, stakeAmount, stakeDuration);
      setSelectedSource('');
      setStakeAmount(10);
      setStakeDuration(30);
      alert('Reputation staked successfully!');
    } catch (error) {
      console.error('Failed to stake reputation:', error);
      alert('Failed to stake reputation. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstakeReputation = async (stakeId: string) => {
    setIsUnstaking(true);
    try {
      await onUnstakeReputation(stakeId);
      alert('Reputation unstaked successfully!');
    } catch (error) {
      console.error('Failed to unstake reputation:', error);
      alert('Failed to unstake reputation. Please try again.');
    } finally {
      setIsUnstaking(false);
    }
  };

  const calculateRewards = (amount: number, duration: number) => {
    // Simple reward calculation: 1% per day
    return Math.floor(amount * 0.01 * duration);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'withdrawn':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysRemaining = (timestamp: number, duration: number) => {
    const endTime = timestamp + (duration * 24 * 60 * 60 * 1000);
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTime - now) / (24 * 60 * 60 * 1000)));
    return remaining;
  };

  if (!account) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-brand-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-text-primary mb-2">Connect Wallet to Stake</h3>
        <p className="text-brand-text-secondary mb-4">
          Connect your wallet to stake reputation and earn rewards for validating sources.
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
        <h3 className="text-xl font-bold text-brand-text-primary">💰 Reputation Staking</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-text-secondary">Available:</span>
          <span className="px-2 py-1 bg-brand-accent text-white rounded-full text-sm font-bold">
            {reputation}
          </span>
        </div>
      </div>

      {/* Staking Form */}
      <div className="mb-6 p-4 bg-brand-bg border border-brand-border rounded-lg">
        <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Stake Reputation</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Source to Validate
            </label>
            <input
              type="text"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              placeholder="e.g., cnn.com, reuters.com"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Amount
              </label>
              <input
                type="number"
                min="1"
                max={reputation}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Duration (Days)
              </label>
              <select
                value={stakeDuration}
                onChange={(e) => setStakeDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>365 days</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-brand-text-primary">Estimated Rewards:</span>
              <span className="text-lg font-bold text-brand-accent">
                +{calculateRewards(stakeAmount, stakeDuration)} reputation
              </span>
            </div>
            <div className="text-xs text-brand-text-secondary mt-1">
              Earn 1% per day for staking reputation
            </div>
          </div>

          <button
            onClick={handleStakeReputation}
            disabled={isStaking || !selectedSource.trim() || stakeAmount > reputation || stakeAmount < 1}
            className="w-full bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStaking ? 'Staking...' : 'Stake Reputation'}
          </button>
        </div>
      </div>

      {/* Active Stakes */}
      {reputationStakes.length > 0 ? (
        <div>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Active Stakes</h4>
          <div className="space-y-3">
            {reputationStakes.map((stake) => {
              const daysRemaining = getDaysRemaining(stake.timestamp, stake.duration);
              const isCompleted = daysRemaining === 0 && stake.status === 'active';
              
              return (
                <div
                  key={stake.id}
                  className="p-4 bg-brand-bg border border-brand-border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-brand-text-primary">{stake.source}</h5>
                      <div className="text-sm text-brand-text-secondary">
                        Staked: {stake.amount} reputation for {stake.duration} days
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stake.status)}`}>
                        {stake.status}
                      </span>
                      {isCompleted && (
                        <button
                          onClick={() => handleUnstakeReputation(stake.id)}
                          disabled={isUnstaking}
                          className="px-3 py-1 bg-brand-accent text-white text-xs rounded hover:bg-brand-accent/90 disabled:opacity-50 transition-colors"
                        >
                          {isUnstaking ? 'Unstaking...' : 'Claim Rewards'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-brand-text-secondary">Days Remaining:</span>
                      <span className="ml-2 font-medium text-brand-text-primary">
                        {daysRemaining} days
                      </span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary">Rewards:</span>
                      <span className="ml-2 font-medium text-brand-accent">
                        +{stake.rewards} reputation
                      </span>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-2">No Active Stakes</h4>
          <p className="text-brand-text-secondary">
            Start staking your reputation to earn rewards and help validate sources!
          </p>
        </div>
      )}
    </div>
  );
};

export default ReputationStaking;
