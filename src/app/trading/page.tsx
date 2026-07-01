"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import TradingHeader from "@/components/TradingHeader";
import TradingFooter from "@/components/TradingFooter";
import TrendingTokens from "@/components/TrendingTokens";
import TokenChart from "@/components/TokenChart";
import ActivityFeed from "@/components/ActivityFeed";
import SwapWidget from "@/components/SwapWidget";
import Positions from "@/components/Positions";
import {
  fetchTokenFullDetails,
  TTokenDetails,
  TDexPair,
} from "@/utils/solanaApi";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import { Lock, ArrowLeft, Gift, Check } from "lucide-react";
import useResponsive from "@/hooks/useResponsive";
import { AppleAppLink, GooglePlayAppLink } from "@/components/MobileAppLinks";

import defaultTokensJson from "@/data/defaultTokens.json";
import Image from "next/image";

const DEFAULT_TOKENS: TTokenDetails[] = defaultTokensJson as TTokenDetails[];

const topTraders = [
  {
    name: "Dip Wheeler",
    username: "@DipWheeler",
    avatar:
      "https://cdn.dexscreener.com/cms/images/bf05934beb55942758e6a85cfd2800dc8170b799eec87da9611c769f8ff81b57?width=800&height=800&quality=95&format=auto",
  },
  { name: "PoorGoat", username: "@PoorGoat_", avatar: "" },
  { name: "DumbCrayonEater", username: "@DumbCrayonEater", avatar: "" },
  { name: "Vee", username: "@theveeman", avatar: "" },
  { name: "RUNE", username: "@RuneCrypto_", avatar: "" },
  { name: "techquant", username: "@techquant", avatar: "" },
  { name: "BinkBinkBink", username: "@BinkBinkBink", avatar: "" },
  { name: "Zinc", username: "@zinceth", avatar: "" },
  { name: "needledger", username: "@needledger", avatar: "" },
  { name: "CJ", username: "@carljohnson", avatar: "" },
];

