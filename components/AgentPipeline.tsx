
import React, { useState, useEffect } from 'react';
import { AgentName, AgentStatus, PipelineState, AnalysisResults } from '../types';
import { AGENT_NAMES } from '../constants';
import { AGENT_ICONS } from './icons/AgentIcons';

interface AgentPipelineProps {
  pipelineState: PipelineState;
  analysisResults: AnalysisResults;
}

const StatusIndicator: React.FC<{ status: AgentStatus }> = ({ status }) => {
  switch (status) {
    case AgentStatus.RUNNING:
      return (
        <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <title>Running</title>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    case AgentStatus.COMPLETED:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-success" viewBox="0 0 20 20" fill="currentColor">
          <title>Completed</title>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case AgentStatus.SKIPPED:
      return (
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-brand-text-secondary">
            <title>Skipped</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      );
    case AgentStatus.ERROR:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-error" viewBox="0 0 20 20" fill="currentColor">
          <title>Error</title>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
    case AgentStatus.PENDING:
    default:
      return (
        <svg className="w-5 h-5 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <title>Pending</title>
            <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

const RunningDetails: React.FC<{ text?: string }> = ({ text = "Processing" }) => {
    const baseText = text.replace(/\.+$/, '');
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const timer = setInterval(() => {
            setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : '.'));
        }, 350);

        return () => clearInterval(timer);
    }, []);

    return <>{baseText}{dots}</>;
};

const ResultDisplay: React.FC<{ agentName: AgentName; results: AnalysisResults }> = ({ agentName, results }) => {
    let title = "Result";
    let value: string | number | null = null;
    let valueColor = "text-brand-text-primary";

    switch (agentName) {
        case AgentName.TEXTUAL_ANALYSIS:
            title = "Sentiment";
            value = results.textual?.sentiment || 'N/A';
            if (value === 'Positive') valueColor = 'text-brand-success';
            if (value === 'Negative') valueColor = 'text-brand-error';
            break;
        case AgentName.EMOTION_ANALYSIS:
            title = "Manipulation";
            value = results.emotion?.manipulation_level || 'N/A';
            if (value === 'High') valueColor = 'text-brand-error';
            if (value === 'Medium') valueColor = 'text-brand-warning';
            break;
        case AgentName.SOURCE_INTELLIGENCE:
            title = "Trust Score";
            value = results.source?.trust_score ?? 'N/A';
            if (typeof value === 'number') {
              if (value < 40) valueColor = 'text-brand-error';
              else if (value < 80) valueColor = 'text-brand-warning';
              else valueColor = 'text-brand-success';
              value = `${value}/100`;
            }
            break;
        case AgentName.VISUAL_ANALYSIS:
            title = "Manipulation";
            value = results.visual?.visual_insights[0]?.manipulation_flag || 'N/A';
             if (value === 'High') valueColor = 'text-brand-error';
            if (value === 'Medium') valueColor = 'text-brand-warning';
            break;
        default:
            title = "Status";
            value = "Complete";
    }

    return (
        <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-text-secondary">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
        </div>
    );
};


const AgentCard: React.FC<{ name: AgentName; status: AgentStatus; details?: string; analysisResults: AnalysisResults; }> = ({ name, status, details, analysisResults }) => {
  const Icon = AGENT_ICONS[name];
  const isCompleted = status === AgentStatus.COMPLETED;

  const statusClasses = {
    [AgentStatus.PENDING]: 'border-brand-border text-brand-text-secondary',
    [AgentStatus.RUNNING]: 'border-brand-accent text-brand-accent animate-pulse-fast shadow-glow',
    [AgentStatus.COMPLETED]: 'border-brand-success text-brand-success',
    [AgentStatus.SKIPPED]: 'border-gray-500 text-gray-500',
    [AgentStatus.ERROR]: 'border-brand-error text-brand-error',
  };

  return (
    <div className="flex-1 min-w-[180px] h-36" style={{ perspective: '1000px' }}>
      <div className={`relative w-full h-full transition-transform duration-700 ease-in-out`} style={{ transformStyle: 'preserve-3d', transform: isCompleted ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>
        {/* Front Face */}
        <div className={`absolute w-full h-full bg-brand-surface p-4 rounded-lg border-2 ${statusClasses[status]} transition-colors duration-300`} style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm uppercase tracking-wider">{name}</h3>
            <StatusIndicator status={status} />
          </div>
          <div className="flex items-start gap-3 mt-3">
            <Icon className="w-8 h-8 shrink-0"/>
            <p className="text-xs text-brand-text-secondary break-words h-14 overflow-hidden">
              {status === AgentStatus.RUNNING 
                ? <RunningDetails text={details} /> 
                : details || <span className="capitalize italic">{status}</span>}
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div className={`absolute w-full h-full bg-brand-surface p-4 rounded-lg border-2 ${statusClasses[status]}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
           <div className="flex flex-col items-center justify-center h-full gap-2">
             <div className="flex items-center gap-2">
                <StatusIndicator status={status} />
                <h3 className="font-semibold text-sm uppercase tracking-wider">{name}</h3>
             </div>
             <div className="mt-2 w-full">
                <ResultDisplay agentName={name} results={analysisResults} />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};


const AgentPipeline: React.FC<AgentPipelineProps> = ({ pipelineState, analysisResults }) => {
  return (
    <div className="w-full max-w-5xl mx-auto my-8">
      <h2 className="text-center text-xl font-bold text-brand-text-primary mb-2">INTELLIGENCE PIPELINE</h2>
      <p className="text-center text-brand-text-secondary mb-6">Following agentic workflow to generate brief...</p>
      <div className="flex flex-wrap items-stretch justify-center gap-x-4 gap-y-4">
        {AGENT_NAMES.map((name, index) => (
            <div key={name} className="flex items-center">
                <AgentCard
                    name={name}
                    status={pipelineState[name].status}
                    details={pipelineState[name].details}
                    analysisResults={analysisResults}
                />
                 {index < AGENT_NAMES.length - 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-border mx-2 hidden lg:block">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default AgentPipeline;
