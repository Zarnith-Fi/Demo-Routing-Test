"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterSDK = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const types_1 = require("./types");
const constants_1 = require("./utils/constants");
const pda_1 = require("./utils/pda");
const conversion_1 = require("./utils/conversion");
// Import the IDL directly
const idl_1 = require("./idl");
/**
 * SDK for interacting with the Fee Router program
 */
class RouterSDK {
    /**
     * Create a new RouterSDK instance
     * @param connection - Solana connection
     * @param wallet - Wallet for signing transactions
     * @param programId - Program ID (optional, defaults to the standard program ID)
     */
    constructor(connection, wallet, programId = constants_1.PROGRAM_ID) {
        // Create a provider
        this.provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        // Create the program interface
        this.program = new anchor_1.Program(idl_1.IDL, this.provider);
    }
    /**
     * Find the router address for a given owner
     * @param owner - Owner's public key
     * @param programId - Program ID (optional, defaults to the standard program ID)
     * @returns The router address
     */
    static async findRouterAddress(owner, programId = constants_1.PROGRAM_ID) {
        const [routerAddress] = await (0, pda_1.findRouterAddress)(owner, programId);
        return routerAddress;
    }
    /**
     * Create a new router with destinations
     * @param destinations - Array of destination addresses and percentages
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    async createRouter(destinations, options) {
        // Validate percentages
        if (!(0, conversion_1.validatePercentages)(destinations)) {
            throw new Error(types_1.RouterError.InvalidPercentage);
        }
        // Get the owner's public key
        const owner = this.provider.wallet.publicKey;
        // Derive the router address
        const [routerAddress] = await (0, pda_1.findRouterAddress)(owner, this.program.programId);
        // Convert percentages to basis points
        const programDestinations = destinations.map(dest => ({
            address: dest.address,
            percentage: (0, conversion_1.percentageToBasisPoints)(dest.percentage)
        }));
        // Create the transaction
        const tx = await this.program.methods
            .initializeRouter(programDestinations)
            .accounts({
            router: routerAddress,
            owner: owner,
            systemProgram: web3_js_1.SystemProgram.programId,
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
    async updateDestinations(routerAddress, newDestinations, options) {
        // Validate percentages
        if (!(0, conversion_1.validatePercentages)(newDestinations)) {
            throw new Error(types_1.RouterError.InvalidPercentage);
        }
        // Convert percentages to basis points
        const programDestinations = newDestinations.map(dest => ({
            address: dest.address,
            percentage: (0, conversion_1.percentageToBasisPoints)(dest.percentage)
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
    async routeSolFees(routerAddress, amount, options) {
        // Validate amount
        if (amount <= 0) {
            throw new Error(types_1.RouterError.InvalidAmount);
        }
        // Get router data to find destinations
        const routerData = await this.getRouterData(routerAddress);
        // Convert SOL to lamports
        const lamports = (0, conversion_1.solToLamports)(amount);
        // Create the instruction with remaining accounts for destinations
        const ix = await this.program.methods
            .routeSolFees(lamports)
            .accounts({
            router: routerAddress,
            sender: this.provider.wallet.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .remainingAccounts(routerData.destinations.map(dest => ({
            pubkey: dest.address,
            isWritable: true,
            isSigner: false,
        })))
            .instruction();
        // Create and send the transaction
        const tx = new web3_js_1.Transaction().add(ix);
        return await this.provider.sendAndConfirm(tx, [], options);
    }
    /**
     * Close router and reclaim rent
     * @param routerAddress - Router account address
     * @param options - Transaction options (optional)
     * @returns Transaction signature
     */
    async closeRouter(routerAddress, options) {
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
    async getRouterData(routerAddress) {
        try {
            // Use any to bypass TS checking issues
            const accountName = 'router';
            const routerAccount = await this.program.account[accountName].fetch(routerAddress);
            // Convert raw data to our interface format
            return {
                owner: routerAccount.owner,
                destinations: routerAccount.destinations.map((dest) => ({
                    address: dest.address,
                    percentage: (0, conversion_1.basisPointsToPercentage)(dest.percentage)
                }))
            };
        }
        catch (error) {
            throw new Error(types_1.RouterError.InvalidRouter);
        }
    }
    /**
     * Check if a router exists
     * @param routerAddress - Router account address
     * @returns True if the router exists, false otherwise
     */
    async routerExists(routerAddress) {
        try {
            const accountName = 'router';
            await this.program.account[accountName].fetch(routerAddress);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get the router address for the current wallet
     * @returns The router address
     */
    async getRouterAddress() {
        const owner = this.provider.wallet.publicKey;
        return RouterSDK.findRouterAddress(owner, this.program.programId);
    }
}
exports.RouterSDK = RouterSDK;
