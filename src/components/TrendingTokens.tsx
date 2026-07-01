"use client";

import React, { useState, useRef } from "react";
import { Star, Coins, BarChart3, Bell, ArrowLeftRight, Columns, LayoutGrid, CheckCircle2, X, User, SlidersHorizontal, Volume2 } from "lucide-react";
import { TTokenDetails } from "@/utils/solanaApi";
import Image from "next/image";

const mockAlerts = [
  {
    id: "alert-1",
    type: "sell" as const,
    traderCount: 20,
    usdValue: "$46.8K",
    timeStr: "2h",
    tokenName: "TESTIBULL",
    tokenPrice: "$2.8M",
    tokenLogo: "https://cdn.dexscreener.com/cms/images/bf05934beb55942758e6a85cfd2800dc8170b799eec87da9611c769f8ff81b57?width=800&height=800&quality=95&format=auto"
  },
  {
    id: "alert-2",
    type: "buy" as const,
    traderCount: 40,
    usdValue: "$104.4K",
    timeStr: "2h",
    tokenName: "TESTIBULL",
    tokenPrice: "$2.3M",
    tokenLogo: "https://cdn.dexscreener.com/cms/images/bf05934beb55942758e6a85cfd2800dc8170b799eec87da9611c769f8ff81b57?width=800&height=800&quality=95&format=auto"
  },
  {
    id: "alert-3",
    type: "buy" as const,
    traderCount: 20,
    usdValue: "$42.8K",
    timeStr: "2h",
    tokenName: "TESTIBULL",
    tokenPrice: "$1.3M",
    tokenLogo: "https://cdn.dexscreener.com/cms/images/bf05934beb55942758e6a85cfd2800dc8170b799eec87da9611c769f8ff81b57?width=800&height=800&quality=95&format=auto"
  },
  {
    id: "alert-4",
    type: "sell" as const,
    traderCount: 20,
    usdValue: "$75.8K",
    timeStr: "2h",
    tokenName: "ANSEM",
    tokenPrice: "$135.3M",
    tokenLogo: "https://cdn.dexscreener.com/cms/images/A8aHRXC8VPrpfPIF?width=800&height=800&quality=95&format=auto"
  }
];

