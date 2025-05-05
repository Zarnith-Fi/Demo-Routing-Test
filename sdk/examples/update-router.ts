import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { RouterSDK } from '../src';

// Example: Update router destinations

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

  try {
    // Get the router address for this wallet
    const routerAddress = await routerSDK.getRouterAddress();
    console.log(`Router address: ${routerAddress.toString()}`);

    // Check if the router exists
    const exists = await routerSDK.routerExists(routerAddress);
    if (!exists) {
      console.error('Router does not exist! Please create it first.');
      return;
    }

    // Get the current router data
    const routerData = await routerSDK.getRouterData(routerAddress);
    console.log('Current router destinations:');
    routerData.destinations.forEach((dest, i) => {
      console.log(`  ${i + 1}: ${dest.address.toString()} - ${dest.percentage}%`);
    });

    // Define new destinations (must sum to 100%)
    const newDestinations = [
      {
        address: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC
        percentage: 25 // 25%
      },
      {
        address: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // Random address
        percentage: 25 // 25%
      },
      {
        address: new PublicKey('8rUUP8NfNhUMW4yXz2pXAGdg4jYjaRi42LvghcYvPS7M'), // Random address
        percentage: 50 // 50%
      }
    ];

    // Update the router destinations
    console.log('\nUpdating router destinations...');
    const signature = await routerSDK.updateDestinations(routerAddress, newDestinations);
    console.log(`Transaction signature: ${signature}`);
    console.log('Router destinations updated successfully!');

    // Get the updated router data
    const updatedRouterData = await routerSDK.getRouterData(routerAddress);
    console.log('\nNew router destinations:');
    updatedRouterData.destinations.forEach((dest, i) => {
      console.log(`  ${i + 1}: ${dest.address.toString()} - ${dest.percentage}%`);
    });
  } catch (error) {
    console.error('Error updating router destinations:', error);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);