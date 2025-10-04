// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ZerifyToken
 * @dev ERC20 token for the Zerify verification platform
 * Users earn tokens for accurate verifications and can stake tokens to become validators
 */
contract ZerifyToken is ERC20, Ownable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant REWARD_PER_VERIFICATION = 10 * 10**18; // 10 tokens per verification
    uint256 public constant STAKE_REQUIREMENT = 1000 * 10**18; // 1000 tokens to become validator
    
    mapping(address => uint256) public stakes;
    mapping(address => bool) public validators;
    mapping(address => uint256) public reputation;
    
    event TokensRewarded(address indexed user, uint256 amount, string reason);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event ValidatorRegistered(address indexed user);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    
    constructor() ERC20("Zerify Token", "ZERIFY") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Reward tokens to a user for accurate verification
     * @param user The address to reward
     * @param reason The reason for the reward
     */
    function rewardTokens(address user, string memory reason) external onlyOwner {
        _mint(user, REWARD_PER_VERIFICATION);
        reputation[user] += 1;
        emit TokensRewarded(user, REWARD_PER_VERIFICATION, reason);
        emit ReputationUpdated(user, reputation[user]);
    }
    
    /**
     * @dev Stake tokens to become a validator
     * @param amount The amount of tokens to stake
     */
    function stakeTokens(uint256 amount) external {
        require(amount >= STAKE_REQUIREMENT, "Insufficient stake amount");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender] += amount;
        validators[msg.sender] = true;
        
        emit TokensStaked(msg.sender, amount);
        emit ValidatorRegistered(msg.sender);
    }
    
    /**
     * @dev Unstake tokens (only if not currently validating)
     * @param amount The amount of tokens to unstake
     */
    function unstakeTokens(uint256 amount) external {
        require(stakes[msg.sender] >= amount, "Insufficient stake");
        
        stakes[msg.sender] -= amount;
        if (stakes[msg.sender] < STAKE_REQUIREMENT) {
            validators[msg.sender] = false;
        }
        
        _transfer(address(this), msg.sender, amount);
        emit TokensUnstaked(msg.sender, amount);
    }
    
    /**
     * @dev Slash tokens from a validator for malicious behavior
     * @param validator The validator to slash
     * @param amount The amount to slash
     */
    function slashValidator(address validator, uint256 amount) external onlyOwner {
        require(validators[validator], "Not a validator");
        require(stakes[validator] >= amount, "Insufficient stake to slash");
        
        stakes[validator] -= amount;
        reputation[validator] = reputation[validator] > 0 ? reputation[validator] - 1 : 0;
        
        if (stakes[validator] < STAKE_REQUIREMENT) {
            validators[validator] = false;
        }
        
        emit ReputationUpdated(validator, reputation[validator]);
    }
    
    /**
     * @dev Check if an address is a validator
     * @param user The address to check
     * @return Whether the address is a validator
     */
    function isValidator(address user) external view returns (bool) {
        return validators[user];
    }
    
    /**
     * @dev Get the reputation score of a user
     * @param user The address to check
     * @return The reputation score
     */
    function getReputation(address user) external view returns (uint256) {
        return reputation[user];
    }
}
