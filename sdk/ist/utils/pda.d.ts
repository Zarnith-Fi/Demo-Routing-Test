import { PublicKey } from '@solana/web3.js';
/**
 * Derives the router address for a given owner
 * @param owner - The owner's public key
 * @param programId - The program ID (optional, defaults to the standard program ID)
 * @returns The router address and bump seed
 */
export declare function findRouterAddress(owner: PublicKey, programId?: PublicKey): Promise<[PublicKey, number]>;