export default function TrendingTokens({
  tokens,
  selectedToken,
  onSelectToken,
  activeTab,
  setActiveTab,
  showClose = false,
  onClose,
  showSplitBottom = true,
  onSplitBottom,
  showSplitRight = true,
  onSplitRight
}: TTrendingTokensProps) {
  const [localActiveTab, setLocalActiveTab] = useState<string>("tokens");
  const [activeSubTab, setActiveSubTab] = useState<TSubTab>("most_held");

  const getDisplayTokens = () => {
    switch (activeSubTab) {
      case "watchlist":
        return [];
      case "crypto":
        return tokens.filter((t) => t.symbol === "SOL" || t.symbol === "GRASS");
      case "trending":
        return [...tokens].sort((a, b) => b.change24h - a.change24h);
      case "most_held":
        return [...tokens].sort((a, b) => (b.holders || 0) - (a.holders || 0));
      case "graduated":
        return tokens.filter(
          (t) =>
            t.symbol === "jailstool" ||
            t.symbol === "ANSEM" ||
            t.symbol === "UwU" ||
            (t.marketCap !== undefined && t.marketCap > 5000000)
        );
      default:
        return tokens;
    }
  };

  const displayTokens = getDisplayTokens();

  // Rich Hover Tooltip State
  const [hoveredToken, setHoveredToken] = useState<TTokenDetails | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ top: number; left: number } | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTab = activeTab !== undefined ? activeTab : localActiveTab;
  const changeTab = setActiveTab !== undefined ? setActiveTab : setLocalActiveTab;

  // Format market cap helper
  const formatMarketCap = (mcap?: number) => {
    if (!mcap) return "$0 MC";
    if (mcap >= 1e9) return `$${(mcap / 1e9).toFixed(1)}B MC`;
    if (mcap >= 1e6) return `$${(mcap / 1e6).toFixed(1)}M MC`;
    if (mcap >= 1e3) return `$${(mcap / 1e3).toFixed(1)}K MC`;
    return `$${mcap.toFixed(0)} MC`;
  };

  // Format price helper
  const formatPrice = (price: number) => {
    if (price === 0) return "$0.00";
    if (price < 0.00001) {
      const str = price.toFixed(10);
      const match = str.match(/\.0+/);
      const leadingZerosCount = match ? match[0].length - 1 : 0;
      if (leadingZerosCount >= 4) {
        const remaining = price * Math.pow(10, leadingZerosCount + 1);
        return `$0.0_${leadingZerosCount}${remaining.toFixed(0)}`;
      }
    }
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: price < 0.01 ? 6 : 2,
      maximumFractionDigits: price < 0.01 ? 6 : 3,
    })}`;
  };

  // Tooltip helper formatters
  const formatTooltipVolume = (vol?: number) => {
    if (!vol) return "$0";
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(0)}M`;
    if (vol >= 1e3) return `$${(vol / 1e3).toFixed(0)}K`;
    return `$${vol.toFixed(0)}`;
  };

  const formatTooltipHolders = (holders?: number) => {
    if (!holders) return "0";
    if (holders >= 1e3) return `${(holders / 1e3).toFixed(0)}K`;
    return holders.toLocaleString();
  };

  // Hover handlers to allow mouse over tooltip itself
  const handleMouseEnter = (e: React.MouseEvent, token: TTokenDetails) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredToken(token);
    setHoveredPosition({
      top: Math.max(10, Math.min(window.innerHeight - 200, rect.top - 20)),
      left: rect.right + 8
    });
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredToken(null);
      setHoveredPosition(null);
    }, 300);
  };

  const handleTooltipMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    setHoveredToken(null);
    setHoveredPosition(null);
  };

  const handleCopyContract = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#030712] overflow-hidden select-none font-mono">
      {/* Top Sidebar Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#161b26]/80 bg-[#0d0e12]/60 px-2 h-11 text-[11px] font-bold text-gray-500 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
          {/* Alerts Tab */}
          <button
            onClick={() => changeTab("alerts")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors relative cursor-pointer whitespace-nowrap ${
              currentTab === "alerts" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts
            <span className="absolute top-2 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          </button>

          {/* Tokens Tab */}
          <button
            onClick={() => changeTab("tokens")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === "tokens" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Tokens
          </button>

          {/* Leaderboard Tab */}
          <button
            onClick={() => changeTab("leaderboard")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === "leaderboard" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Leaderboard
          </button>

          {/* Feed Tab */}
          <button
            onClick={() => changeTab("feed")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === "feed" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Feed
          </button>
        </div>

        {/* Close Button / Collapse Indicator */}
        {showClose ? (
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-white cursor-pointer transition-colors ml-1"
            title="Close Split"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button className="p-1 text-gray-600 hover:text-gray-400 cursor-pointer text-xs font-mono font-bold shrink-0">
            &lt;&lt;
          </button>
        )}
      </div>

      {/* Pane Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {currentTab === "tokens" ? (
          <div className="flex flex-col h-full min-h-0">
            {/* Sub tabs / Filter Pills */}
            <div className="flex items-center gap-1 p-2 bg-[#030712] border-b border-[#161b26]/50 overflow-x-auto scrollbar-none text-[10px] font-bold text-gray-400 shrink-0">
              {(["watchlist", "crypto", "trending", "most_held", "graduated"] as TSubTab[]).map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setActiveSubTab(tabName)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap capitalize ${
                    activeSubTab === tabName ? "bg-[#1d2433] text-gray-200 border border-gray-700/50" : "hover:bg-[#161b26] hover:text-gray-300"
                  }`}
                >
                  {tabName.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Token List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#161b26]/30 animate-fade-in">
              {displayTokens.length > 0 ? (
                displayTokens.map((token) => {
                  const isSelected = token.mint === selectedToken.mint;
                  const isPositive = token.change24h >= 0;

                  return (
                    <div
                      key={token.mint}
                      onClick={() => onSelectToken(token)}
                      onMouseEnter={(e) => handleMouseEnter(e, token)}
                      onMouseLeave={handleMouseLeave}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors relative ${
                        isSelected ? "bg-[#161a24] border-l-2 border-[#0df294]" : "hover:bg-[#0d0e12]/80"
                      }`}
                    >
                      {/* Left: Token info */}
                      <div className="flex items-center gap-2 max-w-[60%]">
                        {token.logo ? (
                          <Image
                            src={token.logo}
                            alt={token.symbol}
                            width={32}
                            height={32}
                            unoptimized
                            className="w-8 h-8 rounded-full object-cover shrink-0 select-none"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                            {token.symbol.substring(0, 2)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-gray-200 truncate">{token.symbol}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-950 shrink-0" />
                          </div>
                          <span className="text-[10px] text-gray-500 block truncate font-mono">
                            {formatPrice(token.price)}
                          </span>
                        </div>
                      </div>

                      {/* Right: Market cap & Change */}
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-gray-300 font-mono">
                          {formatMarketCap(token.marketCap)}
                        </div>
                        <div
                          className={`text-[9px] font-bold font-mono mt-0.5 ${
                            isPositive ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {isPositive ? "▲" : "▼"} {Math.abs(token.change24h).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-[11px] text-gray-500 font-mono select-none">
                  <span>Your watchlist is empty</span>
                  <span className="text-[9px] text-gray-600 mt-1.5 font-bold">Star a token to add it here</span>
                </div>
              )}
            </div>
          </div>
        ) : currentTab === "alerts" ? (
          <div className="flex flex-col h-full overflow-hidden min-h-0 bg-[#030712]">
            {/* Header filters */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#030712] border-b border-[#161b26]/30 text-[10px] font-bold text-gray-500 shrink-0">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#161b26] bg-[#0d0e12] hover:text-gray-300 transition-colors cursor-pointer">
                  <User className="w-2.5 h-2.5 text-gray-500 mr-1 shrink-0" />
                  Traders
                </button>
                <button className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#161b26] bg-[#0d0e12] hover:text-gray-300 transition-colors cursor-pointer">
                  <SlidersHorizontal className="w-2.5 h-2.5 text-gray-500 mr-1 shrink-0" />
                  Filters
                </button>
              </div>
              <Volume2 className="w-3 h-3 text-gray-500 hover:text-gray-300 cursor-pointer shrink-0" />
            </div>

            {/* Scrollable list of alerts */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#161b26]/20 p-2 space-y-2">
              {mockAlerts.map((alert) => {
                // Find matching token details or build a fallback representation
                const alertToken = tokens.find(t => t.symbol.toUpperCase() === alert.tokenName.toUpperCase()) || {
                  symbol: alert.tokenName,
                  name: alert.tokenName,
                  price: 0.0019,
                  change24h: alert.type === "buy" ? 105.73 : -15.4,
                  mint: alert.tokenName === "TESTIBULL" ? "2kcdBw85q4qMVCjUkEynTnZ3bGBbeCqZRDRNLpeWpump" : "9cRCN9...TGpump",
                  decimals: 9,
                  logo: alert.tokenLogo || "",
                  marketCap: alert.tokenPrice.includes("M") ? parseFloat(alert.tokenPrice.replace("$", "").replace("M", "")) * 1e6 : 1800000,
                  volume24h: 1000000,
                  holders: 1000,
                  top10Holding: 27.33,
                  description: `Live transaction alerts for ${alert.tokenName}. Multi-trader transaction feed.`
                };

                return (
                  <div
                    key={alert.id}
                    onMouseEnter={(e) => handleMouseEnter(e, alertToken)}
                    onMouseLeave={handleMouseLeave}
                    className="py-2.5 px-2 flex flex-col gap-1.5 text-xs hover:bg-[#0d0e12]/60 cursor-pointer rounded transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${alert.type === "buy" ? "bg-[#0df294]" : "bg-rose-500"}`}></span>
                        <span className="font-bold text-gray-200">
                          {alert.traderCount} traders <span className={alert.type === "buy" ? "text-[#0df294]" : "text-rose-500"}>{alert.type === "buy" ? "Buy" : "Sell"}</span> {alert.usdValue}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-mono">{alert.timeStr}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pl-3.5">
                      {alert.tokenLogo ? (
                        <Image
                          src={alert.tokenLogo}
                          alt={alert.tokenName}
                          width={20}
                          height={20}
                          unoptimized
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-[8px] font-black text-white shrink-0">
                          {alert.tokenName.substring(0, 2)}
                        </div>
                      )}
                      <span className="text-[10px] text-gray-400 font-mono">
                        {alert.tokenName} at <span className="text-gray-300 font-bold">{alert.tokenPrice}</span> MC
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-600 font-mono">
            {currentTab === "leaderboard" && "Leaderboard calculations loading..."}
            {currentTab === "feed" && "No live feed updates yet."}
          </div>
        )}
      </div>

      {/* Sidebar bottom panel layout buttons */}
      {(showSplitBottom || showSplitRight) && (
        <div className="flex border-t border-[#161b26]/80 p-2 bg-[#0d0e12]/40 gap-2 h-11 shrink-0">
          {showSplitBottom && (
            <button
              onClick={onSplitBottom}
              className="flex-1 rounded border border-[#161b26] hover:border-gray-700 bg-[#0d0e12] text-gray-400 hover:text-gray-200 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-3 h-3" />
              Split bottom
            </button>
          )}
          {showSplitRight && (
            <button
              onClick={onSplitRight}
              className="flex-1 rounded border border-[#161b26] hover:border-gray-700 bg-[#0d0e12] text-gray-400 hover:text-gray-200 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Columns className="w-3 h-3" />
              Split right
            </button>
          )}
        </div>
      )}

      {/* Viewport Overlay Rich Hover Tooltip */}
      {hoveredToken && hoveredPosition && (
        <div
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          style={{
            position: "fixed",
            top: `${hoveredPosition.top}px`,
            left: `${hoveredPosition.left}px`,
            zIndex: 9999,
          }}
          className="w-[260px] bg-[#0c0d12] border border-[#1d2433] rounded-lg p-3.5 shadow-2xl shadow-black font-mono text-[11px] text-gray-400 select-none pointer-events-auto transition-opacity duration-150 animate-fade-in"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {hoveredToken.logo ? (
                <Image
                  src={hoveredToken.logo}
                  alt={hoveredToken.symbol}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {hoveredToken.symbol.substring(0, 2)}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-200 text-xs">{hoveredToken.symbol}</span>
                  <span className="text-[8px] px-1 rounded bg-gray-900 border border-gray-800 text-gray-500 shrink-0 scale-90 origin-left">SOL</span>
                </div>
                <span className="text-[9px] text-gray-500 block truncate max-w-[80px]">{hoveredToken.name || hoveredToken.symbol}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-right shrink-0">
                <div className="font-bold text-gray-200 text-xs">{formatMarketCap(hoveredToken.marketCap)}</div>
                <div className={`text-[9px] font-bold mt-0.5 ${hoveredToken.change24h >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {hoveredToken.change24h >= 0 ? "▲" : "▼"} {Math.abs(hoveredToken.change24h).toFixed(2)}%
                </div>
              </div>
              <button className="text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer shrink-0">
                <Star className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-[#1d2433] my-2"></div>

          {/* Key Statistics */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Volume 24hr</span>
              <span className="text-gray-200 font-bold">{formatTooltipVolume(hoveredToken.volume24h || (hoveredToken.marketCap ? hoveredToken.marketCap * 0.45 : 45000))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Holders</span>
              <span className="text-gray-200 font-bold">{formatTooltipHolders(hoveredToken.holders || (hoveredToken.marketCap ? Math.floor(Math.sqrt(hoveredToken.marketCap) * 12) : 950))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Top 10 holding</span>
              <span className="text-gray-200 font-bold">{(hoveredToken.top10Holding || 27.33).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Contract</span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="text-gray-400 select-all">{hoveredToken.mint ? `${hoveredToken.mint.substring(0, 6)}...${hoveredToken.mint.slice(-6)}` : "N/A"}</span>
                {hoveredToken.mint && (
                  copiedAddress === hoveredToken.mint ? (
                    <CheckCircle2 className="w-3 h-3 text-[#0df294]" />
                  ) : (
                    <button 
                      onClick={() => handleCopyContract(hoveredToken.mint)}
                      className="p-0.5 hover:text-white text-gray-500 transition-colors cursor-pointer shrink-0"
                      title="Copy Contract Address"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TTrendingTokensProps = {
  tokens: TTokenDetails[];
  selectedToken: TTokenDetails;
  onSelectToken: (token: TTokenDetails) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  showClose?: boolean;
  onClose?: () => void;
  showSplitBottom?: boolean;
  onSplitBottom?: () => void;
  showSplitRight?: boolean;
  onSplitRight?: () => void;
};

type TSubTab = "watchlist" | "crypto" | "trending" | "most_held" | "graduated";
