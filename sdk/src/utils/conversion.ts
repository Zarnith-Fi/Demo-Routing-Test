import { BN } from '@coral-xyz/anchor';
import { BASIS_POINTS_DENOMINATOR } from './constants';

/**
 * Converts SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports as BN
 */
export function solToLamports(sol: number): BN {
  return new BN(sol * 1_000_000_000);
}

/**
 * Converts lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Amount in SOL
 */
export function lamportsToSol(lamports: BN | number): number {
  const lamportsNumber = typeof lamports === 'number' ? lamports : lamports.toNumber();
  return lamportsNumber / 1_000_000_000;
}

/**
 * Converts percentage to basis points
 * @param percentage - Regular percentage (e.g., 50 for 50%)
 * @returns Basis points (e.g., 5000 for 50%)
 */
export function percentageToBasisPoints(percentage: number): number {
  return Math.floor(percentage * 100);
}

/**
 * Converts basis points to percentage
 * @param basisPoints - Basis points (e.g., 5000 for 50%)
 * @returns Regular percentage (e.g., 50 for 50%)
 */
export function basisPointsToPercentage(basisPoints: number): number {
  return basisPoints / 100;
}

/**
 * Validates that the total percentage equals 100%
 * @param destinations - Array of fee destinations with percentages
 * @returns True if valid, false otherwise
 */
export function validatePercentages(
  destinations: { percentage: number }[]
): boolean {
  const total = destinations.reduce((sum, dest) => sum + dest.percentage, 0);
  return Math.abs(total - 100) < 0.001; // Allow for small floating point errors
}