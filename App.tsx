
import React, { useState, useCallback, useEffect } from 'react';
import URLInput from './components/URLInput';
import AgentPipeline from './components/AgentPipeline';
import ReportDisplay from './components/ReportDisplay';
import HistorySidebar from './components/HistorySidebar';
import FollowUpChat from './components/FollowUpChat';
import ComparisonReportDisplay from './components/ComparisonReportDisplay';
import WatchlistPage from './pages/WatchlistPage';
import { AgentName, AgentStatus, PipelineState, AnalysisResults, IngestionOutput, HistoryItem, TextualAnalysisOutput, VisualAnalysisOutput, ChatMessage, EmotionAnalysisOutput, MisinformationRecord, WatchlistItem, StakeTransaction, ReputationVote, ReputationNFT, ReputationStake } from './types';
import { INITIAL_PIPELINE_STATE } from './constants';
// FIX: Removed `ai` import and added `performContentIngestion` to fix module export error.
import { performTextualAnalysis, performEmotionAnalysis, performVisualAnalysis, generateFinalBrief, performSourceIntelligence, performContentIngestion, startFollowUpChat, Chat, generateComparisonBrief } from './services/geminiService';
import { addMisinformationRecord, getMisinformationRecordByDomain, openDB } from './services/db';
import { getFriendlyErrorMessage } from './utils';
import { XMarkIcon, ShieldCheckIcon } from './components/icons/AgentIcons';
import { 
  addToWatchlist, 
  getWatchlist, 
  initializeWeb3Services,
  getTokenBalance,
  getReputation,
  isValidator,
  submitVerification,
  mintVerifiedSourceBadge,
  mintTrustedVerifierBadge,
  mintVerificationCertificate,
  getUserBadges,
  stakeTokens,
  unstakeTokens,
  claimFaucet,
  canClaimFaucet,
  getFaucetCooldown
} from './services/web3Service';
import { uploadJsonToIpfs } from './services/ipfsService';
import DynamicBackground from './components/DynamicBackground';
import Web3Window from './components/Web3Window';
import ReputationSystem from './components/ReputationSystem';

// Ethers is loaded from a CDN script in index.html
declare const ethers: any;

// Fix: Add type declaration for window.ethereum to resolve TypeScript errors.
declare global {
  interface Window {
    ethereum: any;
  }
}

interface AppProps {
  currentUser: string;
  onLogout: () => void;
}

type View = 'analysis' | 'watchlist' | 'comparison';

const extractFramesFromVideo = (videoFile: File, frameCount: number = 5): Promise<Array<{ data: string; mimeType: string; }>> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const frames: Array<{ data: string; mimeType: string; }> = [];
        
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const duration = video.duration;
            if (duration === Infinity) { // Handle streams
              reject("Cannot extract frames from a live stream.");
              return;
            }
            const interval = duration > 0 ? duration / frameCount : 0;

            let capturedFrames = 0;

            const captureFrame = (time: number) => {
                video.currentTime = time;
            };

            video.onseeked = () => {
                if (context && capturedFrames < frameCount) {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    const [, data] = dataUrl.split(',');
                    frames.push({ data, mimeType: 'image/jpeg' });
                    capturedFrames++;
                    
                    if (capturedFrames >= frameCount) {
                        URL.revokeObjectURL(video.src);
                        resolve(frames);
                    } else {
                        captureFrame(capturedFrames * interval);
                    }
                }
            };
            
            // Start capturing the first frame
            captureFrame(0);
        };
        
        video.onerror = (e) => {
            reject("Error loading video file for frame extraction.");
            URL.revokeObjectURL(video.src);
        };
        
        const videoUrl = URL.createObjectURL(videoFile);
        video.src = videoUrl;
        video.load();
    });
};


