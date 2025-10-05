
export enum AgentName {
  CONTENT_INGESTION = "Content Ingestion",
  TEXTUAL_ANALYSIS = "Textual Analysis",
  EMOTION_ANALYSIS = "Emotion Analysis",
  VISUAL_ANALYSIS = "Visual Analysis",
  SOURCE_INTELLIGENCE = "Source Intelligence",
  FINAL_SYNTHESIS = "Final Synthesis",
}

export enum AgentStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  SKIPPED = "skipped",
  ERROR = "error",
}

export type PipelineState = {
  [key in AgentName]: {
    status: AgentStatus;
    details?: string;
  };
};

export interface IngestionOutput {
  text: string;
  images: string[];
  domain: string;
}

export interface TextualAnalysisOutput {
  summary: string;
  entities: string[];
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  keywords: string[];
}

export interface EmotionAnalysisOutput {
  dominant_emotion: 'Anger' | 'Fear' | 'Joy' | 'Sadness' | 'Surprise' | 'Neutral' | 'Mixed';
  manipulation_level: 'Low' | 'Medium' | 'High';
  explanation: string;
}

export interface VisualAnalysisOutput {
  visual_insights: Array<{
    image: string;
    description: string;
    labels: string[];
    manipulation_flag: 'Low' | 'Medium' | 'High';
  }>;
}

export interface EvidenceItem {
  description: string;
  finding: 'Positive' | 'Negative' | 'Neutral';
}

export interface SourceIntelligenceOutput {
  source_validity: 'High' | 'Medium' | 'Low' | 'Unknown';
  evidence: EvidenceItem[];
  trust_score: number;
  source_validity_explanation: string;
}

export interface AnalysisResults {
  ingestion?: IngestionOutput;
  textual?: TextualAnalysisOutput;
  emotion?: EmotionAnalysisOutput;
  visual?: VisualAnalysisOutput;
  source?: SourceIntelligenceOutput;
}

export interface HistoryItem {
  id: string;
  url: string;
  report: string;
  timestamp: string;
  pipelineState: PipelineState;
  analysisResults: AnalysisResults;
}

export interface MisinformationRecord {
  domain: string;
  url: string; // The specific URL that was flagged
  trustScore: number;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface WatchlistItem {
  domain: string;
  trustScore: number;
  timestamp: number;
  reporter: string; // Wallet address of the user who submitted it
  url: string;
}

export interface StakeTransaction {
  id: string;
  type: 'stake' | 'unstake';
  amount: string;
  timestamp: number;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ReputationVote {
  id: string;
  voter: string;
  source: string;
  credibility: number; // 1-10 scale
  timestamp: number;
  txHash?: string;
  weight: number; // Based on voter's reputation
}

export interface ReputationNFT {
  id: string;
  owner: string;
  reputation: number;
  source: string;
  mintedAt: number;
  tokenId: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface ReputationStake {
  id: string;
  staker: string;
  source: string;
  amount: number;
  timestamp: number;
  duration: number; // Days
  rewards: number;
  status: 'active' | 'completed' | 'withdrawn';
}