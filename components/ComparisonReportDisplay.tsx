import React from 'react';
import { HistoryItem } from '../types';
import SimpleMarkdown from './SimpleMarkdown';
import { SparklesIcon } from './icons/AgentIcons';

interface ComparisonReportDisplayProps {
  comparisonBrief: string | null;
  originalReports: HistoryItem[];
  onBack: () => void;
}

const ComparisonReportDisplay: React.FC<ComparisonReportDisplayProps> = ({ comparisonBrief, originalReports, onBack }) => {
  if (comparisonBrief === null) {
    return null;
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

      <div className="bg-brand-surface border border-brand-border rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r dark:from-green-900/50 from-blue-100 to-brand-surface border-b-2 border-brand-accent">
          <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-3">
            <SparklesIcon className="w-8 h-8" />
            Comparative Intelligence Brief
          </h2>
          {/* Fix: Completed the paragraph tag and added dynamic text. */}
          <p className="dark:text-green-300 text-blue-700 mt-1">Synthesized report from comparing {originalReports.length} analyses.</p>
        </div>
        
        {comparisonBrief && (
             <div className="p-6 md:p-8 text-brand-text-secondary leading-relaxed bg-brand-surface">
                <SimpleMarkdown content={comparisonBrief} />
            </div>
        )}

        <div className="p-6 md:p-8 border-t border-brand-border bg-brand-bg/50">
          <h3 className="text-xl font-bold text-brand-text-primary mb-4">Sources Compared</h3>
          <ul className="space-y-2">
            {originalReports.map(report => (
              <li key={report.id} className="p-3 bg-brand-surface rounded-md border border-brand-border">
                <p className="font-semibold text-sm truncate text-brand-text-primary">{report.url}</p>
                <p className="text-xs text-brand-text-secondary mt-1">
                  Analyzed on: {new Date(report.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComparisonReportDisplay;