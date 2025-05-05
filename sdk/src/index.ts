// Export the main SDK class
export { RouterSDK } from './client';

// Export types
export {
  FeeDestinationInput,
  FeeDestinationData,
  RouterData,
  RouterError,
  TransactionOptions,
} from './types';

// Export utility functions
export {
  solToLamports,
  lamportsToSol,
  percentageToBasisPoints,
  basisPointsToPercentage,
  validatePercentages,
} from './utils/conversion';

export { findRouterAddress } from './utils/pda';
export { PROGRAM_ID, BASIS_POINTS_DENOMINATOR } from './utils/constants';

// Export IDL for advanced usage
export { IDL } from './idl';