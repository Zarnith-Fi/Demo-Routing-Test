import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { FeeDestinationInput, RouterData, TransactionOptions } from './types';
/**
 * SDK for interacting with the Fee Router program
 */
export declare class RouterSDK {
    private program;
    private provider;
    /**
     * Create a new RouterSDK instance
     * @param connection - Solana connection
     * @param wallet - Wallet for signing transactions
     * @param programId - Program ID (optional, defaults to the standard program ID)
     */
    constructor(connection: Connection, wallet: Wallet, programId?: PublicKey);
    /**
     * Find the router address for a given owner
     * @param owner - Owner's public key
     * @param programId - Program ID (optional, defaults to the standard program ID)
     * @returns The router address
     */
    static findRouterAddress(owner: PublicKey, programId?: PublicKey): Promise<PublicKey>;
    /**
     * Create a new router with destinations
     * @param destinations - Array of destination addresses and percentages
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    createRouter(destinations: FeeDestinationInput[], options?: TransactionOptions): Promise<TransactionSignature>;
    /**
     * Update destinations for an existing router
     * @param routerAddress - Router account address
     * @param newDestinations - New destinations and percentages
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    updateDestinations(routerAddress: PublicKey, newDestinations: FeeDestinationInput[], options?: TransactionOptions): Promise<TransactionSignature>;
    /**
     * Route SOL to destinations according to percentages
     * @param routerAddress - Router account address
     * @param amount - Amount of SOL to route
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    routeSolFees(routerAddress: PublicKey, amount: number, options?: TransactionOptions): Promise<TransactionSignature>;
    /**
     * Close router and reclaim rent
     * @param routerAddress - Router account address
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    closeRouter(routerAddress: PublicKey, options?: TransactionOptions): Promise<TransactionSignature>;
    /**
     * Get router data
     * @param routerAddress - Router account address
     * @returns Router data with destinations
     */
    getRouterData(routerAddress: PublicKey): Promise<RouterData>;
    /**
     * Check if a router exists
     * @param routerAddress - Router account address
     * @returns True if the router exists, false otherwise
     */
    routerExists(routerAddress: PublicKey): Promise<boolean>;
    /**
     * Get the router address for the current wallet
     * @returns The router address
     */
    getRouterAddress(): Promise<PublicKey>;
}
