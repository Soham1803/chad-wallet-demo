import { TokenTicker } from '@/components/RotatingBanner';

// Custom interface for token details including decimals
export interface SolanaToken extends TokenTicker {
  decimals: number;
}

const SOL_PRICE = 142.45; // Fallback SOL price if API fails

// Public Solana RPC url fallback
const PUBLIC_RPC_URL = 'https://api.mainnet-beta.solana.com';

interface DexPair {
  chainId: string;
  baseToken: {
    address: string;
  };
  priceUsd: string;
  priceChange?: {
    h24?: number;
  };
  liquidity?: {
    usd?: number;
  };
}

/**
 * Fetch real-time token prices, 24h changes, and details from DexScreener
 */
export async function fetchRealTokenPrices(currentTokens: SolanaToken[]): Promise<SolanaToken[]> {
  const mints = currentTokens
    .filter((t) => t.symbol !== 'CHAD') // Exclude custom mock CHAD token
    .map((t) => t.mint);

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mints.join(',')}`);
    if (!res.ok) throw new Error('DexScreener API error');
    const data = await res.json();

    if (!data.pairs || !Array.isArray(data.pairs)) return currentTokens;

    const rawPairs = data.pairs as DexPair[];

    // First map all live tokens from DexScreener
    const updated = currentTokens.map((token) => {
      if (token.symbol === 'CHAD') return token; // Skip custom token for now

      // Find pairs matching this token address on Solana
      const pairs = rawPairs.filter(
        (p) => p.chainId === 'solana' && p.baseToken.address === token.mint
      );
      if (pairs.length === 0) return token;

      // Select highest liquidity pair (usually Raydium or Orca)
      const bestPair = pairs.reduce((best, current) => {
        const bestLiq = best.liquidity?.usd || 0;
        const currLiq = current.liquidity?.usd || 0;
        return currLiq > bestLiq ? current : best;
      }, pairs[0]);

      return {
        ...token,
        price: Number(bestPair.priceUsd) || token.price,
        change24h: Number(bestPair.priceChange?.h24) || token.change24h,
      };
    });

    // Dynamically calculate CHAD price relative to SOL
    const solPair = updated.find((t) => t.symbol === 'SOL');
    const currentSolPrice = solPair ? solPair.price : SOL_PRICE;
    
    return updated.map((token) => {
      if (token.symbol === 'CHAD') {
        return {
          ...token,
          price: Number((currentSolPrice * 0.0003).toFixed(5)),
        };
      }
      return token;
    });
  } catch (error) {
    console.error('Error fetching DexScreener prices:', error);
    return currentTokens;
  }
}

/**
 * Fetch real-time quote outputs from the public Jupiter Swap Aggregator API
 */
export async function fetchJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: number, // in integer atom units
  slippageBps = 100 // default 1% slippage
): Promise<{ outAmount: number; priceImpactPct: number; feeSol: number } | null> {
  // If either is CHAD, return a simulated quote since CHAD is mock
  if (inputMint.startsWith('CHAD') || outputMint.startsWith('CHAD')) {
    return null;
  }

  try {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Jupiter Quote API returned error status');
    const data = await res.json();

    if (!data.outAmount) return null;

    return {
      outAmount: Number(data.outAmount),
      priceImpactPct: Number(data.priceImpactPct || 0),
      feeSol: 0.000005, // standard gas fee representation
    };
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    return null;
  }
}

/**
 * Fetch actual signature transaction history on Solana for a token address
 */
export interface RealTxHistory {
  signature: string;
  slot: number;
  timeAgo: string;
  isBuy: boolean;
  amountSol: number;
}

interface SolanaTxSignature {
  signature: string;
  slot: number;
  blockTime: number | null;
}

export async function fetchOnChainSignatures(
  mintAddress: string,
  limit = 8
): Promise<RealTxHistory[]> {
  // Use public Solana mainnet RPC url or local env RPC url
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || PUBLIC_RPC_URL;
  
  // SOL token mint represents Solana native account, query standard system account
  const addressToQuery = mintAddress === 'So11111111111111111111111111111111111111112' 
    ? 'Vote111111111111111111111111111111111111111' // query public validator system for SOL live transactions
    : mintAddress === 'CHADxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    ? 'So11111111111111111111111111111111111111112' // fallback to SOL for mock token
    : mintAddress;

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [
          addressToQuery,
          { limit }
        ]
      })
    });

    if (!response.ok) throw new Error('RPC signature fetch failed');
    const result = await response.json();

    if (!result.result || !Array.isArray(result.result)) return [];

    const now = Math.floor(Date.now() / 1000);

    return (result.result as SolanaTxSignature[]).map((tx) => {
      const elapsed = tx.blockTime ? now - tx.blockTime : 10;
      let timeAgo = 'Just now';
      if (elapsed > 59) {
        const mins = Math.floor(elapsed / 60);
        timeAgo = mins === 1 ? '1m ago' : `${mins}m ago`;
      } else if (elapsed > 0) {
        timeAgo = `${elapsed}s ago`;
      }

      // Simulate a realistic trade amount and type based on on-chain hash details
      // (This avoids querying getTransaction which gets heavily rate limited on public RPC nodes)
      const isBuy = tx.slot % 2 === 0;
      const lastDigit = parseInt(tx.signature.slice(-1), 36) || 0;
      const amountSol = Number((0.15 + (lastDigit % 10) * 0.45).toFixed(2));

      return {
        signature: tx.signature,
        slot: tx.slot,
        timeAgo,
        isBuy,
        amountSol,
      };
    });
  } catch (error) {
    console.error('Error fetching on-chain signatures:', error);
    return [];
  }
}
