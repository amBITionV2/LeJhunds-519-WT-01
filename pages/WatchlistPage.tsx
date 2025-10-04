import React from 'react';
import { WatchlistItem } from '../types';
import { GlobeAltIcon } from '../components/icons/Web3Icons';

interface WatchlistPageProps {
  watchlist: WatchlistItem[];
  onBack: () => void;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ watchlist, onBack }) => {

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Analysis
        </button>
      </div>

      <header className="text-center mb-8">
          <div className="inline-block p-3 bg-brand-surface border border-brand-border rounded-full mb-4 shadow-lg shadow-brand-accent/10">
              <GlobeAltIcon className="w-10 h-10 text-brand-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-brand-accent">
              Global Misinformation Watchlist
          </h1>
          <p className="text-lg text-brand-text-secondary mt-2 max-w-3xl mx-auto">
            A community-curated, on-chain registry of domains flagged for low credibility. This is a public good to help make the web safer.
          </p>
        </header>

      <div className="bg-brand-surface border border-brand-border rounded-lg shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-brand-text-secondary">
            <thead className="text-xs text-brand-text-primary uppercase bg-brand-bg/50">
              <tr>
                <th scope="col" className="px-6 py-3">Domain</th>
                <th scope="col" className="px-6 py-3">Last Reported Score</th>
                <th scope="col" className="px-6 py-3">Reported On</th>
                <th scope="col" className="px-6 py-3">Reporter</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item, index) => {
                 const scoreColor = item.trustScore < 20 ? 'text-brand-error' : 'text-brand-warning';
                 return (
                    <tr key={index} className="border-b border-brand-border hover:bg-brand-border/50">
                        <th scope="row" className="px-6 py-4 font-medium text-brand-text-primary whitespace-nowrap">
                            <a href={`http://${item.domain}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.domain}</a>
                        </th>
                        <td className={`px-6 py-4 font-bold ${scoreColor}`}>
                            {item.trustScore} / 100
                        </td>
                        <td className="px-6 py-4">
                            {new Date(item.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                           <a href={`https://etherscan.io/address/${item.reporter}`} target="_blank" rel="noopener noreferrer" className="hover:underline" title={item.reporter}>
                                {truncateAddress(item.reporter)}
                           </a>
                        </td>
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
        {watchlist.length === 0 && (
            <div className="text-center p-8 text-brand-text-secondary">
                <p>The watchlist is currently empty.</p>
                <p className="text-sm">Be the first to contribute by analyzing a source and submitting it!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;