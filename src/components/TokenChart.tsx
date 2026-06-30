"use client";

import React, { useState, useEffect } from "react";
import { TokenDetails } from "@/utils/solanaApi";
import { Globe, Send, Search, Star, Maximize2, Camera, Undo2, Redo2, RefreshCw } from "lucide-react";
import Image from "next/image";

interface TokenChartProps {
  token: TokenDetails;
}

export default function TokenChart({ token }: TokenChartProps) {
  const [activeInterval, setActiveInterval] = useState("15m");
  const [favorite, setFavorite] = useState(false);

  // Overlay state matching the bottom checkbox selectors
  const [mySwaps, setMySwaps] = useState(true);
  const [thesis, setThesis] = useState(true);
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [minSize, setMinSize] = useState(false);

  // Format numbers to compact strings (e.g. $1M, $65.6K)
  const formatCompact = (num?: number, isCurrency = true) => {
    if (num === undefined || num === null) return "--";
    const prefix = isCurrency ? "$" : "";
    if (num >= 1e9) return `${prefix}${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(1)}K`;
    return `${prefix}${num.toFixed(0)}`;
  };

  // Custom zero subscript price formatter
  const formatSubscriptPrice = (price: number) => {
    if (price === 0) return "$0.00";
    if (price < 0.01) {
      const str = price.toFixed(10);
      const match = str.match(/\.0+/);
      const leadingZerosCount = match ? match[0].length - 1 : 0;
      if (leadingZerosCount >= 4) {
        const remaining = price * Math.pow(10, leadingZerosCount + 1);
        return (
          <span className="font-mono text-gray-200">
            $0.0<sub className="text-[10px] bottom-0 font-bold align-sub text-gray-400 mx-[1px]">{leadingZerosCount}</sub>{remaining.toFixed(0)}
          </span>
        );
      }
    }
    return (
      <span className="font-mono text-gray-200">
        ${price.toLocaleString(undefined, {
          minimumFractionDigits: price < 0.01 ? 6 : 2,
          maximumFractionDigits: price < 0.01 ? 6 : 3,
        })}
      </span>
    );
  };

  // Find social URLs from token detail structure
  const twitterUrl = token.socials?.find((s) => s.type === "twitter")?.url;
  const telegramUrl = token.socials?.find((s) => s.type === "telegram")?.url;
  const websiteUrl = token.websites?.[0]?.url;

  return (
    <div className="w-full h-full bg-[#06070a] flex flex-col overflow-hidden select-none font-mono text-xs">
      {/* 1. Top Detail Panel Grid */}
      <div className="flex items-center justify-between border-b border-[#161b26]/80 p-3 bg-[#0d0e12]/30 flex-wrap gap-3">
        {/* Token badge identity */}
        <div className="flex items-center gap-2">
          {token.logo ? (
            <Image
              src={token.logo}
              alt={token.symbol}
              width={28}
              height={28}
              unoptimized
              className="w-7 h-7 rounded-full object-cover border border-gray-700/50"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-950 flex items-center justify-center font-black text-[10px]">
              {token.symbol.substring(0, 2)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-150 text-sm">{token.symbol}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0df294] animate-pulse"></div>
            </div>
            <span className="text-[10px] text-gray-500 font-mono block leading-none mt-0.5 truncate max-w-[120px]">
              {token.name}
            </span>
          </div>

          {/* Mint Copy badge */}
          <div className="flex items-center gap-1.5 ml-1.5 px-2 py-0.5 rounded bg-[#161a22] border border-[#2d374d] text-gray-400 font-mono text-[9px]">
            <span>{token.mint.slice(0, 6)}...{token.mint.slice(-6)}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(token.mint);
                alert("Mint address copied to clipboard!");
              }}
              className="text-gray-500 hover:text-gray-300 font-bold shrink-0 cursor-pointer"
            >
              [copy]
            </button>
          </div>

          {/* Social connections */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-[#161b26]/80 pl-2 text-gray-500">
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {telegramUrl && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                <Send className="w-3.5 h-3.5" />
              </a>
            )}
            <button className="hover:text-gray-300 cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFavorite(!favorite)}
              className={`cursor-pointer transition-colors ${favorite ? "text-yellow-500 fill-yellow-500/20" : "hover:text-gray-300"}`}
            >
              <Star className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Grid Metrics */}
        <div className="flex items-center gap-4 text-center">
          <div>
            <div className="text-[10px] text-gray-500 font-bold">Market cap</div>
            <div className="font-bold text-gray-200 mt-0.5">{formatCompact(token.marketCap)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold">Price</div>
            <div className="font-bold text-gray-200 mt-0.5">{formatSubscriptPrice(token.price)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold">24H change</div>
            <div className={`font-bold mt-0.5 ${token.change24h >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {token.change24h >= 0 ? "▲" : "▼"} {Math.abs(token.change24h).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold">24H Vol.</div>
            <div className="font-bold text-gray-200 mt-0.5">{formatCompact(token.volume24h)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold">Liquidity</div>
            <div className="font-bold text-gray-200 mt-0.5">{formatCompact(token.liquidity)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold">Holders</div>
            <div className="font-bold text-gray-200 mt-0.5">{formatCompact(token.holders, false)}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold">Top 10 holding</div>
            <div className="font-bold text-gray-200 mt-0.5">{token.top10Holding ? `${token.top10Holding}%` : "--"}</div>
          </div>
        </div>
      </div>

      {/* 2. Sub Chart Header Controls */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-[#161b26]/50 bg-[#0d0e12]/20 font-bold text-gray-500 text-[11px]">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          {/* Time intervals */}
          <div className="flex items-center gap-1.5 border-r border-[#161b26]/80 pr-3">
            {["1m", "5m", "15m", "1h", "4h", "1d"].map((interval) => (
              <button
                key={interval}
                onClick={() => setActiveInterval(interval)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  activeInterval === interval ? "bg-[#1d2433] text-[#0df294]" : "hover:text-gray-300"
                }`}
              >
                {interval}
              </button>
            ))}
          </div>

          {/* Pricing style toggle */}
          <button className="text-gray-400 hover:text-gray-200 cursor-pointer">Price / MCap</button>
          <button className="text-gray-400 hover:text-gray-200 flex items-center gap-1 cursor-pointer">
            Indicators
          </button>
        </div>

        {/* Extra actions */}
        <div className="flex items-center gap-2">
          <button className="p-1 hover:text-gray-300 cursor-pointer">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-gray-300 cursor-pointer">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-gray-300 cursor-pointer">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-gray-300 cursor-pointer">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. The Candle Chart Area */}
      <div className="flex-1 bg-[#06070a] relative min-h-[300px]">
        {token.pairAddress ? (
          <iframe
            src={`https://dexscreener.com/solana/${token.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
            className="absolute inset-0 w-full h-full border-0 bg-[#06070a]"
            title={`${token.symbol} Candle Chart`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 font-mono">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-600" />
            <span>Resolving Live Chart for {token.symbol}...</span>
          </div>
        )}
      </div>

      {/* 4. Bottom overlays */}
      <div className="flex items-center justify-between border-t border-[#161b26]/80 px-3 h-10 bg-[#0d0e12]/30 text-[10px] text-gray-500 font-bold">
        {/* Overlay Checkboxes */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Chart overlays</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={mySwaps}
              onChange={(e) => setMySwaps(e.target.checked)}
              className="w-3 h-3 rounded bg-transparent border-gray-700 checked:bg-[#0df294]"
            />
            My swaps
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={thesis}
              onChange={(e) => setThesis(e.target.checked)}
              className="w-3 h-3 rounded bg-transparent border-gray-700 checked:bg-[#0df294]"
            />
            Thesis
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={friendsOnly}
              onChange={(e) => setFriendsOnly(e.target.checked)}
              className="w-3 h-3 rounded bg-transparent border-gray-700 checked:bg-[#0df294]"
            />
            Friends only
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={minSize}
              onChange={(e) => setMinSize(e.target.checked)}
              className="w-3 h-3 rounded bg-transparent border-gray-700 checked:bg-[#0df294]"
            />
            Min size (&gt;$1K)
          </label>
        </div>

        {/* Auto / Log controls */}
        <div className="flex items-center gap-2 text-gray-400">
          <span>01:46:23 UTC</span>
          <button className="px-1 hover:text-gray-200 font-bold">%</button>
          <button className="px-1 hover:text-gray-200 font-bold">log</button>
          <button className="px-1.5 py-0.5 rounded bg-[#1d2433] text-gray-200 font-bold">auto</button>
        </div>
      </div>
    </div>
  );
}
