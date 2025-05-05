# Fee Router SDK

A TypeScript SDK for interacting with the Solana Fee Router Program. This SDK simplifies the process of creating, managing, and using a fee routing system on Solana, allowing developers to easily distribute SOL to multiple addresses based on percentage splits.

## Features

- Create new routers with destinations and percentage splits
- Update destinations for existing routers
- Route SOL to multiple destinations according to configured percentages
- Close router accounts and reclaim rent
- Helper functions for SOL/lamports and percentage/basis points conversions
- Simple, intuitive API with TypeScript support

## Installation

```bash
npm install sol-fee-router
```

## Usage

### Initialize the SDK

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { RouterSDK } from 'sol-fee-router';
import { useWallet } from '@solana/wallet-adapter-react'; // or your preferred wallet provider

// Initialize the SDK
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = useWallet(); // Use your wallet adapter
const routerSDK = new RouterSDK(connection, wallet);
```

### Create a New Router

```typescript
// Define destinations and percentages (must sum to 100%)
const destinations = [
  {
    address: new PublicKey('...'), // Treasury
    percentage: 50 // 50%
  },
  {
    address: new PublicKey('...'), // Development team
    percentage: 30 // 30%
  },
  {
    address: new PublicKey('...'), // Marketing
    percentage: 20 // 20%
  }
];

// Create the router
const signature = await routerSDK.createRouter(destinations);
console.log(`Router created: ${signature}`);
```

### Route SOL to Destinations

```typescript
// Get the router address for the current wallet
const routerAddress = await routerSDK.getRouterAddress();

// Route 1 SOL to the destinations
const signature = await routerSDK.routeSolFees(routerAddress, 1); // 1 SOL
console.log(`SOL routed: ${signature}`);
```

### Update Router Destinations

```typescript
// Define new destinations
const newDestinations = [
  {
    address: new PublicKey('...'),
    percentage: 40 // 40%
  },
  {
    address: new PublicKey('...'),
    percentage: 40 // 40%
  },
  {
    address: new PublicKey('...'),
    percentage: 20 // 20%
  }
];

// Update the router destinations
const signature = await routerSDK.updateDestinations(routerAddress, newDestinations);
console.log(`Router updated: ${signature}`);
```

### Get Router Data

```typescript
// Fetch router data
const routerData = await routerSDK.getRouterData(routerAddress);

console.log(`Router owner: ${routerData.owner.toString()}`);
console.log('Destinations:');
routerData.destinations.forEach(dest => {
  console.log(`  ${dest.address.toString()}: ${dest.percentage}%`);
});
```

### Close Router and Reclaim Rent

```typescript
// Close the router account
const signature = await routerSDK.closeRouter(routerAddress);
console.log(`Router closed: ${signature}`);
```

## API Reference

### `RouterSDK`

Main class for interacting with the Fee Router program.

#### Constructor

```typescript
constructor(
  connection: Connection,
  wallet: Wallet,
  programId?: PublicKey
)
```

#### Static Methods

- `findRouterAddress(owner: PublicKey, programId?: PublicKey): Promise<PublicKey>`
  Derives the router address for a given owner.

#### Instance Methods

- `createRouter(destinations: FeeDestinationInput[], options?: TransactionOptions): Promise<TransactionSignature>`
  Creates a new router with destinations and percentage splits.

- `updateDestinations(routerAddress: PublicKey, newDestinations: FeeDestinationInput[], options?: TransactionOptions): Promise<TransactionSignature>`
  Updates destinations for an existing router.

- `routeSolFees(routerAddress: PublicKey, amount: number, options?: TransactionOptions): Promise<TransactionSignature>`
  Routes SOL to destinations according to percentages.

- `closeRouter(routerAddress: PublicKey, options?: TransactionOptions): Promise<TransactionSignature>`
  Closes router and reclaims rent.

- `getRouterData(routerAddress: PublicKey): Promise<RouterData>`
  Gets router data including destinations.

- `routerExists(routerAddress: PublicKey): Promise<boolean>`
  Checks if a router exists.

- `getRouterAddress(): Promise<PublicKey>`
  Gets the router address for the current wallet.

### Utility Functions

- `solToLamports(sol: number): BN`
  Converts SOL to lamports.

- `lamportsToSol(lamports: BN | number): number`
  Converts lamports to SOL.

- `percentageToBasisPoints(percentage: number): number`
  Converts percentage to basis points.

- `basisPointsToPercentage(basisPoints: number): number`
  Converts basis points to percentage.

## Development

### Building the SDK

```bash
# Install dependencies
npm install

# Build the SDK
npm run build
```

### Running Examples

```bash
# Create a router
npm run example:create

# Route SOL
npm run example:route

# Update router destinations
npm run example:update

# Close router
npm run example:close
```

## License

MIT