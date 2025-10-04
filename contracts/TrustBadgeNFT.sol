// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title TrustBadgeNFT
 * @dev NFT contract for trust badges and verification certificates
 * Mints NFTs for verified sources and trusted verifiers
 */
contract TrustBadgeNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    enum BadgeType {
        VERIFIED_SOURCE,    // For domains with high trust scores
        TRUSTED_VERIFIER,   // For users with high reputation
        VERIFICATION_CERT   // For specific verification reports
    }
    
    struct BadgeMetadata {
        BadgeType badgeType;
        string domain;
        uint256 trustScore;
        uint256 timestamp;
        string ipfsHash;
    }
    
    mapping(uint256 => BadgeMetadata) public badgeMetadata;
    mapping(string => uint256) public domainToTokenId;
    mapping(address => uint256[]) public userBadges;
    
    uint256 public constant MIN_TRUST_SCORE_FOR_BADGE = 80;
    uint256 public constant MIN_REPUTATION_FOR_VERIFIER = 10;
    
    event BadgeMinted(
        uint256 indexed tokenId,
        BadgeType badgeType,
        string domain,
        address indexed recipient
    );
    
    event BadgeTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    
    constructor() ERC721("Zerify Trust Badge", "ZTB") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a verified source badge
     * @param domain The domain that earned the badge
     * @param trustScore The trust score of the domain
     * @param ipfsHash The IPFS hash of the verification report
     * @param recipient The address to receive the badge
     */
    function mintVerifiedSourceBadge(
        string memory domain,
        uint256 trustScore,
        string memory ipfsHash,
        address recipient
    ) external onlyOwner {
        require(trustScore >= MIN_TRUST_SCORE_FOR_BADGE, "Trust score too low for badge");
        require(domainToTokenId[domain] == 0, "Badge already exists for domain");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(recipient, tokenId);
        
        badgeMetadata[tokenId] = BadgeMetadata({
            badgeType: BadgeType.VERIFIED_SOURCE,
            domain: domain,
            trustScore: trustScore,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });
        
        domainToTokenId[domain] = tokenId;
        userBadges[recipient].push(tokenId);
        
        emit BadgeMinted(tokenId, BadgeType.VERIFIED_SOURCE, domain, recipient);
    }
    
    /**
     * @dev Mint a trusted verifier badge
     * @param recipient The address to receive the badge
     * @param reputation The reputation score of the verifier
     */
    function mintTrustedVerifierBadge(
        address recipient,
        uint256 reputation
    ) external onlyOwner {
        require(reputation >= MIN_REPUTATION_FOR_VERIFIER, "Reputation too low for badge");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(recipient, tokenId);
        
        badgeMetadata[tokenId] = BadgeMetadata({
            badgeType: BadgeType.TRUSTED_VERIFIER,
            domain: "",
            trustScore: reputation,
            timestamp: block.timestamp,
            ipfsHash: ""
        });
        
        userBadges[recipient].push(tokenId);
        
        emit BadgeMinted(tokenId, BadgeType.TRUSTED_VERIFIER, "", recipient);
    }
    
    /**
     * @dev Mint a verification certificate NFT
     * @param domain The domain that was verified
     * @param trustScore The trust score
     * @param ipfsHash The IPFS hash of the verification report
     * @param recipient The address to receive the certificate
     */
    function mintVerificationCertificate(
        string memory domain,
        uint256 trustScore,
        string memory ipfsHash,
        address recipient
    ) external onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(recipient, tokenId);
        
        badgeMetadata[tokenId] = BadgeMetadata({
            badgeType: BadgeType.VERIFICATION_CERT,
            domain: domain,
            trustScore: trustScore,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });
        
        userBadges[recipient].push(tokenId);
        
        emit BadgeMinted(tokenId, BadgeType.VERIFICATION_CERT, domain, recipient);
    }
    
    /**
     * @dev Get badge metadata
     * @param tokenId The token ID
     * @return The badge metadata
     */
    function getBadgeMetadata(uint256 tokenId) external view returns (BadgeMetadata memory) {
        return badgeMetadata[tokenId];
    }
    
    /**
     * @dev Get all badges for a user
     * @param user The user address
     * @return Array of token IDs
     */
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    /**
     * @dev Check if a domain has a verified source badge
     * @param domain The domain to check
     * @return Whether the domain has a badge
     */
    function hasVerifiedSourceBadge(string memory domain) external view returns (bool) {
        return domainToTokenId[domain] > 0;
    }
    
    /**
     * @dev Get the token ID for a domain's badge
     * @param domain The domain
     * @return The token ID (0 if no badge exists)
     */
    function getDomainBadgeTokenId(string memory domain) external view returns (uint256) {
        return domainToTokenId[domain];
    }
    
    /**
     * @dev Override transfer to update user badges mapping
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        address result = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            // Remove from sender's badges
            uint256[] storage senderBadges = userBadges[from];
            for (uint256 i = 0; i < senderBadges.length; i++) {
                if (senderBadges[i] == tokenId) {
                    senderBadges[i] = senderBadges[senderBadges.length - 1];
                    senderBadges.pop();
                    break;
                }
            }
            
            // Add to recipient's badges
            userBadges[to].push(tokenId);
            
            emit BadgeTransferred(tokenId, from, to);
        }
        
        return result;
    }
    
    /**
     * @dev Override tokenURI to return IPFS metadata
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override supportsInterface
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
