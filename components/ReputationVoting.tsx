import React, { useState } from 'react';
import { ReputationVote } from '../types';

interface ReputationVotingProps {
  account: string | null;
  reputation: number;
  reputationVotes: ReputationVote[];
  onVote: (source: string, credibility: number) => void;
  onConnectWallet: () => void;
}

const ReputationVoting: React.FC<ReputationVotingProps> = ({
  account,
  reputation,
  reputationVotes,
  onVote,
  onConnectWallet
}) => {
  const [selectedSource, setSelectedSource] = useState('');
  const [credibilityRating, setCredibilityRating] = useState(5);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!account) {
      onConnectWallet();
      return;
    }

    if (!selectedSource.trim()) {
      alert('Please enter a source to vote on');
      return;
    }

    setIsVoting(true);
    try {
      await onVote(selectedSource, credibilityRating);
      setSelectedSource('');
      setCredibilityRating(5);
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Failed to submit vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getCredibilityColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-100';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100';
    if (rating >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCredibilityLabel = (rating: number) => {
    if (rating >= 8) return 'Highly Credible';
    if (rating >= 6) return 'Credible';
    if (rating >= 4) return 'Questionable';
    return 'Not Credible';
  };

  if (!account) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-brand-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-text-primary mb-2">Connect Wallet to Vote</h3>
        <p className="text-brand-text-secondary mb-4">
          Connect your wallet to participate in community reputation voting and help verify source credibility.
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
        <h3 className="text-xl font-bold text-brand-text-primary">🗳️ Community Voting</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-text-secondary">Your Reputation:</span>
          <span className="px-2 py-1 bg-brand-accent text-white rounded-full text-sm font-bold">
            {reputation}
          </span>
        </div>
      </div>

      {/* Voting Form */}
      <div className="mb-6 p-4 bg-brand-bg border border-brand-border rounded-lg">
        <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Vote on Source Credibility</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Source (Domain/Organization)
            </label>
            <input
              type="text"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              placeholder="e.g., cnn.com, reuters.com, breitbart.com"
              className="w-full px-3 py-2 border border-brand-border rounded-lg bg-brand-bg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Credibility Rating: {credibilityRating}/10
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={credibilityRating}
                onChange={(e) => setCredibilityRating(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCredibilityColor(credibilityRating)}`}>
                {getCredibilityLabel(credibilityRating)}
              </span>
            </div>
          </div>

          <button
            onClick={handleVote}
            disabled={isVoting || !selectedSource.trim()}
            className="w-full bg-brand-accent text-white px-4 py-2 rounded-lg hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
          </button>
        </div>
      </div>

      {/* Recent Votes */}
      {reputationVotes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-brand-text-primary mb-4">Recent Community Votes</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reputationVotes.slice(0, 10).map((vote) => (
              <div
                key={vote.id}
                className="flex items-center justify-between p-3 bg-brand-bg border border-brand-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {vote.voter.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-brand-text-primary">{vote.source}</div>
                    <div className="text-sm text-brand-text-secondary">
                      {new Date(vote.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getCredibilityColor(vote.credibility)}`}>
                    {vote.credibility}/10
                  </span>
                  <span className="text-xs text-brand-text-secondary">
                    Weight: {vote.weight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReputationVoting;
