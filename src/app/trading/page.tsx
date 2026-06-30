"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TradingHeader from "@/components/TradingHeader";
import TradingFooter from "@/components/TradingFooter";
import TrendingTokens from "@/components/TrendingTokens";
import TokenChart from "@/components/TokenChart";
import ActivityFeed from "@/components/ActivityFeed";
import SwapWidget from "@/components/SwapWidget";
import Positions from "@/components/Positions";
import { fetchTokenFullDetails, TokenDetails } from "@/utils/solanaApi";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import { Lock, ArrowLeft } from "lucide-react";
import useResponsive from "@/hooks/useResponsive";
import { AppleAppLink, GooglePlayAppLink } from "@/components/MobileAppLinks";

import defaultTokensJson from "@/data/defaultTokens.json";

const DEFAULT_TOKENS: TokenDetails[] = defaultTokensJson as TokenDetails[];

interface PositionItem {
  token: TokenDetails;
  balance: number;
  entryPrice: number;
  currentPrice: number;
}

function TradingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active token selection state
  const [selectedToken, setSelectedToken] = useState<TokenDetails>(DEFAULT_TOKENS[0]);

  // Live-updating token values
  const [liveTokens, setLiveTokens] = useState<TokenDetails[]>(DEFAULT_TOKENS);

  // Starting mock user balances: 5.5 SOL and 1000 CHAD to demo features instantly
  const [solBalance, setSolBalance] = useState(5.5);
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({
    SOL: 5.5,
    jailstool: 150000,
    ANSEM: 450,
  });

  // Calculate live SOL price dynamically from state
  const solTokenItem = liveTokens.find((t) => t.symbol === "SOL");
  const SOL_PRICE = solTokenItem ? solTokenItem.price : 74.28;

  // Active positions state
  const [positions, setPositions] = useState<PositionItem[]>([
    {
      token: DEFAULT_TOKENS[0], // jailstool
      balance: 150000,
      entryPrice: 0.001047,
      currentPrice: 0.001107,
    },
    {
      token: DEFAULT_TOKENS[1], // ANSEM
      balance: 450,
      entryPrice: 0.138,
      currentPrice: 0.141,
    }
  ]);

  // Synergize URL parameter queries with selectedToken state
  useEffect(() => {
    const tokenQuery = searchParams.get("token");
    if (!tokenQuery) return;

    // Check if we already have it in liveTokens
    const match = liveTokens.find(
      (t) => t.symbol.toUpperCase() === tokenQuery.toUpperCase() || t.mint === tokenQuery
    );

    if (match) {
      if (selectedToken.mint !== match.mint) {
        setSelectedToken(match);
      }
    } else {
      // Fetch details from DexScreener if it's a new token not in the default list
      let active = true;
      fetchTokenFullDetails(tokenQuery).then((details) => {
        if (!active || !details) return;
        setLiveTokens((prev) => {
          if (prev.some((t) => t.mint === details.mint)) return prev;
          return [...prev, details];
        });
        setSelectedToken(details);
      });
      return () => {
        active = false;
      };
    }
  }, [searchParams, liveTokens, selectedToken.mint]);

  // Periodic polling for prices and full selected token details
  useEffect(() => {
    const updatePricesAndDetails = async () => {
      // 1. Fetch price updates for all static tokens in the list
      const basicMints = liveTokens
        .filter((t) => t.mint && !t.mint.includes("xxx"))
        .map((t) => t.mint);

      if (basicMints.length > 0) {
        try {
          const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${basicMints.join(",")}`);
          if (res.ok) {
            const data = await res.json();
            if (data.pairs && Array.isArray(data.pairs)) {
              setLiveTokens((prev) => {
                return prev.map((token) => {
                  const matchingPairs = data.pairs.filter(
                    (p: any) => p.chainId === "solana" && p.baseToken.address === token.mint
                  );
                  if (matchingPairs.length === 0) return token;

                  const bestPair = matchingPairs.reduce((best: any, curr: any) => {
                    return (curr.liquidity?.usd || 0) > (best.liquidity?.usd || 0) ? curr : best;
                  }, matchingPairs[0]);

                  return {
                    ...token,
                    price: Number(bestPair.priceUsd) || token.price,
                    change24h: Number(bestPair.priceChange?.h24) || token.change24h,
                    marketCap: bestPair.marketCap || bestPair.fdv || token.marketCap,
                    volume24h: bestPair.volume?.h24 || token.volume24h,
                    liquidity: bestPair.liquidity?.usd || token.liquidity,
                  };
                });
              });
            }
          }
        } catch (err) {
          console.error("Error fetching live sidebar prices:", err);
        }
      }

      // 2. Fetch full details for the active selected token to keep progress bars fresh
      if (selectedToken.mint && !selectedToken.mint.includes("xxx")) {
        const details = await fetchTokenFullDetails(selectedToken.mint);
        if (details) {
          setSelectedToken(details);
          // Sync it in liveTokens list too
          setLiveTokens((prev) =>
            prev.map((t) => (t.mint === details.mint ? details : t))
          );
        }
      }
    };

    updatePricesAndDetails(); // initial trigger
    const interval = setInterval(updatePricesAndDetails, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [selectedToken.mint]);

  const handleSelectToken = (token: TokenDetails) => {
    setSelectedToken(token);
    router.push(`/trading?token=${token.mint}`);
  };

  // Execution handler for Buying/Selling swaps
  const handleTradeExecution = (
    action: "BUY" | "SELL",
    tradeToken: TokenDetails,
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
          (p) => p.token.mint === tradeToken.mint,
        );
        if (existIdx >= 0) {
          const exist = prev[existIdx];
          const newBalance = exist.balance + amountToken;
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
          (p) => p.token.mint === tradeToken.mint,
        );
        if (existIdx >= 0) {
          const exist = prev[existIdx];
          const newBalance = Math.max(0, exist.balance - amountToken);
          if (newBalance <= 0) {
            return prev.filter((p) => p.token.mint !== tradeToken.mint);
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
  const handleClosePosition = (closeToken: TokenDetails) => {
    const exist = positions.find((p) => p.token.mint === closeToken.mint);
    if (!exist) return;

    const solValue = (exist.balance * closeToken.price) / SOL_PRICE;
    handleTradeExecution("SELL", closeToken, exist.balance, solValue);
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-0 items-stretch bg-[#06070a] border-t border-[#161b26]/60">
      {/* Column 1: Left Pane - Token Lists (280px width) */}
      <div className="w-[280px] h-full shrink-0 flex flex-col">
        <TrendingTokens
          tokens={liveTokens}
          selectedToken={selectedToken}
          onSelectToken={handleSelectToken}
        />
      </div>

      {/* Column 2: Middle Pane - Charts & Live Activity (flex-1 width) */}
      <div className="flex-1 h-full flex flex-col border-r border-[#161b26]/80 overflow-hidden min-w-0">
        <div className="flex-1 min-h-0">
          <TokenChart token={selectedToken} />
        </div>
        <div className="h-[320px] shrink-0 border-t border-[#161b26]/80">
          <ActivityFeed token={selectedToken} solPrice={SOL_PRICE} />
        </div>
      </div>

      {/* Column 3: Right Pane - Swap terminal & Positions/About (320px width) */}
      <div className="w-[320px] h-full shrink-0 flex flex-col border-l border-[#161b26]/80 overflow-y-auto bg-[#06070a] p-3 gap-3 scrollbar-none">
        <SwapWidget
          token={selectedToken}
          solBalance={solBalance}
          tokenBalance={tokenBalances[selectedToken.symbol] || 0}
          onTrade={handleTradeExecution}
          solPrice={SOL_PRICE}
        />
        <Positions
          positions={positions}
          onClosePosition={handleClosePosition}
          solPrice={SOL_PRICE}
          selectedToken={selectedToken}
        />
      </div>
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
      <div className="flex flex-col min-h-screen bg-[#06070a] text-foreground font-mono">
        <TradingHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
            <div className="w-20 h-20 rounded bg-[#0d0e12] border border-[#1d2433] flex items-center justify-center text-cyan-450 shadow-lg shadow-cyan-500/10 relative">
              <span className="text-3xl">💻</span>
            </div>
          </div>

          <h1 className="text-xl font-extrabold tracking-wider uppercase mb-4 text-gray-200">
            Desktop Only
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed mb-8">
            The fomo.family trading terminal is optimized for desktop trading layouts. Please
            switch to a desktop browser or download our mobile app.
          </p>

          <div className="bg-[#0d0e12] border border-[#161b26] rounded p-5 w-full flex flex-col items-center gap-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Get the Mobile App
            </p>
            <div className="flex flex-col gap-3 w-full">
              <AppleAppLink />
              <GooglePlayAppLink />
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-8 text-xs text-[#0df294] font-bold hover:underline flex items-center gap-2 cursor-pointer"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  // If not ready, show the loader
  if (!ready) {
    return (
      <div className="flex flex-col min-h-screen bg-[#06070a] text-foreground font-mono">
        <TradingHeader />
        <div className="flex-1 flex flex-col items-center justify-center text-[11px] text-gray-500 gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-[#0df294] border-t-transparent animate-spin"></div>
          Loading session...
        </div>
      </div>
    );
  }

  // If not authenticated, render the access denied / login screen
  if (!authenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#06070a] text-foreground font-mono">
        <TradingHeader />

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          {/* Neon Glow Lock Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse"></div>
            <div className="w-20 h-20 rounded bg-[#0d0e12] border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10 relative">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-xl font-extrabold tracking-wider uppercase mb-3 text-gray-200">
            Access Denied
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed mb-8">
            The trading terminal is secure. You must connect your Solana
            embedded wallet via Privy to view order books, live charts, and
            execute trades.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={login}
              className="inline-flex items-center justify-center bg-[#0df294] text-black font-extrabold text-xs px-6 py-2.5 rounded shadow-lg hover:bg-[#0df294]/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#0d0e12] hover:bg-[#161b26] border border-[#161b26] hover:border-gray-700 text-gray-400 hover:text-gray-200 text-xs font-bold transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the trading screen
  return (
    <div className="flex flex-col h-screen bg-[#06070a] text-foreground overflow-hidden">
      {/* Navigation Header specifically for trading */}
      <TradingHeader />

      {/* App router suspense wrapper to prevent static compilation issues with search params */}
      <Suspense
        fallback={
          <div className="flex-1 flex flex-col h-screen items-center justify-center text-[11px] text-gray-500 gap-3 bg-[#06070a]">
            <div className="w-6 h-6 rounded-full border-2 border-[#0df294] border-t-transparent animate-spin"></div>
            Loading Trading Panel...
          </div>
        }
      >
        <TradingContent />
      </Suspense>

      {/* Bottom status bar specifically for trading */}
      <TradingFooter />
    </div>
  );
}
