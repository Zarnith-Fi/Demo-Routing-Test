import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID, ROUTER_SEED } from './constants';

/**
 * Derives the router address for a given owner
 * @param owner - The owner's public key
 * @param programId - The program ID (optional, defaults to the standard program ID)
 * @returns The router address and bump seed
 */
export async function findRouterAddress(
  owner: PublicKey,
  programId: PublicKey = PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ROUTER_SEED), owner.toBuffer()],
    programId
  );
}