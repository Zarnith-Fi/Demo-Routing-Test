import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionSignature
  } from '@solana/web3.js';
  import {
    Program,
    AnchorProvider,
    Wallet,
    BN
  } from '@coral-xyz/anchor';
  import {
    FeeDestinationInput,
    RouterData,
    RouterError,
    TransactionOptions
  } from './types';
  import { PROGRAM_ID } from './utils/constants';
  import { findRouterAddress } from './utils/pda';
  import {
    solToLamports,
    percentageToBasisPoints,
    basisPointsToPercentage,
    validatePercentages
  } from './utils/conversion';
  
  // Import the IDL directly
  const IDL = require('../test_router.json');
  
  /**
   * SDK for interacting with the Fee Router program
   */
  export class RouterSDK {
    private program: any; // Use any type to bypass TS checking
    private provider: any;
  
    /**
     * Create a new RouterSDK instance
     * @param connection - Solana connection
     * @param wallet - Wallet for signing transactions
     * @param programId - Program ID (optional, defaults to the standard program ID)
     */
    constructor(
      connection: Connection,
      wallet: Wallet,
      programId: PublicKey = PROGRAM_ID
    ) {
      // Create a provider
      this.provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
  
      // Create the program interface
      this.program = new Program(
        IDL,
        this.provider
      );
    }
  
    /**
     * Find the router address for a given owner
     * @param owner - Owner's public key
     * @param programId - Program ID (optional, defaults to the standard program ID)
     * @returns The router address
     */
    static async findRouterAddress(
      owner: PublicKey,
      programId: PublicKey = PROGRAM_ID
    ): Promise<PublicKey> {
      const [routerAddress] = await findRouterAddress(owner, programId);
      return routerAddress;
    }
  
    /**
     * Create a new router with destinations
     * @param destinations - Array of destination addresses and percentages
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    async createRouter(
      destinations: FeeDestinationInput[],
      options?: TransactionOptions
    ): Promise<TransactionSignature> {
      // Validate percentages
      if (!validatePercentages(destinations)) {
        throw new Error(RouterError.InvalidPercentage);
      }
  
      // Get the owner's public key
      const owner = this.provider.wallet.publicKey;
  
      // Derive the router address
      const [routerAddress] = await findRouterAddress(owner, this.program.programId);
  
      // Convert percentages to basis points
      const programDestinations = destinations.map(dest => ({
        address: dest.address,
        percentage: percentageToBasisPoints(dest.percentage)
      }));
  
      // Create the transaction
      const tx = await this.program.methods
        .initializeRouter(programDestinations)
        .accounts({
          router: routerAddress,
          owner: owner,
          systemProgram: SystemProgram.programId,
        })
        .transaction();
  
      // Send the transaction
      return await this.provider.sendAndConfirm(tx, [], options);
    }
  
    /**
     * Update destinations for an existing router
     * @param routerAddress - Router account address
     * @param newDestinations - New destinations and percentages
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    async updateDestinations(
      routerAddress: PublicKey,
      newDestinations: FeeDestinationInput[],
      options?: TransactionOptions
    ): Promise<TransactionSignature> {
      // Validate percentages
      if (!validatePercentages(newDestinations)) {
        throw new Error(RouterError.InvalidPercentage);
      }
  
      // Convert percentages to basis points
      const programDestinations = newDestinations.map(dest => ({
        address: dest.address,
        percentage: percentageToBasisPoints(dest.percentage)
      }));
  
      // Create the transaction
      const tx = await this.program.methods
        .updateDestinations(programDestinations)
        .accounts({
          router: routerAddress,
          owner: this.provider.wallet.publicKey,
        })
        .transaction();
  
      // Send the transaction
      return await this.provider.sendAndConfirm(tx, [], options);
    }
  
    /**
     * Route SOL to destinations according to percentages
     * @param routerAddress - Router account address
     * @param amount - Amount of SOL to route
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    async routeSolFees(
      routerAddress: PublicKey,
      amount: number,
      options?: TransactionOptions
    ): Promise<TransactionSignature> {
      // Validate amount
      if (amount <= 0) {
        throw new Error(RouterError.InvalidAmount);
      }
  
      // Get router data to find destinations
      const routerData = await this.getRouterData(routerAddress);
  
      // Convert SOL to lamports
      const lamports = solToLamports(amount);
  
      // Create the instruction with remaining accounts for destinations
      const ix = await this.program.methods
        .routeSolFees(lamports)
        .accounts({
          router: routerAddress,
          sender: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(
          routerData.destinations.map(dest => ({
            pubkey: dest.address,
            isWritable: true,
            isSigner: false,
          }))
        )
        .instruction();
  
      // Create and send the transaction
      const tx = new Transaction().add(ix);
      return await this.provider.sendAndConfirm(tx, [], options);
    }
  
    /**
     * Close router and reclaim rent
     * @param routerAddress - Router account address
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    async closeRouter(
      routerAddress: PublicKey,
      options?: TransactionOptions
    ): Promise<TransactionSignature> {
      // Create the transaction
      const tx = await this.program.methods
        .closeRouter()
        .accounts({
          router: routerAddress,
          owner: this.provider.wallet.publicKey,
        })
        .transaction();
  
      // Send the transaction
      return await this.provider.sendAndConfirm(tx, [], options);
    }
  
    /**
     * Get router data
     * @param routerAddress - Router account address
     * @returns Router data with destinations
     */
    async getRouterData(routerAddress: PublicKey): Promise<RouterData> {
      try {
        // Use any to bypass TS checking issues
        const accountName = 'router';
        const routerAccount = await this.program.account[accountName].fetch(routerAddress);
  
        // Convert raw data to our interface format
        return {
          owner: routerAccount.owner,
          destinations: routerAccount.destinations.map((dest: any) => ({
            address: dest.address,
            percentage: basisPointsToPercentage(dest.percentage)
          }))
        };
      } catch (error) {
        throw new Error(RouterError.InvalidRouter);
      }
    }
  
    /**
     * Check if a router exists
     * @param routerAddress - Router account address
     * @returns True if the router exists, false otherwise
     */
    async routerExists(routerAddress: PublicKey): Promise<boolean> {
      try {
        const accountName = 'router';
        await this.program.account[accountName].fetch(routerAddress);
        return true;
      } catch (error) {
        return false;
      }
    }
  
    /**
     * Get the router address for the current wallet
     * @returns The router address
     */
    async getRouterAddress(): Promise<PublicKey> {
      const owner = this.provider.wallet.publicKey;
      return RouterSDK.findRouterAddress(owner, this.program.programId);
    }
  }