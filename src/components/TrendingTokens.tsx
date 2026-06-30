"use client";

import React, { useState } from "react";
import { Flame, Star, Coins, BarChart3, Bell, ArrowLeftRight, Columns, LayoutGrid, CheckCircle2 } from "lucide-react";
import { TokenDetails } from "@/utils/solanaApi";
import Image from "next/image";

interface TrendingTokensProps {
  tokens: TokenDetails[];
  selectedToken: TokenDetails;
  onSelectToken: (token: TokenDetails) => void;
}

type MainTab = "alerts" | "tokens" | "leaderboard" | "feed";
type SubTab = "watchlist" | "crypto" | "trending" | "most_held" | "graduated";

export default function TrendingTokens({
  tokens,
  selectedToken,
  onSelectToken,
}: TrendingTokensProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("tokens");
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("most_held");

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
      // Find number of leading zeros after decimal point
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

  return (
    <div className="flex flex-col h-full bg-[#06070a] border-r border-[#161b26]/80 overflow-hidden select-none font-mono">
      {/* Top Sidebar Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#161b26]/80 bg-[#0d0e12]/60 px-2 h-11 text-[11px] font-bold text-gray-500">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
          {/* Alerts Tab */}
          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors relative cursor-pointer whitespace-nowrap ${
              activeTab === "alerts" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts
            <span className="absolute top-2 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          </button>

          {/* Tokens Tab */}
          <button
            onClick={() => setActiveTab("tokens")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "tokens" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            Tokens
          </button>

          {/* Leaderboard Tab */}
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "leaderboard" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            Leaderboard
          </button>

          {/* Feed Tab */}
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-1 px-1.5 py-2.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "feed" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            Feed
          </button>
        </div>

        {/* Collapse Button */}
        <button className="p-1 text-gray-600 hover:text-gray-400 cursor-pointer text-xs font-mono font-bold shrink-0">
          &lt;&lt;
        </button>
      </div>

      {/* Sub tabs / Filter Pills */}
      <div className="flex items-center gap-1 p-2 bg-[#06070a] border-b border-[#161b26]/50 overflow-x-auto scrollbar-none text-[10px] font-bold text-gray-400">
        <button
          onClick={() => setActiveSubTab("watchlist")}
          className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === "watchlist" ? "bg-[#1d2433] text-gray-200" : "hover:bg-[#161b26] hover:text-gray-300"
          }`}
        >
          Watchlist
        </button>
        <button
          onClick={() => setActiveSubTab("crypto")}
          className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === "crypto" ? "bg-[#1d2433] text-gray-200" : "hover:bg-[#161b26] hover:text-gray-300"
          }`}
        >
          Crypto
        </button>
        <button
          onClick={() => setActiveSubTab("trending")}
          className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === "trending" ? "bg-[#1d2433] text-gray-200" : "hover:bg-[#161b26] hover:text-gray-300"
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveSubTab("most_held")}
          className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === "most_held" ? "bg-[#1d2433] text-gray-200 border border-gray-700/50" : "hover:bg-[#161b26] hover:text-gray-300"
          }`}
        >
          Most held
        </button>
        <button
          onClick={() => setActiveSubTab("graduated")}
          className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === "graduated" ? "bg-[#1d2433] text-gray-200" : "hover:bg-[#161b26] hover:text-gray-300"
          }`}
        >
          Graduated
        </button>
      </div>

      {/* Main token list */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#161b26]/30">
        {activeTab === "tokens" ? (
          tokens.length > 0 ? (
            tokens.map((token) => {
              const isSelected = token.mint === selectedToken.mint;
              const isPositive = token.change24h >= 0;

              return (
                <div
                  key={token.mint}
                  onClick={() => onSelectToken(token)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
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
                        {/* Verified badge */}
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
            <div className="p-8 text-center text-xs text-gray-600 font-mono">No tokens found.</div>
          )
        ) : (
          <div className="p-8 text-center text-xs text-gray-600 font-mono">
            {activeTab === "alerts" && "No price alerts triggered."}
            {activeTab === "leaderboard" && "Leaderboard calculations loading..."}
            {activeTab === "feed" && "No live feed updates yet."}
          </div>
        )}
      </div>

      {/* Sidebar bottom panel layout buttons */}
      <div className="flex border-t border-[#161b26]/80 p-2 bg-[#0d0e12]/40 gap-2 h-11">
        <button className="flex-1 rounded border border-[#161b26] hover:border-gray-700 bg-[#0d0e12] text-gray-400 hover:text-gray-200 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
          <LayoutGrid className="w-3 h-3" />
          Split bottom
        </button>
        <button className="flex-1 rounded border border-[#161b26] hover:border-gray-700 bg-[#0d0e12] text-gray-400 hover:text-gray-200 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
          <Columns className="w-3 h-3" />
          Split right
        </button>
      </div>
    </div>
  );
}
