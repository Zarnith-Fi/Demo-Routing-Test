# zarnithfi-router

[![npm version](https://img.shields.io/npm/v/zarnithfi-router.svg)](https://www.npmjs.com/package/zarnithfi-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript SDK for interacting with the ZarnithFi Fee Router program on Solana. Distribute SOL to multiple destinations based on predefined percentage splits.

## Features

- Create fee routers with customizable destination addresses and percentage splits
- Route SOL to multiple destinations in a single transaction
- Update destination addresses and percentage splits anytime
- Secure fee distribution with on-chain validation
- Easy-to-use TypeScript interfaces with full type safety

## Installation

```bash
npm install zarnithfi-router
```

Or with yarn:

```bash
yarn add zarnithfi-router
```

## Usage

### Initializing the SDK

```typescript
import { Connection, Keypair } from '@solana/web3.js';
import { RouterSDK } from 'zarnithfi-router';

// Set up connection and wallet
const connection = new Connection('https://api.mainnet-beta.solana.com');
const wallet = useWallet(); // Using Solana wallet adapter

// Initialize the SDK
const routerSDK = new RouterSDK(connection, wallet);
```

### Creating a Router

```typescript
import { PublicKey } from '@solana/web3.js';

// Define destinations with percentage splits (must total 100%)
const destinations = [
  {
    address: new PublicKey('Treasury_Address_Here'),
    percentage: 50 // 50%
  },
  {
    address: new PublicKey('Team_Address_Here'),
    percentage: 30 // 30%
  },
  {
    address: new PublicKey('Marketing_Address_Here'),
    percentage: 20 // 20%
  }
];

// Create a router
const signature = await routerSDK.createRouter(destinations);
console.log(`Router created: ${signature}`);
```

### Routing SOL

```typescript
// Get your router address
const routerAddress = await routerSDK.getRouterAddress();

// Route 1 SOL according to percentage splits
const signature = await routerSDK.routeSolFees(routerAddress, 1);
console.log(`SOL routed successfully: ${signature}`);
```

### Updating Destinations

```typescript
// Define new destinations
const newDestinations = [
  {
    address: new PublicKey('Treasury_Address_Here'),
    percentage: 40 // 40%
  },
  {
    address: new PublicKey('Team_Address_Here'),
    percentage: 40 // 40%
  },
  {
    address: new PublicKey('Marketing_Address_Here'),
    percentage: 20 // 20%
  }
];

// Update router destinations
const signature = await routerSDK.updateDestinations(routerAddress, newDestinations);
console.log(`Router updated: ${signature}`);
```

### Getting Router Data

```typescript
// Fetch router data
const routerData = await routerSDK.getRouterData(routerAddress);
console.log('Router owner:', routerData.owner.toString());
console.log('Destinations:');
routerData.destinations.forEach(dest => {
  console.log(`  ${dest.address.toString()}: ${dest.percentage}%`);
});
```

### Closing a Router

```typescript
// Close router and reclaim rent
const signature = await routerSDK.closeRouter(routerAddress);
console.log(`Router closed: ${signature}`);
```

## API Reference

### `RouterSDK`

The main class for interacting with the Fee Router program.

#### Constructor

```typescript
constructor(
  connection: Connection,
  wallet: Wallet,
  programId?: PublicKey
)
```

#### Methods

- `createRouter(destinations: FeeDestinationInput[], options?: TransactionOptions): Promise<string>`
- `updateDestinations(routerAddress: PublicKey, newDestinations: FeeDestinationInput[], options?: TransactionOptions): Promise<string>`
- `routeSolFees(routerAddress: PublicKey, amount: number, options?: TransactionOptions): Promise<string>`
- `closeRouter(routerAddress: PublicKey, options?: TransactionOptions): Promise<string>`
- `getRouterData(routerAddress: PublicKey): Promise<RouterData>`
- `routerExists(routerAddress: PublicKey): Promise<boolean>`
- `getRouterAddress(): Promise<PublicKey>`
- `static findRouterAddress(owner: PublicKey, programId?: PublicKey): Promise<PublicKey>`

### Types

```typescript
interface FeeDestinationInput {
  address: PublicKey;
  percentage: number; // 0-100
}

interface RouterData {
  owner: PublicKey;
  destinations: {
    address: PublicKey;
    percentage: number; // 0-100
  }[];
}

interface TransactionOptions {
  commitment?: 'processed' | 'confirmed' | 'finalized';
  preflightCommitment?: 'processed' | 'confirmed' | 'finalized';
  skipPreflight?: boolean;
  maxRetries?: number;
}
```

## Use Cases

- Revenue sharing for protocols and DAOs
- Automatic splitting of marketplace fees
- Treasury management for teams
- Royalty distribution for NFT projects
- Automated payments to contributors

## Requirements

- Node.js 14+
- Solana Web3.js 1.73.0+
- Anchor 0.31.0+

## License

MIT