const App: React.FC<AppProps> = ({ currentUser, onLogout }) => {
  // Core analysis state
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pipelineState, setPipelineState] = useState<PipelineState>(INITIAL_PIPELINE_STATE);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({});
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // View and History
  const [view, setView] = useState<View>('analysis');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);

  // Web3 State
  const [account, setAccount] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [reputation, setReputation] = useState<number>(0);
  const [isValidator, setIsValidator] = useState<boolean>(false);
  const [userBadges, setUserBadges] = useState<number[]>([]);
  const [isWeb3Initialized, setIsWeb3Initialized] = useState<boolean>(false);
  
  // Faucet State
  const [canClaimFaucet, setCanClaimFaucet] = useState<boolean>(false);
  const [faucetCooldown, setFaucetCooldown] = useState<number>(0);
  
  // Stake History State
  const [stakeHistory, setStakeHistory] = useState<StakeTransaction[]>([]);
  
  // Reputation System State
  const [reputationVotes, setReputationVotes] = useState<ReputationVote[]>([]);
  const [reputationNFTs, setReputationNFTs] = useState<ReputationNFT[]>([]);
  const [reputationStakes, setReputationStakes] = useState<ReputationStake[]>([]);
  const [sourceCredibility, setSourceCredibility] = useState<{[source: string]: number}>({});

  // Misinformation Memory State
  const [misinformationWarning, setMisinformationWarning] = useState<MisinformationRecord | null>(null);

  // Follow-up Chat State
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  
  // Comparative Analysis State
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonReport, setComparisonReport] = useState<string | null>(null);
  
  const historyKey = `agentic-intelligence-history-${currentUser}`;

  // Load history and watchlist on mount
  useEffect(() => {
    openDB().catch(err => console.error("Failed to initialize DB:", err));
    try {
        const storedHistory = localStorage.getItem(historyKey);
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch (error) {
        console.error("Failed to load history from localStorage", error);
    }
    
    // Load watchlist data
    const fetchWatchlist = async () => {
        const data = await getWatchlist();
        setWatchlist(data);
    };
    fetchWatchlist();

    // Initialize Web3 services
    const initWeb3 = async () => {
      try {
        // Initialize with a placeholder token - in production, use environment variable
        await initializeWeb3Services(process.env.WEB3_STORAGE_TOKEN || '');
        setIsWeb3Initialized(true);
        console.log('Web3 services initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Web3 services:', error);
        // Continue without Web3 features
        setIsWeb3Initialized(false);
      }
    };
    
    initWeb3();

  }, [historyKey]);

  // Faucet cooldown timer
  useEffect(() => {
    if (!account || faucetCooldown <= 0) return;

    const timer = setInterval(async () => {
      try {
        const cooldown = await getFaucetCooldown(account);
        setFaucetCooldown(cooldown);
        
        if (cooldown <= 0) {
          const faucetEligible = await canClaimFaucet(account);
          setCanClaimFaucet(faucetEligible);
        }
      } catch (error) {
        console.error('Failed to update faucet cooldown:', error);
      }
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [account, faucetCooldown]);

  const resetAnalysisState = () => {
    setView('analysis');
    setUrl('');
    setIsLoading(false);
    setPipelineState(INITIAL_PIPELINE_STATE);
    setAnalysisResults({});
    setFinalReport(null);
    setError(null);
    setActiveAnalysisId(null);
    setChatSession(null);
    setChatMessages([]);
    setIsChatLoading(false);
    setIsCompareMode(false);
    setSelectedHistoryIds([]);
    setIsComparing(false);
    setComparisonReport(null);
  };

  const handleNewAnalysis = () => {
    resetAnalysisState();
    setMisinformationWarning(null);
  };

  const handleSelectHistory = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
        setView('analysis');
        setIsLoading(false);
        setError(null);
        setUrl(item.url);
        setFinalReport(item.report);
        setPipelineState(item.pipelineState);
        setAnalysisResults(item.analysisResults || {});
        setActiveAnalysisId(item.id);
        
        setChatMessages([]);
        if (item.report) {
            const session = startFollowUpChat(item.report);
            setChatSession(session);
            setChatMessages([{ role: 'model', content: "This is a past report. Feel free to ask me any questions about it." }]);
        } else {
            setChatSession(null);
        }

        setIsCompareMode(false);
        setSelectedHistoryIds([]);
        setMisinformationWarning(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all analysis history? This action cannot be undone.")) {
        setHistory([]);
        try {
            localStorage.removeItem(historyKey);
        } catch (error) {
            console.error("Failed to clear history from localStorage", error);
        }
        resetAnalysisState();
    }
  };

  const handleToggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    setSelectedHistoryIds([]);
    setView('analysis'); // Ensure we are on the analysis view
  };

  const handleSelectItemForCompare = (id: string) => {
    setSelectedHistoryIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRunComparison = async () => {
    if (selectedHistoryIds.length < 2) return;
    
    setIsComparing(true);
    setComparisonReport('');
    setError(null);

    const reportsToCompare = history.filter(item => selectedHistoryIds.includes(item.id));
    
    try {
      const briefStream = generateComparisonBrief(reportsToCompare);
      for await (const chunk of briefStream) {
        setComparisonReport(prev => (prev ?? '') + chunk);
      }
      setView('comparison');
      setIsCompareMode(false);
      
    } catch (err) {
      console.error("Comparison Error:", err);
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(`Comparison failed: ${friendlyMessage}`);
      setIsCompareMode(false);
      setSelectedHistoryIds([]);
    } finally {
      setIsComparing(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature.');
        return;
    }
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            // Load Web3 user data
            if (isWeb3Initialized) {
              await loadUserWeb3Data(accounts[0]);
            }
        }
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenBalance(0);
    setReputation(0);
    setIsValidator(false);
    setUserBadges([]);
    setCanClaimFaucet(false);
    setFaucetCooldown(0);
    setReputationVotes([]);
    setReputationNFTs([]);
    setReputationStakes([]);
    setSourceCredibility({});
  };

  // Reputation System Functions
  const handleVote = async (source: string, credibility: number) => {
    if (!account) return;

    const vote: ReputationVote = {
      id: Date.now().toString(),
      voter: account,
      source,
      credibility,
      timestamp: Date.now(),
      weight: Math.min(reputation / 10, 10) // Weight based on reputation
    };

    setReputationVotes(prev => [vote, ...prev]);
    
    // Update source credibility
    setSourceCredibility(prev => {
      const current = prev[source] || 5;
      const newCredibility = (current + credibility) / 2;
      return { ...prev, [source]: newCredibility };
    });

    // Award reputation for voting
    setReputation(prev => prev + 1);
  };

  const handleMintNFT = async (source: string, reputationAmount: number) => {
    if (!account || reputationAmount < 10) return;

    const nft: ReputationNFT = {
      id: Date.now().toString(),
      owner: account,
      reputation: reputationAmount,
      source,
      mintedAt: Date.now(),
      tokenId: `REP-${Date.now()}`,
      metadata: {
        name: `${source} Reputation NFT`,
        description: `Reputation NFT for ${source} with ${reputationAmount} reputation points`,
        image: `https://api.dicebear.com/7.x/identicon/svg?seed=${source}`,
        attributes: [
          { trait_type: 'Source', value: source },
          { trait_type: 'Reputation', value: reputationAmount },
          { trait_type: 'Tier', value: reputationAmount >= 100 ? 'Rare' : 'Common' }
        ]
      }
    };

    setReputationNFTs(prev => [nft, ...prev]);
    setReputation(prev => prev - 10); // Cost to mint NFT
  };

  const handleTransferNFT = async (tokenId: string, to: string) => {
    setReputationNFTs(prev => 
      prev.map(nft => 
        nft.tokenId === tokenId 
          ? { ...nft, owner: to }
          : nft
      )
    );
  };

  const handleStakeReputation = async (source: string, amount: number, duration: number) => {
    if (!account) return;

    const stake: ReputationStake = {
      id: Date.now().toString(),
      staker: account,
      source,
      amount,
      timestamp: Date.now(),
      duration,
      rewards: Math.floor(amount * 0.01 * duration),
      status: 'active'
    };

    setReputationStakes(prev => [stake, ...prev]);
    setReputation(prev => prev - amount);
  };

  const handleUnstakeReputation = async (stakeId: string) => {
    setReputationStakes(prev => 
      prev.map(stake => 
        stake.id === stakeId 
          ? { ...stake, status: 'withdrawn' }
          : stake
      )
    );
    
    // Award rewards
    const stake = reputationStakes.find(s => s.id === stakeId);
    if (stake) {
      setReputation(prev => prev + stake.amount + stake.rewards);
    }
  };

  const loadUserWeb3Data = async (userAddress: string) => {
    try {
      // Load token balance
      const balance = await getTokenBalance(userAddress);
      setTokenBalance(balance);
      
      // Load reputation
      const userReputation = await getReputation(userAddress);
      setReputation(userReputation);
      
      // Check if user is validator
      const validatorStatus = await isValidator(userAddress);
      setIsValidator(validatorStatus);
      
      // Load user badges
      const badges = await getUserBadges(userAddress);
      setUserBadges(badges);
      
      // Load faucet data
      const faucetEligible = await canClaimFaucet(userAddress);
      setCanClaimFaucet(faucetEligible);
      
      const cooldown = await getFaucetCooldown(userAddress);
      setFaucetCooldown(cooldown);
      
    } catch (error) {
      console.error('Failed to load user Web3 data:', error);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!account) {
        await connectWallet();
        // If connectWallet is successful, the user will have to click the button again.
        // This is a common and acceptable UX pattern.
        return;
    }

    if (analysisResults.source && analysisResults.ingestion) {
        const item: WatchlistItem = {
            domain: analysisResults.ingestion.domain,
            trustScore: analysisResults.source.trust_score,
            timestamp: Date.now(),
            reporter: account,
            url: url,
        };
        await addToWatchlist(item);
        // Refresh watchlist data
        const data = await getWatchlist();
        setWatchlist(data);
    }
  };

  const handleStakeTokens = async (amount: string) => {
    if (!account) {
        await connectWallet();
        return;
    }

    // Add pending transaction to history
    const stakeTransaction: StakeTransaction = {
      id: Date.now().toString(),
      type: 'stake',
      amount,
      timestamp: Date.now(),
      status: 'pending'
    };
    setStakeHistory(prev => [stakeTransaction, ...prev]);

    try {
        const txHash = await stakeTokens(amount);
        // Update transaction status
        setStakeHistory(prev => prev.map(tx => 
          tx.id === stakeTransaction.id 
            ? { ...tx, status: 'completed', txHash }
            : tx
        ));
        // Refresh user data
        await loadUserWeb3Data(account);
        alert('Tokens staked successfully!');
    } catch (error) {
        console.error('Failed to stake tokens:', error);
        // Update transaction status to failed
        setStakeHistory(prev => prev.map(tx => 
          tx.id === stakeTransaction.id 
            ? { ...tx, status: 'failed' }
            : tx
        ));
        alert('Failed to stake tokens. Please try again.');
    }
  };

  const handleUnstakeTokens = async (amount: string) => {
    if (!account) {
      await connectWallet();
      return;
    }

    // Add pending transaction to history
    const unstakeTransaction: StakeTransaction = {
      id: Date.now().toString(),
      type: 'unstake',
      amount,
      timestamp: Date.now(),
      status: 'pending'
    };
    setStakeHistory(prev => [unstakeTransaction, ...prev]);

    try {
      const txHash = await unstakeTokens(amount);
      // Update transaction status
      setStakeHistory(prev => prev.map(tx => 
        tx.id === unstakeTransaction.id 
          ? { ...tx, status: 'completed', txHash }
          : tx
      ));
      // Refresh user data
      await loadUserWeb3Data(account);
      alert('Tokens unstaked successfully!');
    } catch (error) {
      console.error('Failed to unstake tokens:', error);
      // Update transaction status to failed
      setStakeHistory(prev => prev.map(tx => 
        tx.id === unstakeTransaction.id 
          ? { ...tx, status: 'failed' }
          : tx
      ));
      alert('Failed to unstake tokens. Please try again.');
    }
  };

  const handleClaimFaucet = async () => {
    if (!account) {
      await connectWallet();
      return;
    }

    try {
      await claimFaucet();
      // Refresh user data
      await loadUserWeb3Data(account);
      alert('1000 ZERIFY tokens claimed successfully! You can now test all features.');
    } catch (error) {
      console.error('Failed to claim faucet:', error);
      alert('Failed to claim faucet. Please try again.');
    }
  };

  const handleRunPipeline = useCallback(async ({ url: submittedUrl, imageFile, videoFile, textInput }: { url: string; imageFile: File | null; videoFile: File | null; textInput: string; }) => {
    if (!submittedUrl && !imageFile && !videoFile && !textInput) return;
    
    setMisinformationWarning(null);
    if (submittedUrl) {
      try {
        const urlDomain = new URL(submittedUrl).hostname;
        const record = await getMisinformationRecordByDomain(urlDomain);
        if (record) {
          setMisinformationWarning(record);
        }
      } catch (e) {
        console.error("Could not check misinformation log:", e);
      }
    }
    
    resetAnalysisState();
    setUrl(submittedUrl || (textInput ? "Direct Text Input" : (imageFile ? imageFile.name : videoFile!.name)));
    setIsLoading(true);

    let currentPipelineState = { ...INITIAL_PIPELINE_STATE };
    const updateAndTrackStatus = (agent: AgentName, status: AgentStatus, details?: string) => {
        currentPipelineState = { ...currentPipelineState, [agent]: { status, details } };
        setPipelineState(currentPipelineState);
    };
    
    let currentAnalysisResults: AnalysisResults = {};

    try {
      let imageData: { data: string; mimeType: string; } | null = null;
      if (imageFile) {
        try {
          const base64String = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
          const [meta, data] = base64String.split(',');
          imageData = { data, mimeType: meta.split(';')[0].split(':')[1] };
        } catch (e) {
          throw new Error("Failed to read image file.");
        }
      }

      // 1. Content Ingestion
      if (submittedUrl) {
        updateAndTrackStatus(AgentName.CONTENT_INGESTION, AgentStatus.RUNNING, "Ingesting content from URL...");
        const ingestionResult = await performContentIngestion(submittedUrl);
        currentAnalysisResults.ingestion = ingestionResult;
        setAnalysisResults(currentAnalysisResults);
        updateAndTrackStatus(AgentName.CONTENT_INGESTION, AgentStatus.COMPLETED, "Text extracted");
      } else if (textInput) {
        updateAndTrackStatus(AgentName.CONTENT_INGESTION, AgentStatus.RUNNING, "Processing direct text...");
        const ingestionResult: IngestionOutput = {
            text: textInput,
            images: [],
            domain: '', // No domain for direct text
        };
        currentAnalysisResults.ingestion = ingestionResult;
        setAnalysisResults(currentAnalysisResults);
        updateAndTrackStatus(AgentName.CONTENT_INGESTION, AgentStatus.COMPLETED, "Text processed");
      } else {
         updateAndTrackStatus(AgentName.CONTENT_INGESTION, AgentStatus.SKIPPED, "No URL or text provided");
      }

      // 2. Textual Analysis
      if (currentAnalysisResults.ingestion?.text) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1s delay to avoid rate limiting
        updateAndTrackStatus(AgentName.TEXTUAL_ANALYSIS, AgentStatus.RUNNING, "Analyzing text...");
        const textualResult: TextualAnalysisOutput = await performTextualAnalysis(currentAnalysisResults.ingestion.text);
        currentAnalysisResults.textual = textualResult;
        setAnalysisResults({...currentAnalysisResults});
        updateAndTrackStatus(AgentName.TEXTUAL_ANALYSIS, AgentStatus.COMPLETED, "Summary and entities extracted");
      } else {
        updateAndTrackStatus(AgentName.TEXTUAL_ANALYSIS, AgentStatus.SKIPPED, "No text to analyze");
      }
      
      // 3. Emotion Analysis
      if (currentAnalysisResults.ingestion?.text) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1s delay to avoid rate limiting
        updateAndTrackStatus(AgentName.EMOTION_ANALYSIS, AgentStatus.RUNNING, "Analyzing emotional tone...");
        const emotionResult: EmotionAnalysisOutput = await performEmotionAnalysis(currentAnalysisResults.ingestion.text);
        currentAnalysisResults.emotion = emotionResult;
        setAnalysisResults({...currentAnalysisResults});
        updateAndTrackStatus(AgentName.EMOTION_ANALYSIS, AgentStatus.COMPLETED, `Emotion: ${emotionResult.dominant_emotion}`);
      } else {
        updateAndTrackStatus(AgentName.EMOTION_ANALYSIS, AgentStatus.SKIPPED, "No text to analyze");
      }

      // 4. Visual Analysis
      if (imageData) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1s delay to avoid rate limiting
        updateAndTrackStatus(AgentName.VISUAL_ANALYSIS, AgentStatus.RUNNING, "Analyzing uploaded image...");
        const visualResult = await performVisualAnalysis(imageData);
        currentAnalysisResults.visual = visualResult;
        setAnalysisResults({...currentAnalysisResults});
        updateAndTrackStatus(AgentName.VISUAL_ANALYSIS, AgentStatus.COMPLETED, "Image analysis complete");
      } else if (videoFile) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateAndTrackStatus(AgentName.VISUAL_ANALYSIS, AgentStatus.RUNNING, "Extracting frames from video...");
        const frames = await extractFramesFromVideo(videoFile, 5);
        updateAndTrackStatus(AgentName.VISUAL_ANALYSIS, AgentStatus.RUNNING, "Analyzing video frames...");
        const visualResult = await performVisualAnalysis(frames);
        currentAnalysisResults.visual = visualResult;
        setAnalysisResults({...currentAnalysisResults});
        updateAndTrackStatus(AgentName.VISUAL_ANALYSIS, AgentStatus.COMPLETED, "Video analysis complete");
      } else {
        updateAndTrackStatus(AgentName.VISUAL_ANALYSIS, AgentStatus.SKIPPED, "No visual media uploaded");
      }

      // 5. Source Intelligence
      if (currentAnalysisResults.ingestion?.domain) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1s delay to avoid rate limiting
        updateAndTrackStatus(AgentName.SOURCE_INTELLIGENCE, AgentStatus.RUNNING, "Verifying source credibility...");
        const sourceResult = await performSourceIntelligence(currentAnalysisResults.ingestion.domain);
        currentAnalysisResults.source = sourceResult;
        setAnalysisResults({...currentAnalysisResults});
        updateAndTrackStatus(AgentName.SOURCE_INTELLIGENCE, AgentStatus.COMPLETED, `Credibility: ${sourceResult.source_validity}`);
        
        const MISINFORMATION_THRESHOLD = 40;
        if (sourceResult.trust_score < MISINFORMATION_THRESHOLD) {
          try {
            await addMisinformationRecord({
              domain: currentAnalysisResults.ingestion.domain,
              url: submittedUrl,
              trustScore: sourceResult.trust_score,
              timestamp: Date.now(),
            });
          } catch (e) {
            console.error("Failed to save misinformation record:", e);
          }
        }
      } else {
        updateAndTrackStatus(AgentName.SOURCE_INTELLIGENCE, AgentStatus.SKIPPED, "No domain to verify");
      }

      
      // 6. Final Synthesis
      if (!currentAnalysisResults.textual && !currentAnalysisResults.visual) {
        throw new Error("No data available to generate a brief. Provide a URL, image, or text.");
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Add 1s delay to avoid rate limiting
      updateAndTrackStatus(AgentName.FINAL_SYNTHESIS, AgentStatus.RUNNING, "Generating final brief...");
      const reportStream = generateFinalBrief(currentAnalysisResults);
      let fullReport = '';
      setFinalReport(''); 
      for await (const chunk of reportStream) {
        fullReport += chunk;
        setFinalReport(prev => (prev ?? '') + chunk);
      }
      updateAndTrackStatus(AgentName.FINAL_SYNTHESIS, AgentStatus.COMPLETED, "Brief generated successfully");
      
      // 7. Web3 Integration - Submit to blockchain if Web3 is initialized
      if (isWeb3Initialized && account && currentAnalysisResults.source) {
        try {
          updateAndTrackStatus(AgentName.FINAL_SYNTHESIS, AgentStatus.RUNNING, "Submitting to blockchain...");
          
          // Upload full report to IPFS
          const reportData = {
            report: fullReport,
            analysisResults: currentAnalysisResults,
            timestamp: new Date().toISOString(),
            reporter: account
          };
          const ipfsHash = await uploadJsonToIpfs(reportData);
          
          // Submit verification to smart contract
          await submitVerification(
            submittedUrl || '',
            currentAnalysisResults.ingestion?.domain || '',
            currentAnalysisResults.source.trust_score,
            ipfsHash
          );
          
          // Mint NFT badge if trust score is high enough
          if (currentAnalysisResults.source.trust_score >= 80) {
            await mintVerifiedSourceBadge(
              currentAnalysisResults.ingestion?.domain || '',
              currentAnalysisResults.source.trust_score,
              ipfsHash,
              account
            );
          }
          
          // Mint verification certificate
          await mintVerificationCertificate(
            currentAnalysisResults.ingestion?.domain || '',
            currentAnalysisResults.source.trust_score,
            ipfsHash,
            account
          );
          
          updateAndTrackStatus(AgentName.FINAL_SYNTHESIS, AgentStatus.COMPLETED, "Blockchain submission complete");
          
        } catch (error) {
          console.error('Web3 submission failed:', error);
          // Continue without failing the entire pipeline
        }
      }
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        url: submittedUrl || (textInput ? "Direct Text Input" : (imageFile ? imageFile.name : videoFile!.name)),
        report: fullReport,
        timestamp: new Date().toISOString(),
        pipelineState: currentPipelineState,
        analysisResults: currentAnalysisResults,
      };

      setActiveAnalysisId(newHistoryItem.id);
      setHistory(prevHistory => {
          const updatedHistory = [newHistoryItem, ...prevHistory];
          try {
              localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
          } catch (e) {
              console.error("Failed to save history to localStorage", e);
          }
          return updatedHistory;
      });

      // Initialize chat session after report is generated
      const session = startFollowUpChat(fullReport);
      setChatSession(session);
      setChatMessages([{ role: 'model', content: "I've generated the brief. What specific details would you like to explore?" }]);


    } catch (err) {
      console.error("Pipeline Error:", err);
      const friendlyMessage = getFriendlyErrorMessage(err);
      
      const runningAgentEntry = Object.entries(currentPipelineState).find(([, val]) => val.status === AgentStatus.RUNNING);
      let failedAgentName = runningAgentEntry ? runningAgentEntry[0] as AgentName : null;

      // Check if an agent was already marked as ERROR
      if (!failedAgentName) {
        const errorAgentEntry = Object.entries(currentPipelineState).find(([, val]) => val.status === AgentStatus.ERROR);
        if (errorAgentEntry) {
          failedAgentName = errorAgentEntry[0] as AgentName;
        }
      }

      let userFacingError = `Pipeline failed: ${friendlyMessage}`;

      if (failedAgentName) {
        // If agent was running, update its status. Otherwise, the status is already ERROR.
        if (currentPipelineState[failedAgentName].status === AgentStatus.RUNNING) {
            updateAndTrackStatus(failedAgentName, AgentStatus.ERROR, friendlyMessage);
        }

        switch (failedAgentName) {
          case AgentName.CONTENT_INGESTION:
            userFacingError = `Content Ingestion failed: ${friendlyMessage}. Please check if the URL is correct and publicly accessible.`;
            break;
          case AgentName.TEXTUAL_ANALYSIS:
            if (friendlyMessage.includes('overloaded') || friendlyMessage.includes('quota')) {
              userFacingError = `Textual Analysis temporarily unavailable due to high API demand. The analysis will continue with limited data. Please try again later for full analysis.`;
            } else {
              userFacingError = `Textual Analysis failed. The content from the source might be malformed or empty. Details: ${friendlyMessage}`;
            }
            break;
          case AgentName.EMOTION_ANALYSIS:
            if (friendlyMessage.includes('overloaded') || friendlyMessage.includes('quota')) {
              userFacingError = `Emotion Analysis temporarily unavailable due to high API demand. The analysis will continue with limited data. Please try again later for full analysis.`;
            } else {
              userFacingError = `Emotion Analysis failed. The model could not determine the emotional tone of the content. Details: ${friendlyMessage}`;
            }
            break;
          case AgentName.VISUAL_ANALYSIS:
            userFacingError = `Visual Analysis failed. The uploaded media might be corrupted or in an unsupported format. Details: ${friendlyMessage}`;
            break;
          case AgentName.SOURCE_INTELLIGENCE:
            if (friendlyMessage.includes('overloaded') || friendlyMessage.includes('quota')) {
              userFacingError = `Source Intelligence temporarily unavailable due to high API demand. The analysis will continue with limited data. Please try again later for full analysis.`;
            } else {
              userFacingError = `Source Intelligence failed. The model could not verify the source's credibility, which can happen with new or obscure domains. Details: ${friendlyMessage}`;
            }
            break;
          case AgentName.FINAL_SYNTHESIS:
            userFacingError = `Final Synthesis failed. The model could not generate a brief from the collected data. Details: ${friendlyMessage}`;
            break;
          default:
            userFacingError = `An error occurred during the '${failedAgentName}' step. Details: ${friendlyMessage}`;
            break;
        }
      }
      
      setError(userFacingError);

    } finally {
      setIsLoading(false);
    }
  }, [historyKey]); 
  
  const handleSendChatMessage = async (message: string) => {
    if (!chatSession || isChatLoading) return;

    setIsChatLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, userMessage]);

    try {
        const stream = await chatSession.sendMessageStream({ message });
        
        let modelResponse = '';
        setChatMessages(prev => [...prev, { role: 'model', content: '' }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setChatMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'model') {
                    lastMessage.content = modelResponse;
                }
                return newMessages;
            });
        }

    } catch (err) {
        console.error("Chat Error:", err);
        const friendlyMessage = getFriendlyErrorMessage(err);
        setChatMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'model') {
                lastMessage.content = `Sorry, an error occurred: ${friendlyMessage}`;
            }
            return newMessages;
        });
    } finally {
        setIsChatLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'watchlist':
        return <WatchlistPage watchlist={watchlist} onBack={() => setView('analysis')} />;
      case 'comparison':
        return (
          <ComparisonReportDisplay
            comparisonBrief={comparisonReport}
            originalReports={history.filter(item => selectedHistoryIds.includes(item.id))}
            onBack={() => {
              setView('analysis');
              setSelectedHistoryIds([]);
              handleNewAnalysis();
            }}
          />
        );
      case 'analysis':
      default:
        return (
           <>
            <header className="text-center mb-8">
              <div className="inline-block p-3 bg-brand-surface border border-brand-border rounded-full mb-4 shadow-lg dark:shadow-glow">
                  <ShieldCheckIcon className="w-10 h-10 text-brand-accent" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r dark:from-green-400 from-blue-500 to-brand-accent">
                  Zerify
              </h1>
              <p className="text-lg text-brand-text-secondary mt-2 max-w-2xl mx-auto">
                Truth. Verified. Zerified.
              </p>
            </header>
            
            <main>
                <URLInput onSubmit={handleRunPipeline} isLoading={isLoading} />

                {/* Web3 Window */}
                <Web3Window
                  account={account}
                  tokenBalance={tokenBalance}
                  reputation={reputation}
                  isValidator={isValidator}
                  userBadges={userBadges}
                  onConnectWallet={connectWallet}
                  onDisconnectWallet={disconnectWallet}
                  onStakeTokens={handleStakeTokens}
                  onUnstakeTokens={handleUnstakeTokens}
                  onClaimFaucet={handleClaimFaucet}
                  canClaimFaucet={canClaimFaucet}
                  faucetCooldown={faucetCooldown}
                  stakeHistory={stakeHistory}
                  reputationVotes={reputationVotes}
                  reputationNFTs={reputationNFTs}
                  reputationStakes={reputationStakes}
                  onVote={handleVote}
                  onMintNFT={handleMintNFT}
                  onTransferNFT={handleTransferNFT}
                  onStakeReputation={handleStakeReputation}
                  onUnstakeReputation={handleUnstakeReputation}
                />

                {misinformationWarning && (
                    <div className="max-w-3xl mx-auto my-4 p-4 bg-yellow-900/50 border border-brand-warning text-brand-warning rounded-lg flex items-start gap-4" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="font-bold">Déjà Vu Warning</p>
                            <p className="text-sm">You've previously analyzed this source (<span className="font-semibold">{misinformationWarning.domain}</span>) and found it to be unreliable.</p>
                            <p className="text-xs mt-2">Logged on {new Date(misinformationWarning.timestamp).toLocaleDateString()} with a trust score of {misinformationWarning.trustScore}/100.</p>
                        </div>
                        <button onClick={() => setMisinformationWarning(null)} className="ml-auto p-1 -mt-2 -mr-2 text-brand-warning/70 hover:text-brand-warning" aria-label="Dismiss warning">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {(isLoading || finalReport || error) && (
                    <AgentPipeline pipelineState={pipelineState} analysisResults={analysisResults} />
                )}
                
                {error && (
                    <div className="max-w-4xl mx-auto my-4 p-4 bg-red-900/50 border border-brand-error text-brand-error rounded-lg">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {finalReport && !isLoading && (
                    <ReportDisplay
                        report={finalReport}
                        url={url}
                        analysisResults={analysisResults}
                        pipelineState={pipelineState}
                        onAddToWatchlist={handleAddToWatchlist}
                        isWatchlistEnabled={!!window.ethereum}
                    />
                )}

                {finalReport && !isLoading && chatSession && (
                  <FollowUpChat
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                    isLoading={isChatLoading}
                  />
                )}
            </main>
          </>
        );
    }
  };


  return (
    <div className="bg-brand-bg font-sans flex flex-col md:flex-row md:h-screen md:overflow-hidden relative isolate">
      <DynamicBackground />
      <HistorySidebar 
        history={history} 
        onSelectItem={handleSelectHistory} 
        onClearHistory={handleClearHistory}
        onNewAnalysis={handleNewAnalysis}
        activeItemId={activeAnalysisId}
        currentUser={currentUser}
        onLogout={onLogout}
        isCompareMode={isCompareMode}
        onToggleCompareMode={handleToggleCompareMode}
        selectedIds={selectedHistoryIds}
        onSelectItemForCompare={handleSelectItemForCompare}
        onRunComparison={handleRunComparison}
        isComparing={isComparing}
        onShowWatchlist={() => setView('watchlist')}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        account={account}
      />
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
