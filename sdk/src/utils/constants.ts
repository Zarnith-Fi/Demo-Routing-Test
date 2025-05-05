import { PublicKey } from '@solana/web3.js';

// Program ID from the declared_id in the program
export const PROGRAM_ID = new PublicKey('8dtNeFAukB4U7aoTZZrtWQ6S2cCUHoUcKmNyZJ9cKvTG');

// Seeds used for PDA derivation
export const ROUTER_SEED = 'router';

// Constants for percentage calculations
export const BASIS_POINTS_DENOMINATOR = 10000; // 100% in basis points