"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingBanner, { TokenTicker } from "@/components/RotatingBanner";
import TrendingTokens from "@/components/TrendingTokens";
import TokenChart from "@/components/TokenChart";
import ActivityFeed from "@/components/ActivityFeed";
import SwapWidget from "@/components/SwapWidget";
import Positions from "@/components/Positions";
import { fetchRealTokenPrices } from "@/utils/solanaApi";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import { Lock, Wallet, ArrowLeft } from "lucide-react";
import useResponsive from "@/hooks/useResponsive";
import { AppleAppLink, GooglePlayAppLink } from "@/components/MobileAppLinks";

// Constants matching our pre-defined tokens list
const TOKENS: TokenTicker[] = [
  {
    symbol: "SOL",
    name: "Solana",
    price: 142.45,
    change24h: 5.34,
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    logo: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    symbol: "CHAD",
    name: "ChadWallet Token",
    price: 0.0425,
    change24h: 15.42,
    mint: "CHADxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 9,
    logo: "/logos/dark.png",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    price: 0.00002134,
    change24h: -2.15,
    mint: "DezXAZ8z7PnrFcPykJzbO5JHcUqpHE8GDJEDgimOBBN",
    decimals: 5,
    logo: "https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg",
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    price: 2.12,
    change24h: 12.85,
    mint: "EKpQGSJtjMFqKZ9KQGWjzD4WCo4PDaf8dZVWudqwm1W7",
    decimals: 6,
    logo: "https://coin-images.coingecko.com/coins/images/33566/large/dogwifhat.jpg",
  },
  {
    symbol: "POPCAT",
    name: "Popcat",
    price: 0.824,
    change24h: -4.32,
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    decimals: 6,
    logo: "https://coin-images.coingecko.com/coins/images/33760/large/image.jpg",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    price: 0.785,
    change24h: 1.45,
    mint: "JUPyiwrYd2CQCChjJUiKVtH7jEEJ22u2w7j6r2FmWZq",
    decimals: 6,
    logo: "https://coin-images.coingecko.com/coins/images/34188/large/jup.png",
  },
  {
    symbol: "MEW",
    name: "cat in a dogs world",
    price: 0.00412,
    change24h: 8.76,
    mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    decimals: 6,
    logo: "https://coin-images.coingecko.com/coins/images/36440/large/MEW.png",
  },
  {
    symbol: "BOME",
    name: "BOOK OF MEME",
    price: 0.00845,
    change24h: -0.84,
    mint: "ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82",
    decimals: 6,
    logo: "https://coin-images.coingecko.com/coins/images/36071/large/bome.png",
  },
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
  const solTokenItem = liveTokens.find((t) => t.symbol === "SOL");
  const SOL_PRICE = solTokenItem ? solTokenItem.price : 142.45;

  // Active positions state
  const [positions, setPositions] = useState<PositionItem[]>([
    {
      token: TOKENS[1], // CHAD
      balance: 1000,
      entryPrice: 0.038,
      currentPrice: 0.0425,
    },
  ]);

  // Synergize URL parameter queries with selectedToken state
  useEffect(() => {
    const tokenQuery = searchParams.get("token");
    if (tokenQuery) {
      const match = liveTokens.find(
        (t) => t.symbol.toUpperCase() === tokenQuery.toUpperCase(),
      );
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
          const updatedSelected = updated.find(
            (t) => t.symbol === selectedToken.symbol,
          );
          if (
            updatedSelected &&
            updatedSelected.price !== selectedToken.price
          ) {
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
    action: "BUY" | "SELL",
    tradeToken: TokenTicker,
    amountToken: number,
    amountSol: number,
  ) => {
    const gasFee = 0.000005;

    if (action === "BUY") {
      // Deduct SOL
      setSolBalance((prev) => Math.max(0, prev - amountSol - gasFee));
      setTokenBalances((prev) => ({
        ...prev,
        SOL: Math.max(0, (prev.SOL || 0) - amountSol - gasFee),
        [tradeToken.symbol]: (prev[tradeToken.symbol] || 0) + amountToken,
      }));

      // Add or update open position
      setPositions((prev) => {
        const existIdx = prev.findIndex(
          (p) => p.token.symbol === tradeToken.symbol,
        );
        if (existIdx >= 0) {
          const exist = prev[existIdx];
          const newBalance = exist.balance + amountToken;
          // Calculate weighted average entry price
          const newEntryPrice =
            (exist.balance * exist.entryPrice +
              amountToken * tradeToken.price) /
            newBalance;
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
        [tradeToken.symbol]: Math.max(
          0,
          (prev[tradeToken.symbol] || 0) - amountToken,
        ),
      }));

      // Update positions
      setPositions((prev) => {
        const existIdx = prev.findIndex(
          (p) => p.token.symbol === tradeToken.symbol,
        );
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
    handleTradeExecution("SELL", closeToken, exist.balance, solValue);
  };

  return (
    <div className="flex-1 w-full min-h-0 mx-auto px-4 md:px-8 py-2 flex flex-col overflow-hidden">
      {/* Main trading columns dashboard */}
      <div className="flex justify-between w-full flex-1 min-h-0 items-stretch border-t border-dark-border/40">
        {/* Column 1: Left Pane - Token Lists (1/4 width) */}
        <div className="lg:col-span-1 w-1/5 h-full border-r border-dark-border/40 pr-4 pt-2 pb-4">
          <TrendingTokens
            tokens={liveTokens}
            selectedToken={selectedToken}
            onSelectToken={handleSelectToken}
          />
        </div>

        {/* Column 2 & 3: Middle Pane - Charts & Live Activity (2/4 width) */}
        <div className="lg:col-span-2 flex flex-col flex-1 min-h-0 px-4 pt-2 pb-4">
          <div className="flex-1 min-h-[350px] border-b border-dark-border/40 pb-4">
            <TokenChart token={selectedToken} />
          </div>
          <div className="h-[280px] pt-4">
            <ActivityFeed token={selectedToken} solPrice={SOL_PRICE} />
          </div>
        </div>

        {/* Column 4: Right Pane - Swap terminal & Positions (1/4 width) */}
        <div className="lg:col-span-1 w-1/5 flex flex-col min-h-0 border-l border-dark-border/40 pl-4 pt-2 pb-4">
          <div className="border-b border-dark-border/40 pb-4">
            <SwapWidget
              token={selectedToken}
              solBalance={solBalance}
              tokenBalance={tokenBalances[selectedToken.symbol] || 0}
              onTrade={handleTradeExecution}
              solPrice={SOL_PRICE}
            />
          </div>
          <div className="flex-1 min-h-0 pt-4">
            <Positions
              positions={positions}
              onClosePosition={handleClosePosition}
              solPrice={SOL_PRICE}
            />
          </div>
        </div>
      </div>
      {/* Top compact ticker banner */}
      <RotatingBanner reverse={false} />
    </div>
  );
}

export default function TradingPage() {
  const { authenticated, ready, login } = usePrivy();
  const router = useRouter();
  const wasAuthenticatedRef = useRef(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        wasAuthenticatedRef.current = true;
      } else if (wasAuthenticatedRef.current) {
        router.push("/");
      }
    }
  }, [ready, authenticated, router]);

  // If mobile, show desktop-only warning
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-dark-bg text-foreground">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-brand-cyan/20 blur-xl animate-pulse"></div>
            <div className="w-20 h-20 rounded-2xl bg-dark-panel border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shadow-lg shadow-brand-cyan/10 relative">
              <span className="text-3xl">💻</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-wider uppercase font-mono text-gradient mb-4">
            Desktop Only
          </h1>
          <p className="text-sm text-foreground/75 leading-relaxed mb-8">
            The ChadWallet Trading Terminal is only available on Desktop. Please
            switch to a desktop browser or download our mobile app.
          </p>

          <div className="bg-dark-panel border border-dark-border/80 rounded-2xl p-5 w-full flex flex-col items-center gap-4">
            <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">
              Get the Mobile App
            </p>
            <div className="flex flex-col gap-3 w-full">
              <AppleAppLink />
              <GooglePlayAppLink />
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-8 text-xs text-brand-green font-bold hover:underline flex items-center gap-2 cursor-pointer"
          >
            ← Back to Homepage
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // If not ready, show the loader
  if (!ready) {
    return (
      <div className="flex flex-col min-h-screen bg-dark-bg text-foreground">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-xs text-foreground/40 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin"></div>
          Loading ChadWallet Session...
        </div>
        <Footer />
      </div>
    );
  }

  // If not authenticated, render the beautiful error page
  if (!authenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-dark-bg text-foreground">
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          {/* Neon Glow Lock Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-brand-red/20 blur-xl animate-pulse"></div>
            <div className="w-20 h-20 rounded-2xl bg-dark-panel border border-brand-red/40 flex items-center justify-center text-brand-red shadow-lg shadow-brand-red/10 relative">
              <Lock className="w-9 h-9" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-wider uppercase font-mono text-gradient mb-3">
            Access Denied
          </h1>
          <p className="text-xs text-foreground/60 leading-relaxed mb-8">
            The trading terminal is a secured zone. You must connect your Solana
            embedded wallet via Privy to view order books, live charts, and
            execute swaps.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={login}
              className="inline-flex items-center justify-center border border-brand-green/35 rounded-xl  gap-2 px-6 py-3 rounded-x text-white font-bold text-lg hover:shadow-lg hover:shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-dark-panel hover:bg-dark-card border border-dark-border hover:border-foreground/20 text-foreground/80 hover:text-foreground text-lg font-semibold transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the trading screen
  return (
    <div className="flex flex-col h-screen bg-dark-bg text-foreground overflow-hidden">
      {/* Navigation Header */}
      <Header />

      {/* App router suspense wrapper to prevent static compilation issues with search params */}
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col h-screen items-center justify-center text-xs text-foreground/40 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin"></div>
            Loading Trading Panel...
          </div>
        }
      >
        <TradingContent />
      </Suspense>
    </div>
  );
}
