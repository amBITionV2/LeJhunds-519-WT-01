import React from 'react';
import { StakeTransaction } from '../types';

interface StakeHistoryProps {
  stakeHistory: StakeTransaction[];
}

const StakeHistory: React.FC<StakeHistoryProps> = ({ stakeHistory }) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type === 'stake') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      );
    }
  };

  if (stakeHistory.length === 0) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-brand-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No Stake History</h3>
        <p className="text-brand-text-secondary">
          Your stake and unstake transactions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
      <h3 className="text-xl font-bold text-brand-text-primary mb-4">📊 Stake History</h3>
      <div className="space-y-3">
        {stakeHistory.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-brand-bg border border-brand-border rounded-lg hover:bg-brand-border/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${transaction.type === 'stake' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {getTypeIcon(transaction.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-text-primary">
                    {transaction.type === 'stake' ? 'Staked' : 'Unstaked'}
                  </span>
                  <span className="text-lg font-bold text-brand-accent">
                    {parseFloat(transaction.amount).toFixed(2)} ZERIFY
                  </span>
                </div>
                <div className="text-sm text-brand-text-secondary">
                  {formatTimestamp(transaction.timestamp)}
                </div>
                {transaction.txHash && (
                  <div className="text-xs text-brand-text-secondary font-mono">
                    TX: {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakeHistory;
