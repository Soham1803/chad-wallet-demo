'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RotatingBanner, { TokenTicker } from '@/components/RotatingBanner';
import TrendingTokens from '@/components/TrendingTokens';
import TokenChart from '@/components/TokenChart';
import ActivityFeed from '@/components/ActivityFeed';
import SwapWidget from '@/components/SwapWidget';
import Positions from '@/components/Positions';
import { fetchRealTokenPrices } from '@/utils/solanaApi';

// Constants matching our pre-defined tokens list
const TOKENS: TokenTicker[] = [
  { symbol: 'SOL', name: 'Solana', price: 142.45, change24h: 5.34, mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'CHAD', name: 'ChadWallet Token', price: 0.0425, change24h: 15.42, mint: 'CHADxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', decimals: 9 },
  { symbol: 'BONK', name: 'Bonk', price: 0.00002134, change24h: -2.15, mint: 'DezXAZ8z7PnrFcPykJzbO5JHcUqpHE8GDJEDgimOBBN', decimals: 5 },
  { symbol: 'WIF', name: 'dogwifhat', price: 2.12, change24h: 12.85, mint: 'EKpQGSJtjMFqKZ9KQGWjzD4WCo4PDaf8dZVWudqwm1W7', decimals: 6 },
  { symbol: 'POPCAT', name: 'Popcat', price: 0.824, change24h: -4.32, mint: '7GCihJUkKEFW2MkyCcLrC2j221uJWo95bSdWfzcrd2K7', decimals: 6 },
  { symbol: 'JUP', name: 'Jupiter', price: 0.785, change24h: 1.45, mint: 'JUPyiwrYd2CQCChjJUiKVtH7jEEJ22u2w7j6r2FmWZq', decimals: 6 },
  { symbol: 'MEW', name: 'cat in a dogs world', price: 0.00412, change24h: 8.76, mint: 'MEW143a5742Cn6SZ8ssz7M5D1AL2ey3tA9G9G1N7R', decimals: 6 },
  { symbol: 'BOME', name: 'BOOK OF MEME', price: 0.00845, change24h: -0.84, mint: 'uk3wueUrw3u8Htxu4mGWiEwNeLJTfTvCnSfCcSCL67E', decimals: 6 },
];

interface PositionItem {
  token: TokenTicker;
  balance: number;
  entryPrice: number;
  currentPrice: number;
}

function TradingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Active token selection state
  const [selectedToken, setSelectedToken] = useState<TokenTicker>(TOKENS[0]);
  
  // Live-updating token values
  const [liveTokens, setLiveTokens] = useState<TokenTicker[]>(TOKENS);
  
  // Starting mock user balances: 5.5 SOL and 1000 CHAD to demo features instantly
  const [solBalance, setSolBalance] = useState(5.5);
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({
    SOL: 5.5,
    CHAD: 1000,
  });

  // Calculate live SOL price dynamically from state
  const solTokenItem = liveTokens.find((t) => t.symbol === 'SOL');
  const SOL_PRICE = solTokenItem ? solTokenItem.price : 142.45;

  // Active positions state
  const [positions, setPositions] = useState<PositionItem[]>([
    {
      token: TOKENS[1], // CHAD
      balance: 1000,
      entryPrice: 0.038,
      currentPrice: 0.0425,
    }
  ]);

  // Synergize URL parameter queries with selectedToken state
  useEffect(() => {
    const tokenQuery = searchParams.get('token');
    if (tokenQuery) {
      const match = liveTokens.find((t) => t.symbol.toUpperCase() === tokenQuery.toUpperCase());
      if (match && selectedToken.symbol !== match.symbol) {
        setTimeout(() => setSelectedToken(match), 0);
      }
    }
  }, [searchParams, liveTokens, selectedToken]);

  // Fetch real-time token prices and changes from DexScreener
  useEffect(() => {
    const updatePrices = async () => {
      setLiveTokens((prev) => {
        fetchRealTokenPrices(prev).then((updated) => {
          setLiveTokens(updated);
          // Sync selected token
          const updatedSelected = updated.find((t) => t.symbol === selectedToken.symbol);
          if (updatedSelected && updatedSelected.price !== selectedToken.price) {
            setSelectedToken(updatedSelected);
          }
        });
        return prev;
      });
    };

    updatePrices(); // Initial load
    const interval = setInterval(updatePrices, 15000); // Polling every 15s

    return () => clearInterval(interval);
  }, [selectedToken]);

  const handleSelectToken = (token: TokenTicker) => {
    setSelectedToken(token);
    router.push(`/trading?token=${token.symbol}`);
  };

  // Execution handler for Buying/Selling swaps
  const handleTradeExecution = (
    action: 'BUY' | 'SELL',
    tradeToken: TokenTicker,
    amountToken: number,
    amountSol: number
  ) => {
    const gasFee = 0.000005;

    if (action === 'BUY') {
      // Deduct SOL
      setSolBalance((prev) => Math.max(0, prev - amountSol - gasFee));
      setTokenBalances((prev) => ({
        ...prev,
        SOL: Math.max(0, (prev.SOL || 0) - amountSol - gasFee),
        [tradeToken.symbol]: (prev[tradeToken.symbol] || 0) + amountToken,
      }));

      // Add or update open position
      setPositions((prev) => {
        const existIdx = prev.findIndex((p) => p.token.symbol === tradeToken.symbol);
        if (existIdx >= 0) {
          const exist = prev[existIdx];
          const newBalance = exist.balance + amountToken;
          // Calculate weighted average entry price
          const newEntryPrice = (exist.balance * exist.entryPrice + amountToken * tradeToken.price) / newBalance;
          const updated = [...prev];
          updated[existIdx] = {
            ...exist,
            balance: newBalance,
            entryPrice: Number(newEntryPrice.toFixed(6)),
            currentPrice: tradeToken.price,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              token: tradeToken,
              balance: amountToken,
              entryPrice: tradeToken.price,
              currentPrice: tradeToken.price,
            },
          ];
        }
      });
    } else {
      // Sell token: Deduct token, Add SOL
      setSolBalance((prev) => prev + amountSol - gasFee);
      setTokenBalances((prev) => ({
        ...prev,
        SOL: (prev.SOL || 0) + amountSol - gasFee,
        [tradeToken.symbol]: Math.max(0, (prev[tradeToken.symbol] || 0) - amountToken),
      }));

      // Update positions
      setPositions((prev) => {
        const existIdx = prev.findIndex((p) => p.token.symbol === tradeToken.symbol);
        if (existIdx >= 0) {
          const exist = prev[existIdx];
          const newBalance = Math.max(0, exist.balance - amountToken);
          if (newBalance <= 0) {
            return prev.filter((p) => p.token.symbol !== tradeToken.symbol);
          } else {
            const updated = [...prev];
            updated[existIdx] = {
              ...exist,
              balance: newBalance,
              currentPrice: tradeToken.price,
            };
            return updated;
          }
        }
        return prev;
      });
    }
  };

  // Close position entirely
  const handleClosePosition = (closeToken: TokenTicker) => {
    const exist = positions.find((p) => p.token.symbol === closeToken.symbol);
    if (!exist) return;

    // Calculate equivalent SOL returned
    const solValue = (exist.balance * closeToken.price) / SOL_PRICE;
    
    // Process sell swap for the entire amount
    handleTradeExecution('SELL', closeToken, exist.balance, solValue);
  };

  return (
    <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-6 py-4 flex flex-col gap-4">
      {/* Top compact ticker banner */}
      <RotatingBanner reverse={false} />

      {/* Main trading columns dashboard */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        
        {/* Column 1: Left Pane - Token Lists (1/4 width) */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto">
          <TrendingTokens
            tokens={liveTokens}
            selectedToken={selectedToken}
            onSelectToken={handleSelectToken}
          />
        </div>

        {/* Column 2 & 3: Middle Pane - Charts & Live Activity (2/4 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 min-h-[350px]">
            <TokenChart token={selectedToken} />
          </div>
          <div className="h-[280px]">
            <ActivityFeed token={selectedToken} solPrice={SOL_PRICE} />
          </div>
        </div>

        {/* Column 4: Right Pane - Swap terminal & Positions (1/4 width) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <SwapWidget
            token={selectedToken}
            solBalance={solBalance}
            tokenBalance={tokenBalances[selectedToken.symbol] || 0}
            onTrade={handleTradeExecution}
            solPrice={SOL_PRICE}
          />
          <div className="flex-1">
            <Positions
              positions={positions}
              onClosePosition={handleClosePosition}
              solPrice={SOL_PRICE}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TradingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-foreground">
      {/* Navigation Header */}
      <Header />

      {/* App router suspense wrapper to prevent static compilation issues with search params */}
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col items-center justify-center text-xs text-foreground/40 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin"></div>
            Loading Trading Panel...
          </div>
        }
      >
        <TradingContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
