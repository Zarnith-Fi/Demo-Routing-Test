"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solToLamports = solToLamports;
exports.lamportsToSol = lamportsToSol;
exports.percentageToBasisPoints = percentageToBasisPoints;
exports.basisPointsToPercentage = basisPointsToPercentage;
exports.validatePercentages = validatePercentages;
const anchor_1 = require("@coral-xyz/anchor");
/**
 * Converts SOL to lamports
 * @param sol - Amount in SOL
 * @returns Amount in lamports as BN
 */
function solToLamports(sol) {
    return new anchor_1.BN(sol * 1000000000);
}
/**
 * Converts lamports to SOL
 * @param lamports - Amount in lamports
 * @returns Amount in SOL
 */
function lamportsToSol(lamports) {
    const lamportsNumber = typeof lamports === 'number' ? lamports : lamports.toNumber();
    return lamportsNumber / 1000000000;
}
/**
 * Converts percentage to basis points
 * @param percentage - Regular percentage (e.g., 50 for 50%)
 * @returns Basis points (e.g., 5000 for 50%)
 */
function percentageToBasisPoints(percentage) {
    return Math.floor(percentage * 100);
}
/**
 * Converts basis points to percentage
 * @param basisPoints - Basis points (e.g., 5000 for 50%)
 * @returns Regular percentage (e.g., 50 for 50%)
 */
function basisPointsToPercentage(basisPoints) {
    return basisPoints / 100;
}
/**
 * Validates that the total percentage equals 100%
 * @param destinations - Array of fee destinations with percentages
 * @returns True if valid, false otherwise
 */
function validatePercentages(destinations) {
    const total = destinations.reduce((sum, dest) => sum + dest.percentage, 0);
    return Math.abs(total - 100) < 0.001; // Allow for small floating point errors
}
