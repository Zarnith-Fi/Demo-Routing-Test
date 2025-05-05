import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { RouterSDK } from '../src';

// Example: Close router and reclaim rent

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
      console.error('Router does not exist! Nothing to close.');
      return;
    }

    // Get the current router data before closing
    const routerData = await routerSDK.getRouterData(routerAddress);
    console.log('Router owner:', routerData.owner.toString());
    console.log('Router destinations:');
    routerData.destinations.forEach((dest, i) => {
      console.log(`  ${i + 1}: ${dest.address.toString()} - ${dest.percentage}%`);
    });

    // Get current SOL balance of the wallet before closing
    const balanceBefore = await connection.getBalance(wallet.publicKey);
    console.log(`Current balance: ${balanceBefore / 1_000_000_000} SOL`);

    // Close the router account
    console.log('\nClosing router...');
    const signature = await routerSDK.closeRouter(routerAddress);
    console.log(`Transaction signature: ${signature}`);
    console.log('Router closed successfully!');

    // Verify the account is closed
    const balanceAfter = await connection.getBalance(wallet.publicKey);
    console.log(`New balance: ${balanceAfter / 1_000_000_000} SOL`);
    console.log(`SOL returned: ${(balanceAfter - balanceBefore) / 1_000_000_000} SOL`);

    // Verify the router no longer exists
    const stillExists = await routerSDK.routerExists(routerAddress);
    console.log(`Router exists after closing: ${stillExists}`);
  } catch (error) {
    console.error('Error closing router:', error);
  }
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  }
);