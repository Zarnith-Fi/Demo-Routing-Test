"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASIS_POINTS_DENOMINATOR = exports.ROUTER_SEED = exports.PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
// Program ID from the declared_id in the program
exports.PROGRAM_ID = new web3_js_1.PublicKey('8dtNeFAukB4U7aoTZZrtWQ6S2cCUHoUcKmNyZJ9cKvTG');
// Seeds used for PDA derivation
exports.ROUTER_SEED = 'router';
// Constants for percentage calculations
exports.BASIS_POINTS_DENOMINATOR = 10000; // 100% in basis points
