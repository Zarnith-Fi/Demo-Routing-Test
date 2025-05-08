"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRouterAddress = findRouterAddress;
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
/**
 * Derives the router address for a given owner
 * @param owner - The owner's public key
 * @param programId - The program ID (optional, defaults to the standard program ID)
 * @returns The router address and bump seed
 */
async function findRouterAddress(owner, programId = constants_1.PROGRAM_ID) {
    return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(constants_1.ROUTER_SEED), owner.toBuffer()], programId);
}