function TradingContent() {
  const router = useRouter();

  // Multi-column sidebar grid state
  const [sidebarColumns, setSidebarColumns] = useState<TSidebarColumn[]>([
    { id: "col-1", activeTabTop: "tokens", activeTabBottom: null },
  ]);

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleViewProfile = () => setShowProfile(true);
    window.addEventListener("viewprofile", handleViewProfile);
    return () => window.removeEventListener("viewprofile", handleViewProfile);
  }, []);

  // Active token selection state (lazy initialized to read URL parameters on first render)
  const [selectedToken, setSelectedToken] = useState<TTokenDetails>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenQuery = params.get("token");
      if (tokenQuery) {
        const match = DEFAULT_TOKENS.find(
          (t) =>
            t.symbol.toUpperCase() === tokenQuery.toUpperCase() ||
            t.mint === tokenQuery,
        );
        if (match) return match;
      }
    }
    return DEFAULT_TOKENS[0];
  });

  // Live-updating token values
  const [liveTokens, setLiveTokens] = useState<TTokenDetails[]>(DEFAULT_TOKENS);

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
  const [positions, setPositions] = useState<TPositionItem[]>([
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
    },
  ]);

  // Fetch custom token details asynchronously if not present in the default list on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tokenQuery = params.get("token");
      if (!tokenQuery) return;

      const match = liveTokens.find(
        (t) =>
          t.symbol.toUpperCase() === tokenQuery.toUpperCase() ||
          t.mint === tokenQuery,
      );

      if (!match) {
        fetchTokenFullDetails(tokenQuery).then((details) => {
          if (details) {
            setLiveTokens((prev) => {
              if (prev.some((t) => t.mint === details.mint)) return prev;
              return [...prev, details];
            });
            setSelectedToken(details);
          }
        });
      }
    }
  }, []);

  // Listen to custom history changes to avoid Next.js Router Suspense flickers
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const tokenQuery = params.get("token");
      if (!tokenQuery) return;

      const match = liveTokens.find(
        (t) =>
          t.symbol.toUpperCase() === tokenQuery.toUpperCase() ||
          t.mint === tokenQuery,
      );

      if (match) {
        if (selectedToken.mint !== match.mint) {
          setSelectedToken(match);
        }
      } else {
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
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("urlchange", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("urlchange", handleUrlChange);
    };
  }, [liveTokens, selectedToken.mint]);

  // Periodic polling for prices and full selected token details
  useEffect(() => {
    const updatePricesAndDetails = async () => {
      // 1. Fetch price updates for all static tokens in the list
      const basicMints = liveTokens
        .filter((t) => t.mint && !t.mint.includes("xxx"))
        .map((t) => t.mint);

      if (basicMints.length > 0) {
        try {
          const res = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${basicMints.join(",")}`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data.pairs && Array.isArray(data.pairs)) {
              setLiveTokens((prev) => {
                return prev.map((token) => {
                  const matchingPairs = (data.pairs as TDexPair[]).filter(
                    (p: TDexPair) =>
                      p.chainId === "solana" &&
                      p.baseToken.address === token.mint,
                  );
                  if (matchingPairs.length === 0) return token;

                  const bestPair = matchingPairs.reduce(
                    (best: TDexPair, curr: TDexPair) => {
                      return (curr.liquidity?.usd || 0) >
                        (best.liquidity?.usd || 0)
                        ? curr
                        : best;
                    },
                    matchingPairs[0],
                  );

                  return {
                    ...token,
                    price: Number(bestPair.priceUsd) || token.price,
                    change24h:
                      Number(bestPair.priceChange?.h24) || token.change24h,
                    marketCap:
                      bestPair.marketCap || bestPair.fdv || token.marketCap,
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
            prev.map((t) => (t.mint === details.mint ? details : t)),
          );
        }
      }
    };

    updatePricesAndDetails(); // initial trigger
    const interval = setInterval(updatePricesAndDetails, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, [selectedToken.mint]);

  const handleSelectToken = (token: TTokenDetails) => {
    setSelectedToken(token);
    setShowProfile(false);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/trading?token=${token.mint}`);
      window.dispatchEvent(new Event("urlchange"));
    }
  };

  // Execution handler for Buying/Selling swaps
  const handleTradeExecution = (
    action: "BUY" | "SELL",
    tradeToken: TTokenDetails,
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
  const handleClosePosition = (closeToken: TTokenDetails) => {
    const exist = positions.find((p) => p.token.mint === closeToken.mint);
    if (!exist) return;

    const solValue = (exist.balance * closeToken.price) / SOL_PRICE;
    handleTradeExecution("SELL", closeToken, exist.balance, solValue);
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-0 items-stretch bg-[#06070a] border-t border-[#161b26]/60">
      {/* Column 1: Left Pane - Sidebar Columns Grid */}
      <div className="h-full shrink-0 flex items-stretch">
        {sidebarColumns.map((col, index) => (
          <div
            key={col.id}
            className="w-[360px] h-full shrink-0 flex flex-col border-r border-[#161b26]/80 bg-[#06070a] min-h-0"
          >
            {/* Top Pane */}
            <div
              className={`${col.activeTabBottom ? "h-1/2" : "h-full"} flex flex-col min-h-0`}
            >
              <TrendingTokens
                tokens={liveTokens}
                selectedToken={selectedToken}
                onSelectToken={handleSelectToken}
                activeTab={col.activeTabTop}
                setActiveTab={(tab) => {
                  setSidebarColumns((prev) =>
                    prev.map((c) =>
                      c.id === col.id ? { ...c, activeTabTop: tab } : c,
                    ),
                  );
                }}
                showClose={sidebarColumns.length > 1}
                onClose={() => {
                  setSidebarColumns((prev) =>
                    prev.filter((c) => c.id !== col.id),
                  );
                }}
                showSplitBottom={col.activeTabBottom === null}
                onSplitBottom={() => {
                  setSidebarColumns((prev) =>
                    prev.map((c) =>
                      c.id === col.id ? { ...c, activeTabBottom: "alerts" } : c,
                    ),
                  );
                }}
                showSplitRight={
                  col.activeTabBottom === null && sidebarColumns.length < 2
                }
                onSplitRight={() => {
                  const newId = `col-${Date.now()}`;
                  setSidebarColumns((prev) => [
                    ...prev.slice(0, index + 1),
                    {
                      id: newId,
                      activeTabTop: "tokens",
                      activeTabBottom: null,
                    },
                    ...prev.slice(index + 1),
                  ]);
                }}
              />
            </div>

            {/* Bottom Pane */}
            {col.activeTabBottom && (
              <div className="h-1/2 border-t border-[#161b26]/80 flex flex-col min-h-0">
                <TrendingTokens
                  tokens={liveTokens}
                  selectedToken={selectedToken}
                  onSelectToken={handleSelectToken}
                  activeTab={col.activeTabBottom}
                  setActiveTab={(tab) => {
                    setSidebarColumns((prev) =>
                      prev.map((c) =>
                        c.id === col.id ? { ...c, activeTabBottom: tab } : c,
                      ),
                    );
                  }}
                  showClose={true}
                  onClose={() => {
                    setSidebarColumns((prev) =>
                      prev.map((c) =>
                        c.id === col.id ? { ...c, activeTabBottom: null } : c,
                      ),
                    );
                  }}
                  showSplitBottom={false}
                  showSplitRight={sidebarColumns.length < 2}
                  onSplitRight={() => {
                    const newId = `col-${Date.now()}`;
                    setSidebarColumns((prev) => [
                      ...prev.slice(0, index + 1),
                      {
                        id: newId,
                        activeTabTop: "tokens",
                        activeTabBottom: null,
                      },
                      ...prev.slice(index + 1),
                    ]);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Column 2: Middle Pane - Charts & Live Activity OR Profile View */}
      {showProfile ? (
        <div className="flex-1 h-full flex flex-col bg-[#06070a] overflow-y-auto p-4 gap-4 scrollbar-none font-mono text-gray-300 border-r border-[#161b26]/80 animate-fade-in">
          {/* Hero Banner Area */}
          <div className="relative rounded-lg bg-[#0d0e12] border border-[#1d2433] p-5 flex flex-col gap-8 select-none">
            {/* Banner Background mock */}
            <div className="h-24 w-full rounded bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-[#1d2433]/50 relative overflow-hidden">
              <button
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-gray-800 text-gray-400 hover:text-white cursor-pointer transition-colors"
                title="Edit banner"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Details Row */}
            <div className="flex justify-between items-end -mt-12 px-2">
              <div className="flex items-end gap-3.5">
                {/* Large Avatar */}
                <div className="w-16 h-16 rounded-full border-4 border-[#0c0d12] bg-blue-950 flex items-center justify-center relative shrink-0 shadow-lg">
                  <div className="w-9 h-9 rounded-full border border-blue-400/80 flex items-center justify-center text-lg font-black text-blue-300 select-none">
                    F
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border border-[#0c0d12] shadow">
                    <Check className="w-2.5 h-2.5 stroke-[4px]" />
                  </div>
                </div>

                {/* Name and Tags */}
                <div className="flex flex-col mb-1 leading-normal">
                  <span className="text-sm font-extrabold text-gray-200">
                    ChiefTestySlug
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    @ChiefTestySlug
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-1">
                <div className="text-right mr-3 leading-normal">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
                    <div>
                      <span className="text-gray-100 mr-1 text-sm font-extrabold">
                        0
                      </span>
                      <span className="text-gray-500 font-medium">
                        Following
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-100 mr-1 text-sm font-extrabold">
                        0
                      </span>
                      <span className="text-gray-500 font-medium">
                        Followers
                      </span>
                    </div>
                  </div>
                </div>

                <button className="px-3.5 py-1.5 rounded-md border border-[#1d2433] bg-[#0d0e12] hover:bg-[#161b26] text-gray-200 text-[10px] font-extrabold hover:text-white cursor-pointer transition-colors">
                  Edit profile
                </button>
                <button
                  className="p-2 rounded-md border border-[#1d2433] bg-[#0d0e12] hover:bg-[#161b26] text-gray-400 hover:text-white cursor-pointer transition-colors"
                  title="Referrals"
                >
                  <Gift className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Badges details */}
            <div className="flex items-center gap-5 text-[10px] text-gray-500 font-bold px-2 pt-2 border-t border-[#161b26]/50">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600">🕒</span>
                No hold time
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600">🔄</span>0 trades
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-600">📅</span>
                Joined Jun 2026
              </div>
            </div>
          </div>

          {/* Main Stats Grid Column layouts */}
          <div className="flex-1 grid grid-cols-5 gap-4 min-h-0">
            {/* Left Sub-column: Performance & Balances (Col-span 2) */}
            <div className="col-span-2 flex flex-col gap-4 min-h-0">
              {/* PnL Card */}
              <div className="rounded-lg bg-[#0d0e12] border border-[#1d2433] p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="leading-tight">
                    <span className="text-2xl font-black text-gray-150 font-mono">
                      $0.00
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold block mt-1">
                      +$0 24h
                    </span>
                  </div>
                  {/* Period pills */}
                  <div className="flex gap-1 text-[9px] font-bold text-gray-500 bg-black/40 rounded p-0.5 border border-[#161b26]/50">
                    {["24H", "7D", "30D", "ALL"].map((p) => (
                      <button
                        key={p}
                        className={`px-2 py-0.5 rounded transition-colors ${p === "24H" ? "bg-[#1d2433] text-gray-200 border border-gray-700/50" : "hover:text-gray-300"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Empty Chart performance mock */}
                <div className="h-28 w-full border border-[#161b26]/40 bg-black/25 rounded relative flex items-center justify-center overflow-hidden">
                  <div className="absolute left-0 right-0 h-0.5 bg-[#0df294]/80 shadow-[0_0_8px_#0df294]"></div>
                </div>

                {/* Cash balance row */}
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded border border-[#161b26]/50 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-gray-500">💰</span>
                    <div className="leading-tight flex flex-col">
                      <span className="text-[9px] text-gray-500 font-bold uppercase">
                        Cash balance
                      </span>
                      <span className="text-sm font-extrabold text-gray-200">
                        $0
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded border border-[#1d2433] bg-[#0d0e12] text-gray-400 hover:text-gray-200 text-[10px] font-extrabold cursor-pointer">
                      Withdraw
                    </button>
                    <button className="px-3 py-1.5 rounded bg-[#2563eb] hover:bg-blue-600 text-white text-[10px] font-extrabold cursor-pointer">
                      Deposit
                    </button>
                  </div>
                </div>
              </div>

              {/* Positions Card */}
              <div className="rounded-lg bg-[#0d0e12] border border-[#1d2433] p-4 flex flex-col gap-3 flex-1 min-h-0">
                <div className="flex justify-between items-center pb-2 border-b border-[#161b26]/50">
                  <span className="text-[11px] font-black text-gray-200 uppercase tracking-wider">
                    Your positions
                  </span>
                  <div className="flex gap-1 text-[9px] font-bold text-gray-500 bg-black/40 rounded p-0.5 border border-[#161b26]/50">
                    {["Recent", "Open", "Closed"].map((p) => (
                      <button
                        key={p}
                        className={`px-2 py-0.5 rounded transition-colors ${p === "Closed" ? "bg-[#1d2433] text-gray-200 border border-gray-700/50" : "hover:text-gray-300"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-[10px] text-gray-600 italic">
                  No closed positions
                </div>
              </div>
            </div>

            {/* Right Sub-column: Trades/Swaps List (Col-span 3) */}
            <div className="col-span-3 rounded-lg bg-[#0d0e12] border border-[#1d2433] p-4 flex flex-col gap-3 min-h-0">
              <div className="flex items-center gap-4 pb-2 border-b border-[#161b26]/50 text-[10px] font-bold text-gray-500">
                {["All swaps", "Buys", "Sells"].map((t) => (
                  <button
                    key={t}
                    className={`pb-1 transition-colors relative ${t === "All swaps" ? "text-white border-b border-white font-black" : "hover:text-gray-300"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Swaps Table Headers */}
              <div className="grid grid-cols-5 text-[9px] font-bold text-gray-500 px-2 py-1 bg-black/20 rounded border border-[#161b26]/40 uppercase tracking-wider">
                <span>Token</span>
                <span>Action</span>
                <span>Amount</span>
                <span>MCap</span>
                <span className="text-right">Time</span>
              </div>

              {/* Table Body Empty representation */}
              <div className="flex-1 flex items-center justify-center text-[10px] text-gray-600 italic">
                No trades yet
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 h-full flex flex-col border-r border-[#161b26]/80 overflow-hidden min-w-0">
          <div className="flex-1 min-h-0">
            <TokenChart token={selectedToken} />
          </div>
          <div className="h-[320px] shrink-0 border-t border-[#161b26]/80">
            <ActivityFeed token={selectedToken} solPrice={SOL_PRICE} />
          </div>
        </div>
      )}

      {/* Column 3: Right Pane - Swap terminal OR Follow top traders */}
      {showProfile ? (
        <div className="w-[360px] h-full shrink-0 flex flex-col bg-[#06070a] p-4 gap-4 scrollbar-none font-mono border-l border-[#161b26]/80 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#161b26]/80">
            <div className="flex items-center gap-2">
              <span className="text-sm">👤</span>
              <span className="text-xs font-black text-gray-200 uppercase tracking-wider">
                Follow top traders
              </span>
            </div>
          </div>

          {/* Traders List */}
          <div className="flex-1 flex flex-col divide-y divide-[#161b26]/20">
            {topTraders.map((trader) => (
              <div
                key={trader.username}
                className="flex items-center justify-between py-3"
              >
                {/* Left: Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0">
                  {trader.avatar ? (
                    <Image
                      src={trader.avatar}
                      alt={trader.name}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 rounded-full object-cover shrink-0 select-none"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                      {trader.name.substring(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 leading-tight">
                    <span className="text-xs font-bold text-gray-200 block truncate">
                      {trader.name}
                    </span>
                    <span className="text-[9px] text-gray-500 block truncate">
                      {trader.username}
                    </span>
                  </div>
                </div>

                {/* Right: Follow Button */}
                <button className="px-3.5 py-1 rounded bg-[#2563eb] hover:bg-blue-600 text-white text-[10px] font-extrabold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-[360px] h-full shrink-0 flex flex-col border-l border-[#161b26]/80 overflow-y-auto bg-[#06070a] p-3 gap-3 scrollbar-none">
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
      )}
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
            The fomo.family trading terminal is optimized for desktop trading
            layouts. Please switch to a desktop browser or download our mobile
            app.
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

  return (
    <div className="flex flex-col h-screen bg-[#06070a] text-foreground overflow-hidden font-mono">
      {/* Navigation Header specifically for trading - stays mounted across all ready/auth states */}
      <TradingHeader />

      {/* Main Container - transitions content inside without unmounting root header/footer */}
      <div className="flex-1 min-h-0 w-full flex flex-col">
        {!ready ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[11px] text-gray-500 gap-3 bg-[#06070a]">
            <div className="w-6 h-6 rounded-full border-2 border-[#0df294] border-t-transparent animate-spin"></div>
            Loading session...
          </div>
        ) : !authenticated ? (
          <div className="flex-1 flex items-center justify-center bg-[#06070a]">
            <div className="w-full max-w-md p-6 text-center">
              {/* Neon Glow Lock Icon */}
              <div className="relative flex justify-center mb-6">
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
        ) : (
          <TradingContent />
        )}
      </div>

      {/* Bottom status bar specifically for trading - stays mounted */}
      <TradingFooter />
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TPositionItem = {
  token: TTokenDetails;
  balance: number;
  entryPrice: number;
  currentPrice: number;
};

type TSidebarColumn = {
  id: string;
  activeTabTop: string;
  activeTabBottom: string | null;
};
