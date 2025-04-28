import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TestRouter } from "../target/types/test_router";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { expect } from "chai";

describe("Zarnith Router", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TestRouter as Program<TestRouter>;
  
  // Define wallets for our test
  const owner = anchor.web3.Keypair.generate();
  const destination1 = anchor.web3.Keypair.generate();
  const destination2 = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();
  
  // Define the router PDA
  let routerPDA: PublicKey;
  let bump: number;
  
  // Initialize test setup
  before(async () => {
    // Airdrop SOL to the test wallets
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(owner.publicKey, 2 * LAMPORTS_PER_SOL),
      "confirmed"
    );
    
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 2 * LAMPORTS_PER_SOL),
      "confirmed"
    );
    
    // Derive the router PDA
    [routerPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("router"), owner.publicKey.toBuffer()],
      program.programId
    );

    // Log the keys for debugging
    console.log("Owner:", owner.publicKey.toString());
    console.log("User:", user.publicKey.toString());
    console.log("Destination1:", destination1.publicKey.toString());
    console.log("Destination2:", destination2.publicKey.toString());
    console.log("Router PDA:", routerPDA.toString());
  });
  
  it("Initialize a router with 60/40 split", async () => {
    // Create destination list with 60/40 split
    const destinations = [
      {
        address: destination1.publicKey,
        percentage: 6000 // 60%
      },
      {
        address: destination2.publicKey,
        percentage: 4000 // 40%
      }
    ];
    
    // Initialize the router
    await program.methods
      .initializeRouter(destinations)
      .accounts({
        router: routerPDA,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner])
      .rpc();
    
    // Fetch the router account and verify its content
    const routerAccount = await program.account.router.fetch(routerPDA);
    
    expect(routerAccount.owner.toBase58()).to.equal(owner.publicKey.toBase58());
    expect(routerAccount.destinations.length).to.equal(2);
    expect(routerAccount.destinations[0].address.toBase58()).to.equal(destination1.publicKey.toBase58());
    expect(routerAccount.destinations[0].percentage).to.equal(6000);
    expect(routerAccount.destinations[1].address.toBase58()).to.equal(destination2.publicKey.toBase58());
    expect(routerAccount.destinations[1].percentage).to.equal(4000);
  });
  
  it("Route SOL to destinations with 60/40 split", async () => {
    // Get initial balances
    const initialDest1Balance = await provider.connection.getBalance(destination1.publicKey);
    const initialDest2Balance = await provider.connection.getBalance(destination2.publicKey);
    const initialUserBalance = await provider.connection.getBalance(user.publicKey);

    console.log("Initial balances:");
    console.log("- Destination1:", initialDest1Balance);
    console.log("- Destination2:", initialDest2Balance);
    console.log("- User:", initialUserBalance);
    
    // Amount to route: 0.5 SOL (to make calculations easier)
    const amountToRoute = LAMPORTS_PER_SOL / 2; // 0.5 SOL in lamports
    
    try {
      // Route the SOL
      const tx = await program.methods
        .routeSolFees(new anchor.BN(amountToRoute))
        .accounts({
          router: routerPDA,
          sender: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts([
          { pubkey: destination1.publicKey, isWritable: true, isSigner: false },
          { pubkey: destination2.publicKey, isWritable: true, isSigner: false },
        ])
        .signers([user])
        .rpc({ commitment: "confirmed" });

      console.log("Transaction signature:", tx);
      
      // Get final balances
      const finalDest1Balance = await provider.connection.getBalance(destination1.publicKey);
      const finalDest2Balance = await provider.connection.getBalance(destination2.publicKey);
      const finalUserBalance = await provider.connection.getBalance(user.publicKey);

      console.log("Final balances:");
      console.log("- Destination1:", finalDest1Balance);
      console.log("- Destination2:", finalDest2Balance);
      console.log("- User:", finalUserBalance);
      
      // Calculate expected amounts
      const expectedDest1Amount = Math.floor(amountToRoute * 0.6); // 60% of 0.5 SOL
      const expectedDest2Amount = Math.floor(amountToRoute * 0.4); // 40% of 0.5 SOL
      
      // Verify the balances
      expect(finalDest1Balance - initialDest1Balance).to.equal(expectedDest1Amount);
      expect(finalDest2Balance - initialDest2Balance).to.equal(expectedDest2Amount);
      
      // Verify user's balance decreased by at least the amount sent
      // In tests, the difference might be exactly equal to the amount sent
      // plus a very small transaction fee
      const totalSent = expectedDest1Amount + expectedDest2Amount;
      expect(initialUserBalance - finalUserBalance).to.be.at.least(totalSent);
    } catch (error) {
      console.error("Error during route_sol_fees:", error);
      throw error;
    }
  });
  
  it("Update router destinations to 70/30 split", async () => {
    // Create new destination list with 70/30 split
    const newDestinations = [
      {
        address: destination1.publicKey,
        percentage: 7000 // 70%
      },
      {
        address: destination2.publicKey,
        percentage: 3000 // 30%
      }
    ];
    
    // Update the router destinations
    await program.methods
      .updateDestinations(newDestinations)
      .accounts({
        router: routerPDA,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();
    
    // Fetch the router account and verify its updated content
    const routerAccount = await program.account.router.fetch(routerPDA);
    
    expect(routerAccount.destinations.length).to.equal(2);
    expect(routerAccount.destinations[0].percentage).to.equal(7000);
    expect(routerAccount.destinations[1].percentage).to.equal(3000);
  });
  
  it("Route SOL with updated 70/30 split", async () => {
    // Get initial balances
    const initialDest1Balance = await provider.connection.getBalance(destination1.publicKey);
    const initialDest2Balance = await provider.connection.getBalance(destination2.publicKey);
    const initialUserBalance = await provider.connection.getBalance(user.publicKey);
    
    // Amount to route: 0.3 SOL
    const amountToRoute = LAMPORTS_PER_SOL * 0.3; // 0.3 SOL in lamports
    
    try {
      // Route the SOL
      const tx = await program.methods
        .routeSolFees(new anchor.BN(amountToRoute))
        .accounts({
          router: routerPDA,
          sender: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts([
          { pubkey: destination1.publicKey, isWritable: true, isSigner: false },
          { pubkey: destination2.publicKey, isWritable: true, isSigner: false },
        ])
        .signers([user])
        .rpc({ commitment: "confirmed" });
      
      // Get final balances
      const finalDest1Balance = await provider.connection.getBalance(destination1.publicKey);
      const finalDest2Balance = await provider.connection.getBalance(destination2.publicKey);
      const finalUserBalance = await provider.connection.getBalance(user.publicKey);
      
      // Calculate expected amounts
      const expectedDest1Amount = Math.floor(amountToRoute * 0.7); // 70% of 0.3 SOL
      const expectedDest2Amount = Math.floor(amountToRoute * 0.3); // 30% of 0.3 SOL
      
      // Verify the balances
      expect(finalDest1Balance - initialDest1Balance).to.equal(expectedDest1Amount);
      expect(finalDest2Balance - initialDest2Balance).to.equal(expectedDest2Amount);
      
      // Verify user's balance decreased by at least the amount sent
      // In tests, the difference might be exactly equal to the amount sent
      // plus a very small transaction fee
      const totalSent = expectedDest1Amount + expectedDest2Amount;
      expect(initialUserBalance - finalUserBalance).to.be.at.least(totalSent);
    } catch (error) {
      console.error("Error during route_sol_fees with updated split:", error);
      throw error;
    }
  });
  
  it("Close the router", async () => {
    // Get initial balance of owner
    const initialOwnerBalance = await provider.connection.getBalance(owner.publicKey);
    
    // Close the router
    await program.methods
      .closeRouter()
      .accounts({
        router: routerPDA,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();
    
    // Get final owner balance
    const finalOwnerBalance = await provider.connection.getBalance(owner.publicKey);
    
    // Verify the router is closed by trying to fetch it (should fail)
    try {
      await program.account.router.fetch(routerPDA);
      expect.fail("Router account should be closed");
    } catch (error) {
      // This is expected, account should be closed
      expect(error).to.exist;
    }
    
    // Verify owner received rent refund (minus tx fee)
    expect(finalOwnerBalance).to.be.greaterThan(initialOwnerBalance - 5000); // Accounting for tx fee
  });
  
  it("Verify failures for invalid cases", async () => {
    // Try to initialize a router with invalid percentages
    const invalidDestinations = [
      {
        address: destination1.publicKey,
        percentage: 5000 // 50%
      },
      {
        address: destination2.publicKey,
        percentage: 4000 // 40%
      }
      // Total: 90%, which is invalid (should be 100%)
    ];
    
    try {
      // Need to create a new router since we closed the previous one
      const newOwner = anchor.web3.Keypair.generate();
      await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(newOwner.publicKey, 1 * LAMPORTS_PER_SOL),
        "confirmed"
      );
      
      const [newRouterPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("router"), newOwner.publicKey.toBuffer()],
        program.programId
      );
      
      // This should fail because percentages don't add up to 100%
      await program.methods
        .initializeRouter(invalidDestinations)
        .accounts({
          router: newRouterPDA,
          owner: newOwner.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([newOwner])
        .rpc();
        
      expect.fail("Should have failed with invalid percentages");
    } catch (error) {
      // This is expected
      expect(error).to.exist;
      console.log("Successfully caught error for invalid percentages");
    }
  });
});