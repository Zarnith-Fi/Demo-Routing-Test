import { PublicKey } from '@solana/web3.js';
/**
 * Fee destination with address and percentage
 */
export interface FeeDestinationInput {
    address: PublicKey;
    percentage: number;
}
/**
 * Fee destination as stored in the program
 */
export interface FeeDestinationData {
    address: PublicKey;
    percentage: number;
}
/**
 * Router data structure
 */
export interface RouterData {
    owner: PublicKey;
    destinations: FeeDestinationData[];
}
/**
 * Transaction options
 */
export interface TransactionOptions {
    commitment?: 'processed' | 'confirmed' | 'finalized' | string;
    preflightCommitment?: 'processed' | 'confirmed' | 'finalized' | string;
    skipPreflight?: boolean;
    maxRetries?: number;
}
/**
 * Router SDK errors
 */
export declare enum RouterError {
    InvalidPercentage = "Total percentage must equal 100%",
    NoDestinations = "No destinations provided",
    InvalidAmount = "Amount must be greater than 0",
    InvalidRouter = "Invalid router address",
    InvalidDestination = "Invalid destination address",
    Unauthorized = "You are not authorized to perform this action"
}
