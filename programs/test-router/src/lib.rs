#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("8dtNeFAukB4U7aoTZZrtWQ6S2cCUHoUcKmNyZJ9cKvTG");

#[program]
pub mod test_router {
    use super::*;

    /// Initialize a new router with destinations and their percentage splits
    pub fn initialize_router(
        ctx: Context<InitializeRouter>,
        destinations: Vec<FeeDestination>,
    ) -> Result<()> {
        // Validate the destinations
        validate_destinations(&destinations)?;

        // Initialize the router
        let router = &mut ctx.accounts.router;
        router.owner = ctx.accounts.owner.key();
        router.destinations = destinations;

        msg!("Router initialized with {} destinations", router.destinations.len());
        Ok(())
    }

    /// Update the destinations and percentage splits for an existing router
    pub fn update_destinations(
        ctx: Context<UpdateDestinations>,
        new_destinations: Vec<FeeDestination>,
    ) -> Result<()> {
        // Validate the new destinations
        validate_destinations(&new_destinations)?;

        // Update the router configuration
        let router = &mut ctx.accounts.router;
        router.destinations = new_destinations;

        msg!("Router updated with {} destinations", router.destinations.len());
        Ok(())
    }

    /// Route SOL to multiple destinations according to the percentage splits
    pub fn route_sol_fees<'info>(
        ctx: Context<'_, '_, '_, 'info, RouteSolFees<'info>>,
        amount: u64,
    ) -> Result<()> {
        let router = &ctx.accounts.router;
        let sender_key = ctx.accounts.sender.key();
        let system_program = ctx.accounts.system_program.to_account_info();
        let sender_info = ctx.accounts.sender.to_account_info();
        
        // Ensure we have enough destination accounts in remaining_accounts
        require!(
            ctx.remaining_accounts.len() >= router.destinations.len(),
            ErrorCode::InsufficientDestinationAccounts
        );
        
        // For each destination, transfer the appropriate amount
        for (i, destination) in router.destinations.iter().enumerate() {
            // Get the destination account from remaining_accounts
            let destination_account = &ctx.remaining_accounts[i];
            
            // Verify that this account matches the address stored in the router
            require!(
                destination_account.key() == destination.address,
                ErrorCode::DestinationMismatch
            );
            
            // Calculate amount based on percentage (in basis points)
            let dest_amount = (amount * destination.percentage as u64) / 10000;
            
            if dest_amount > 0 {
                // Create transfer instruction
                let ix = system_instruction::transfer(
                    &sender_key,
                    &destination.address,
                    dest_amount,
                );
                
                // Create account infos array for invoke
                let account_infos = [
                    sender_info.clone(),
                    destination_account.clone(),
                    system_program.clone(),
                ];
                
                // Invoke the transfer
                invoke(&ix, &account_infos)?;
                
                msg!("Transferred {} lamports to {}", dest_amount, destination.address);
            }
        }

        Ok(())
    }

    /// Close router and reclaim rent (optional feature)
    pub fn close_router(_ctx: Context<CloseRouter>) -> Result<()> {
        // The account will be closed automatically via the close constraint
        msg!("Router account closed and rent reclaimed");
        Ok(())
    }
}

/// Helper function to validate destinations
fn validate_destinations(destinations: &[FeeDestination]) -> Result<()> {
    // Must have at least one destination
    require!(!destinations.is_empty(), ErrorCode::NoDestinations);

    // Sum of percentages must be 100% (10000 basis points)
    let total_percentage: u16 = destinations.iter().map(|d| d.percentage).sum();
    require!(total_percentage == 10000, ErrorCode::InvalidTotalPercentage);

    Ok(())
}

/// FeeDestination struct - stores destination address and percentage split
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct FeeDestination {
    pub address: Pubkey,
    pub percentage: u16,  // In basis points (10000 = 100%)
}

/// Router account structure
#[account]
pub struct Router {
    pub owner: Pubkey,                     // Owner of the router
    pub destinations: Vec<FeeDestination>, // List of destination addresses and their splits
}

/// Initialize router context
#[derive(Accounts)]
pub struct InitializeRouter<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 4 + (32 + 2) * 10, // Discriminator + owner + vec len + 10 destinations max
        seeds = [b"router", owner.key().as_ref()],
        bump
    )]
    pub router: Account<'info, Router>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Update destinations context
#[derive(Accounts)]
pub struct UpdateDestinations<'info> {
    #[account(
        mut,
        has_one = owner @ ErrorCode::Unauthorized,
    )]
    pub router: Account<'info, Router>,
    
    pub owner: Signer<'info>,
}

/// Route SOL fees context
#[derive(Accounts)]
pub struct RouteSolFees<'info> {
    pub router: Account<'info, Router>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

/// Close router context
#[derive(Accounts)]
pub struct CloseRouter<'info> {
    #[account(
        mut,
        has_one = owner @ ErrorCode::Unauthorized,
        close = owner
    )]
    pub router: Account<'info, Router>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
}

/// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    
    #[msg("No destinations provided")]
    NoDestinations,
    
    #[msg("Total percentage must equal 10000 (100%)")]
    InvalidTotalPercentage,
    
    #[msg("Insufficient destination accounts provided")]
    InsufficientDestinationAccounts,
    
    #[msg("Destination account does not match address in router")]
    DestinationMismatch,
}