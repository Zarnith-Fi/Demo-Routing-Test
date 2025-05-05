# Zarnith Router Contract

A lightweight, gas-efficient fee routing smart contract for Solana.

## Overview

The Zarnith Router Test demo Contract is a Solana smart contract that enables:

- Collecting incoming SOL from users/dApps
- Routing the SOL to one or more recipient addresses
- Configuring percentage-based splits for each destination
- Updating routing configuration by the owner

## 🛠️ Technical Details

### Contract Architecture

The Zarnith Router Contract is built on three core components:

1. **Router Account**: A Program Derived Address (PDA) that stores routing configuration
2. **FeeDestination Struct**: Represents a destination address and its percentage split 
3. **Instructions**: Initialize, update, route, and close operations

### Instructions

The contract exposes the following instructions:

#### `initialize_router`
Creates a new Router account with specified destinations and percentage splits.

**Parameters:**
- `destinations`: Array of `FeeDestination` structs (address + percentage)

**Accounts:**
- `router`: Router PDA to initialize
- `owner`: Owner of the router (signer, payer)
- `system_program`: System Program

#### `update_destinations`
Updates the list of destinations and their percentage splits.

**Parameters:**
- `new_destinations`: New array of `FeeDestination` structs

**Accounts:**
- `router`: Existing Router account
- `owner`: Owner of the router (signer)

#### `route_sol_fees`
Distributes incoming SOL across destinations according to percentage splits.

**Parameters:**
- `amount`: Amount of SOL (in lamports) to distribute

**Accounts:**
- `router`: Existing Router account
- `sender`: Sender of SOL (signer)
- `system_program`: System Program
- `remaining_accounts`: Destination accounts to receive SOL

#### `close_router`
Closes the Router account and reclaims rent.

**Accounts:**
- `router`: Router account to close
- `owner`: Owner of the router (signer, receives rent)

### FeeDestination Struct

```rust
pub struct FeeDestination {
    pub address: Pubkey,       // Destination wallet address
    pub percentage: u16,       // Split percentage in basis points (10000 = 100%)
}
```

## Usage

### Initialize a Router

Create a new router with a 60/40 split between two wallets:

```typescript
// Define destinations with percentages in basis points (100% = 10000)
const destinations = [
  { 
    address: wallet1.publicKey, 
    percentage: 6000  // 60% 
  },
  { 
    address: wallet2.publicKey, 
    percentage: 4000  // 40%
  }
];

// Derive router PDA
const [routerPDA] = await PublicKey.findProgramAddress(
  [Buffer.from("router"), owner.publicKey.toBuffer()],
  programId
);

// Initialize router
await program.methods
  .initializeRouter(destinations)
  .accounts({
    router: routerPDA,
    owner: owner.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([owner])
  .rpc();
```

### Route SOL

Route 1 SOL through the router to be split between destinations:

```typescript
// Amount to route (1 SOL)
const amountToRoute = 1_000_000_000;

// Route SOL
await program.methods
  .routeSolFees(new BN(amountToRoute))
  .accounts({
    router: routerPDA,
    sender: sender.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .remainingAccounts([
    { pubkey: wallet1.publicKey, isWritable: true, isSigner: false },
    { pubkey: wallet2.publicKey, isWritable: true, isSigner: false },
  ])
  .signers([sender])
  .rpc();

// Result: 0.6 SOL sent to wallet1, 0.4 SOL sent to wallet2
```

### Update Router Configuration

Change the distribution to a 70/30 split:

```typescript
// New destination configuration
const newDestinations = [
  { 
    address: wallet1.publicKey, 
    percentage: 7000  // 70% 
  },
  { 
    address: wallet2.publicKey, 
    percentage: 3000  // 30%
  }
];

// Update router
await program.methods
  .updateDestinations(newDestinations)
  .accounts({
    router: routerPDA,
    owner: owner.publicKey,
  })
  .signers([owner])
  .rpc();
```

### Close Router

Close the router and reclaim rent:

```typescript
await program.methods
  .closeRouter()
  .accounts({
    router: routerPDA,
    owner: owner.publicKey,
  })
  .signers([owner])
  .rpc();
```

## 📦 Installation

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/zarnith-router.git
   cd zarnith-router
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Build the program:
   ```bash
   anchor build
   ```

4. Run tests:
   ```bash
   anchor test
   ```

##  Testing

The contract includes comprehensive tests that verify:

- Initialization with proper percentage splits
- SOL routing with exact amount calculations
- Updating destination configurations
- Closing routers
- Handling invalid configurations

Run the tests with:

```bash
anchor test
```
