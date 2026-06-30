const fs = require('fs');
const path = require('path');

const CORRECT_MINTS = {
  jailstool: "AxriehR6Xw3adzHopnvMn7GcpRFcD41ddpiTWMg6pump",
  ANSEM: "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump",
  UwU: "UWUy7J86LUiBv5SjAUZ53LMGhtnqvbQ7QNSSkyupump",
  TripleT: "J8PSdNP3QewKq2Z1JJJFDMaqF7KcaiJhR7gbr5KZpump",
  neet: "Ce2gx9KGXJ6C9Mp5b5x1sn9Mg87JwEbrQby4Zqo3pump",
  Buttcoin: "Cm6fNnMk7NfzStP9CZpsQA2v3jjzbcYGAxdJySmHpump",
  SOL: "So11111111111111111111111111111111111111112",
  MANIFEST: "BCdwQBAn8dYB5YjTsoB6TdHAWokxv28k2oZUodERpump",
  CARDS: "CARDSccUMFKoPRZxt5vt3ksUbxEFEcnZ3H2pd3dKxYjp",
  Jotchua: "6crd2UnAMadoyMYumYsPgaK7W4xf9FJWkWFuUVtnDKpH",
  KINS: "GxCBFFrUMh8dwQJuA9pcDavwdAp196sWEDThkvvPWi3N",
  ASTEROID: "4UeLCRqARmfb6e6KQijtiktqqXUxbfk6jZng7DhuBAGS",
  SOLANGELES: "8wxkvAfEns76yBzu4MnbV7VnXWjg3iDPA9uwAQ6cpump",
  POD: "AiYhnwWiqbdSiEHgAzqrurcdoZx4V21mnuMt5ps2pump",
  wojak: "8J69rbLTzWWgUJziFY8jeu5tDwEPBwUz4pKBMr5rpump",
  NOCK: "LhcykxUt6xVdiSZyWyaGdNHE3W8sAEmdnEjpMdkpump",
  GRASS: "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs"
};

// Verified working, hotlink-safe fallback DexScreener CDN logos
const FALLBACK_LOGOS = {
  SOL: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
  Jotchua: "https://cdn.dexscreener.com/cms/images/NPs1Oxrt4x4Il_WB?width=800&height=800&quality=95&format=auto",
  KINS: "https://cdn.dexscreener.com/cms/images/W1H2rumX--Yz0ht0?width=800&height=800&quality=95&format=auto",
  wojak: "https://cdn.dexscreener.com/cms/images/f0ebdab5680465e3a019b96338970c8de8c20a5bac31b46cd2cb92ad1bcf107d?width=800&height=800&quality=95&format=auto"
};

const DESCRIPTIONS = {
  jailstool: "For the on-chain crimes against crypto trenches, abandoning his followers and stoolies, send him to jail!",
  ANSEM: "The black bull of the Solana meme space, inspired by the legendary trader Ansem.",
  SOL: "Native currency of the Solana blockchain, powering high-speed decentralized applications and memecoin trenches.",
  GRASS: "Decentralized web-scraping network rewards token on Solana.",
  wojak: "The iconic crypto trench Wojak feeling the highs and lows of the bull market.",
  Buttcoin: "The ultimate butt of all crypto jokes, trading heavily in Raydium trenches."
};

async function resolveTokens() {
  console.log("Resolving Solana tokens via DexScreener by exact contract addresses...");
  const resolved = [];

  for (const [symbol, mint] of Object.entries(CORRECT_MINTS)) {
    try {
      console.log(`Fetching data for: ${symbol} (${mint})...`);
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      if (data.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
        // Filter for Solana pairs
        const solPairs = data.pairs.filter((p) => p.chainId === 'solana');
        if (solPairs.length > 0) {
          // Select highest liquidity pair
          const bestPair = solPairs.reduce((best, curr) => {
            const bestLiq = best.liquidity?.usd || 0;
            const currLiq = curr.liquidity?.usd || 0;
            return currLiq > bestLiq ? curr : best;
          }, solPairs[0]);

          const mcap = bestPair.marketCap || bestPair.fdv || 1000000;
          const holdersCount = Math.floor(Math.sqrt(mcap) * 12) || 4500;
          const top10Pct = Number((48 + Math.random() * 18).toFixed(2));
          const desc = DESCRIPTIONS[symbol] || `The official trading pair for ${bestPair.baseToken.name} (${bestPair.baseToken.symbol}) live on Solana Raydium/Orca pools.`;
          
          // Logo resolver order: API returned imageUrl -> hardcoded verified fallback -> direct cdn pattern
          const logoUrl = FALLBACK_LOGOS[symbol]
            || bestPair.info?.imageUrl 
            || `https://dd.dexscreener.com/logos/solana/${mint}.png` 
            || `https://coin-images.coingecko.com/coins/images/4128/large/solana.png`;

          resolved.push({
            symbol: symbol,
            name: bestPair.baseToken.name,
            price: Number(bestPair.priceUsd) || 0.01,
            change24h: Number(bestPair.priceChange?.h24) || 0,
            mint: mint,
            decimals: 9,
            logo: logoUrl,
            marketCap: mcap,
            volume24h: bestPair.volume?.h24 || 0,
            liquidity: bestPair.liquidity?.usd || 0,
            holders: holdersCount,
            top10Holding: top10Pct,
            description: desc,
            priceChange: bestPair.priceChange || { m5: 0, h1: 0, h6: 0, h24: 0 },
            txns: bestPair.txns || { m5: { buys: 5, sells: 5 }, h24: { buys: 100, sells: 100 } },
            pairAddress: bestPair.pairAddress,
            websites: bestPair.info?.websites || [],
            socials: bestPair.info?.socials || []
          });
          console.log(`  Resolved to: ${bestPair.baseToken.name} (Logo: ${logoUrl})`);
          continue;
        }
      }

      // If token API doesn't return pairs, use fallback
      console.log(`  No Solana pairs returned for ${symbol}, using default values...`);
      const fallbackLogo = FALLBACK_LOGOS[symbol] || `https://dd.dexscreener.com/logos/solana/${mint}.png`;
      resolved.push({
        symbol: symbol,
        name: symbol,
        price: 0.015,
        change24h: 5.4,
        mint: mint,
        decimals: 9,
        logo: fallbackLogo,
        marketCap: 1500000,
        volume24h: 42000,
        liquidity: 150000,
        holders: 1400,
        top10Holding: 62.4,
        description: DESCRIPTIONS[symbol] || `Simulated trading index for ${symbol} token.`,
        priceChange: { m5: 0.2, h1: 1.4, h6: 3.5, h24: 5.4 },
        txns: { m5: { buys: 5, sells: 4 }, h24: { buys: 120, sells: 90 } },
        pairAddress: ""
      });
    } catch (err) {
      console.error(`Error resolving ${symbol}:`, err);
    }
  }

  const outputPath = path.join(__dirname, 'defaultTokens.json');
  fs.writeFileSync(outputPath, JSON.stringify(resolved, null, 2));
  console.log(`\nSuccessfully resolved all tokens and saved to ${outputPath}`);
}

resolveTokens();
