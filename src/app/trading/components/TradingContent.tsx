"use client";

import React, { useState, useEffect } from "react";
import TrendingTokens from "@/components/TrendingTokens";
import TokenChart from "@/components/TokenChart";
import ActivityFeed from "@/components/ActivityFeed";
import SwapWidget from "@/components/SwapWidget";
import Positions from "@/components/Positions";
import ProfileView from "./ProfileView";
import TopTradersSidebar from "./TopTradersSidebar";
import {
  fetchTokenFullDetails,
  TTokenDetails,
  TDexPair,
} from "@/utils/solanaApi";
import defaultTokensJson from "@/data/defaultTokens.json";

const DEFAULT_TOKENS: TTokenDetails[] = defaultTokensJson as TTokenDetails[];

export default function TradingContent() {
  // Multi-column sidebar grid state
  const [sidebarColumns, setSidebarColumns] = useState<TSidebarColumn[]>([
    { id: "col-1", activeTabTop: "tokens", activeTabBottom: null },
  ]);

  const [showProfile, setShowProfile] = useState(false);
  const [cashBalance, setCashBalance] = useState(0.00);

  useEffect(() => {
    const handleViewProfile = () => setShowProfile(true);
    window.addEventListener("viewprofile", handleViewProfile);
    return () => window.removeEventListener("viewprofile", handleViewProfile);
  }, []);

  useEffect(() => {
    const syncCashBalance = () => {
      if (typeof window !== "undefined") {
        const val = sessionStorage.getItem("cash_balance");
        setCashBalance(val ? parseFloat(val) : 0.00);
      }
    };
    syncCashBalance();
    window.addEventListener("cashbalancechange", syncCashBalance);
    return () => window.removeEventListener("cashbalancechange", syncCashBalance);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <ProfileView cashBalance={cashBalance} />
      ) : (
        <div className="flex-1 h-full flex flex-col border-r border-[#161b26]/80 overflow-hidden min-w-0">
          <div className="flex-1 min-h-0">
            <TokenChart token={selectedToken} />
          </div>
          <div className="h-[250px] shrink-0 border-t border-[#161b26]/80">
            <ActivityFeed token={selectedToken} solPrice={SOL_PRICE} />
          </div>
        </div>
      )}

      {/* Column 3: Right Pane - Swap terminal OR Follow top traders */}
      {showProfile ? (
        <TopTradersSidebar />
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
