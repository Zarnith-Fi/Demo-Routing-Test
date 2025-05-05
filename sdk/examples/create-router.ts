import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { RouterSDK } from '../src';

// Example: Create a new router

async function main() {
  // Replace with your own values or load from .env file
  const PRIVATE_KEY = Keypair.generate(); // In a real app, load your private key
  const RPC_URL = 'http://localhost:8899'; // Replace with your RPC URL

  // Set up the connection and wallet
  const connection = new Connection(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY);
  
  // Initialize the RouterSDK
  const routerSDK = new RouterSDK(connection, wallet);

  console.log(`Using wallet: ${wallet.publicKey.toString()}`);

  // Define destinations and percentages (must sum to 100%)
  const destinations = [
    {
      address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC
      percentage: 50 // 50%
    },
    {
      address: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // Random address
      percentage: 30 // 30%
    },
    {
      address: new PublicKey('8rUUP8NfNhUMW4yXz2pXAGdg4jYjaRi42LvghcYvPS7M'), // Random address
      percentage: 20 // 20%
    }
  ];

  try {
    // Derive the router address
    const routerAddress = await routerSDK.getRouterAddress();
    console.log(`Router address: ${routerAddress.toString()}`);

    // Check if the router already exists
    const exists = await routerSDK.routerExists(routerAddress);
    if (exists) {
      console.log('Router already exists!');
      return;
    }

    // Create the router
    console.log('Creating router...');
    const signature = await routerSDK.createRouter(destinations);
    console.log(`Transaction signature: ${signature}`);
    console.log('Router created successfully!');

    // Fetch the router data to verify
    const routerData = await routerSDK.getRouterData(routerAddress);
    console.log('Router data:', JSON.stringify(routerData, null, 2));
  } catch (error) {
    console.error('Error creating router:', error);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);