// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VerificationRegistry
 * @dev Smart contract for storing and managing verification results
 * Stores verification data on-chain with IPFS hashes for detailed reports
 */
contract VerificationRegistry is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}
    struct Verification {
        string url;
        string domain;
        uint256 trustScore;
        uint256 timestamp;
        address reporter;
        string ipfsHash;
        bool isDisputed;
        uint256 disputeCount;
    }
    
    struct Dispute {
        address disputer;
        string reason;
        uint256 timestamp;
        bool resolved;
    }
    
    mapping(string => Verification) public verifications;
    mapping(string => Dispute[]) public disputes;
    mapping(address => uint256) public reporterReputation;
    
    uint256 public constant MIN_TRUST_SCORE = 0;
    uint256 public constant MAX_TRUST_SCORE = 100;
    uint256 public constant DISPUTE_THRESHOLD = 3; // Number of disputes before review
    
    event VerificationSubmitted(
        string indexed domain,
        string url,
        uint256 trustScore,
        address indexed reporter,
        string ipfsHash
    );
    
    event DisputeCreated(
        string indexed domain,
        address indexed disputer,
        string reason
    );
    
    event DisputeResolved(
        string indexed domain,
        bool upheld,
        address indexed resolver
    );
    
    event ReputationUpdated(
        address indexed reporter,
        uint256 newReputation
    );
    
    /**
     * @dev Submit a verification result
     * @param url The URL that was verified
     * @param domain The domain of the URL
     * @param trustScore The trust score (0-100)
     * @param ipfsHash The IPFS hash of the detailed verification report
     */
    function submitVerification(
        string memory url,
        string memory domain,
        uint256 trustScore,
        string memory ipfsHash
    ) external {
        require(trustScore >= MIN_TRUST_SCORE && trustScore <= MAX_TRUST_SCORE, "Invalid trust score");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        
        // If verification already exists, update it
        if (bytes(verifications[domain].domain).length > 0) {
            // Only allow updates if the new score is significantly different
            // or if the reporter has higher reputation
            require(
                absDiff(verifications[domain].trustScore, trustScore) > 10 ||
                reporterReputation[msg.sender] > reporterReputation[verifications[domain].reporter],
                "Insufficient reputation to update verification"
            );
        }
        
        verifications[domain] = Verification({
            url: url,
            domain: domain,
            trustScore: trustScore,
            timestamp: block.timestamp,
            reporter: msg.sender,
            ipfsHash: ipfsHash,
            isDisputed: false,
            disputeCount: 0
        });
        
        // Update reporter reputation
        reporterReputation[msg.sender] += 1;
        
        emit VerificationSubmitted(domain, url, trustScore, msg.sender, ipfsHash);
        emit ReputationUpdated(msg.sender, reporterReputation[msg.sender]);
    }
    
    /**
     * @dev Create a dispute for a verification
     * @param domain The domain to dispute
     * @param reason The reason for the dispute
     */
    function createDispute(string memory domain, string memory reason) external {
        require(bytes(verifications[domain].domain).length > 0, "Verification does not exist");
        require(!verifications[domain].isDisputed, "Already disputed");
        
        disputes[domain].push(Dispute({
            disputer: msg.sender,
            reason: reason,
            timestamp: block.timestamp,
            resolved: false
        }));
        
        verifications[domain].disputeCount += 1;
        
        // If dispute threshold is reached, mark as disputed
        if (verifications[domain].disputeCount >= DISPUTE_THRESHOLD) {
            verifications[domain].isDisputed = true;
        }
        
        emit DisputeCreated(domain, msg.sender, reason);
    }
    
    /**
     * @dev Resolve a dispute (only owner)
     * @param domain The domain to resolve
     * @param upheld Whether the dispute is upheld
     */
    function resolveDispute(string memory domain, bool upheld) external onlyOwner {
        require(verifications[domain].isDisputed, "No active dispute");
        
        if (upheld) {
            // Remove the verification if dispute is upheld
            delete verifications[domain];
        } else {
            // Clear the dispute if not upheld
            verifications[domain].isDisputed = false;
            verifications[domain].disputeCount = 0;
        }
        
        emit DisputeResolved(domain, upheld, msg.sender);
    }
    
    /**
     * @dev Get verification data for a domain
     * @param domain The domain to query
     * @return The verification data
     */
    function getVerification(string memory domain) external view returns (Verification memory) {
        return verifications[domain];
    }
    
    /**
     * @dev Get all disputes for a domain
     * @param domain The domain to query
     * @return Array of disputes
     */
    function getDisputes(string memory domain) external view returns (Dispute[] memory) {
        return disputes[domain];
    }
    
    /**
     * @dev Check if a domain has been verified
     * @param domain The domain to check
     * @return Whether the domain has been verified
     */
    function isVerified(string memory domain) external view returns (bool) {
        return bytes(verifications[domain].domain).length > 0 && !verifications[domain].isDisputed;
    }
    
    /**
     * @dev Get the trust score for a domain
     * @param domain The domain to query
     * @return The trust score (0 if not verified)
     */
    function getTrustScore(string memory domain) external view returns (uint256) {
        if (bytes(verifications[domain].domain).length == 0 || verifications[domain].isDisputed) {
            return 0;
        }
        return verifications[domain].trustScore;
    }
    
    /**
     * @dev Helper function to calculate absolute difference
     */
    function absDiff(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a - b : b - a;
    }
}
