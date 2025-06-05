# 2048 Game Onchain

```diff
// SPDX-License-Identifier: MIT
/// @title Game2048NFT - On-Chain 2048 Game with NFT Rewards & XP
/// @author Original implementation by: 0xgrey - https://github.com/arcxteam
/// @notice A blockchain implementation of the 2048 game where players can earn NFT rewards based on their highest tile achievement
/// @dev This contract combines an ERC721 NFT collection with a fully on-chain 2048 game implementation
/// @custom:security-contact cuan@greyscope.xyz or gani@greyscope.xyz

 * @dev Key Features:
 * - Two gameplay modes: On-chain (fully verifiable) and Off-chain (gas-efficient)
 * - Dynamic NFT minting with 11 different levels (2 to 2048)
 * - Limited edition collection of NFTs
 * - Leaderboard system tracking top players
 * - Player point system with move-based rewards
 * - 15-day claim window for earned NFTs
 * 
 * @dev Game Mechanics:
 * - Players must be approved before playing
 * - Each move updates the game state on-chain mode
 * - Game ends when no moves are possible
 * - Highest tile determines NFT level
 * - Batch tx/id with raw processing available for off-chain mode
 * 
 * @dev NFT System:
 * - Each NFT represents a game achievement level
 * - Different metadata URIs for each tile level (2-2048)
 * - Descriptive text for each achievement level
 * - Owner-restricted metadata updates
 ```
