import { PublicKey } from '@solana/web3.js';
import { 
  validatePercentages,
  percentageToBasisPoints,
  basisPointsToPercentage,
  solToLamports,
  lamportsToSol
} from '../src/utils/conversion';
import { expect } from 'chai';

describe('Router SDK Utils', () => {
  describe('Percentage Validation', () => {
    it('should pass validation when percentages sum to 100', () => {
      const destinations = [
        { percentage: 50 },
        { percentage: 30 },
        { percentage: 20 }
      ];
      expect(validatePercentages(destinations)).to.equal(true);
    });

    it('should fail validation when percentages do not sum to 100', () => {
      const destinations = [
        { percentage: 50 },
        { percentage: 30 },
        { percentage: 10 }
      ];
      expect(validatePercentages(destinations)).to.equal(false);
    });

    it('should handle floating point percentages', () => {
      const destinations = [
        { percentage: 33.33 },
        { percentage: 33.33 },
        { percentage: 33.34 }
      ];
      expect(validatePercentages(destinations)).to.equal(true);
    });
  });

  describe('Conversion Functions', () => {
    it('should convert percentages to basis points', () => {
      expect(percentageToBasisPoints(50)).to.equal(5000);
      expect(percentageToBasisPoints(33.33)).to.equal(3333);
      expect(percentageToBasisPoints(0.5)).to.equal(50);
    });

    it('should convert basis points to percentages', () => {
      expect(basisPointsToPercentage(5000)).to.equal(50);
      expect(basisPointsToPercentage(3333)).to.equal(33.33);
      expect(basisPointsToPercentage(50)).to.equal(0.5);
    });

    it('should convert SOL to lamports', () => {
      const lamports = solToLamports(1);
      expect(lamports.toNumber()).to.equal(1_000_000_000);
      
      const smallLamports = solToLamports(0.001);
      expect(smallLamports.toNumber()).to.equal(1_000_000);
    });

    it('should convert lamports to SOL', () => {
      expect(lamportsToSol(1_000_000_000)).to.equal(1);
      expect(lamportsToSol(1_000_000)).to.equal(0.001);
    });
  });
});