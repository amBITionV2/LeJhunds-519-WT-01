import React from 'react';

interface Web3DashboardProps {
  account: string | null;
  tokenBalance: string;
  reputation: number;
  isValidator: boolean;
  userBadges: number[];
  onConnectWallet: () => void;
  onStakeTokens: (amount: string) => void;
  onUnstakeTokens: (amount: string) => void;
  onClaimFaucet: () => void;
  canClaimFaucet: boolean;
  faucetCooldown: number;
}

const Web3Dashboard: React.FC<Web3DashboardProps> = ({
  account,
  tokenBalance,
  reputation,
  isValidator,
  userBadges,
  onConnectWallet,
  onStakeTokens,
  onUnstakeTokens,
  onClaimFaucet,
  canClaimFaucet,
  faucetCooldown
}) => {
  const [stakeAmount, setStakeAmount] = React.useState('1000');
  const [unstakeAmount, setUnstakeAmount] = React.useState('1000');

  if (!account) {
    return (
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-brand-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-text-primary mb-2">Connect Your Wallet</h3>
        <p className="text-brand-text-secondary mb-4">
          Connect your MetaMask wallet to access Web3 features like token rewards, NFT badges, and decentralized verification.
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
    <div className="space-y-6">
      {/* Account Info */}
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Account Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-brand-text-secondary">Wallet Address</p>
            <p className="font-mono text-sm text-brand-text-primary break-all">
              {account}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-text-secondary">Token Balance</p>
            <p className="text-2xl font-bold text-brand-accent">
              {parseFloat(tokenBalance).toFixed(2)} ZERIFY
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-text-secondary">Reputation Score</p>
            <p className="text-2xl font-bold text-brand-success">
              {reputation}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-text-secondary">Validator Status</p>
            <p className={`text-lg font-bold ${isValidator ? 'text-brand-success' : 'text-brand-text-secondary'}`}>
              {isValidator ? '✓ Validator' : 'Not a Validator'}
            </p>
          </div>
        </div>
      </div>

      {/* Faucet Section */}
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-text-primary mb-4">🪙 Free Token Faucet</h3>
        <p className="text-brand-text-secondary mb-4">
          Get 1000 free ZERIFY tokens to test all features! Available once every 24 hours.
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-secondary">
              {canClaimFaucet ? (
                <span className="text-brand-success font-semibold">✅ Ready to claim!</span>
              ) : (
                <span className="text-brand-warning">
                  ⏰ Next claim in: {Math.floor(faucetCooldown / 3600)}h {Math.floor((faucetCooldown % 3600) / 60)}m
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClaimFaucet}
            disabled={!canClaimFaucet}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              canClaimFaucet
                ? 'bg-brand-accent text-white hover:bg-brand-accent/90'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {canClaimFaucet ? 'Claim 1000 Tokens' : 'Claim Unavailable'}
          </button>
        </div>
      </div>

      {/* Staking Section */}
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Token Staking</h3>
        <p className="text-brand-text-secondary mb-4">
          Stake 1000+ ZERIFY tokens to become a validator and earn rewards for accurate verifications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Stake Amount
            </label>
            <div className="flex">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-brand-border rounded-l-lg bg-brand-bg text-brand-text-primary"
                placeholder="1000"
              />
              <button
                onClick={() => onStakeTokens(stakeAmount)}
                className="px-4 py-2 bg-brand-accent text-white rounded-r-lg hover:bg-brand-accent/90 transition-colors"
              >
                Stake
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Unstake Amount
            </label>
            <div className="flex">
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-brand-border rounded-l-lg bg-brand-bg text-brand-text-primary"
                placeholder="1000"
              />
              <button
                onClick={() => onUnstakeTokens(unstakeAmount)}
                className="px-4 py-2 bg-brand-warning text-white rounded-r-lg hover:bg-brand-warning/90 transition-colors"
              >
                Unstake
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Your Badges</h3>
        {userBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userBadges.map((badgeId, index) => (
              <div key={index} className="bg-brand-bg border border-brand-border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-brand-accent rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">{badgeId}</span>
                </div>
                <p className="text-sm text-brand-text-secondary">Badge #{badgeId}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-text-secondary text-center py-8">
            No badges yet. Complete verifications to earn NFT badges!
          </p>
        )}
      </div>

      {/* Rewards Section */}
      <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Earn Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-success/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-brand-text-primary">Accurate Verifications</h4>
            <p className="text-sm text-brand-text-secondary">Earn 10 ZERIFY tokens per accurate verification</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-accent/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h4 className="font-bold text-brand-text-primary">Validator Rewards</h4>
            <p className="text-sm text-brand-text-secondary">Earn additional rewards as a validator</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-warning/20 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-bold text-brand-text-primary">NFT Badges</h4>
            <p className="text-sm text-brand-text-secondary">Mint unique NFT badges for achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Web3Dashboard;
