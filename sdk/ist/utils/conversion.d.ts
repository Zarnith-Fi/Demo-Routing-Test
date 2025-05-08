import { BN } from '@coral-xyz/anchor';
/**
 * Converts SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports as BN
 */
export declare function solToLamports(sol: number): BN;
/**
 * Converts lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Amount in SOL
 */
export declare function lamportsToSol(lamports: BN | number): number;
/**
 * Converts percentage to basis points
 * @param percentage - Regular percentage (e.g., 50 for 50%)
 * @returns Basis points (e.g., 5000 for 50%)
 */
export declare function percentageToBasisPoints(percentage: number): number;
/**
 * Converts basis points to percentage
 * @param basisPoints - Basis points (e.g., 5000 for 50%)
 * @returns Regular percentage (e.g., 50 for 50%)
 */
export declare function basisPointsToPercentage(basisPoints: number): number;
/**
 * Validates that the total percentage equals 100%
 * @param destinations - Array of fee destinations with percentages
 * @returns True if valid, false otherwise
 */
export declare function validatePercentages(destinations: {
    percentage: number;
}[]): boolean;
