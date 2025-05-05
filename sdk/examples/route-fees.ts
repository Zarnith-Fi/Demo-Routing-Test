import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { RouterSDK } from '../src';

// Example: Route SOL fees to destinations

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

    // Route 0.1 SOL to the destinations
    const amountSol = 0.1;
    console.log(`\nRouting ${amountSol} SOL to destinations...`);
    
    const signature = await routerSDK.routeSolFees(routerAddress, amountSol);
    console.log(`Transaction signature: ${signature}`);
    console.log('SOL routed successfully!');
    
    // Log the distribution
    console.log('\nFee distribution:');
    routerData.destinations.forEach(dest => {
      const destAmount = amountSol * dest.percentage / 100;
      console.log(`  ${dest.address.toString()} received ${destAmount} SOL (${dest.percentage}%)`);
    });
  } catch (error) {
    console.error('Error routing fees:', error);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);