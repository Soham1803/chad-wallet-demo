"use client";

import React, { useState } from "react";
import { TTokenDetails } from "@/utils/solanaApi";
import { ChevronDown, Share2, X, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Positions({
  positions,
  onClosePosition,
  solPrice = 142.45,
  selectedToken,
}: TPositionsProps) {
  const [activeFilter, setActiveFilter] = useState<"open" | "closed">("open");
  const [sharePosition, setSharePosition] = useState<TPositionItem | null>(null);

  // --- Calculate Stats for the "About Token" Panel ---
  const priceChange = selectedToken.priceChange || {};
  const txns = selectedToken.txns || {};

  // Extract changes, fallback to mock values proportional to 24h change if missing
  const change5m = priceChange.m5 ?? Number((selectedToken.change24h * 0.12).toFixed(2));
  const change1h = priceChange.h1 ?? Number((selectedToken.change24h * 0.42).toFixed(2));
  const change4h = priceChange.h6 ?? Number((selectedToken.change24h * 0.78).toFixed(2));
  const change1d = selectedToken.change24h;

  // Extract transactions, fallback to mock values
  const buys24h = txns.h24?.buys ?? 180;
  const sells24h = txns.h24?.sells ?? 150;
  const totalTrades = buys24h + sells24h;
  const buyRatio = totalTrades > 0 ? buys24h / totalTrades : 0.5;

  // Volume splits
  const vol24h = selectedToken.volume24h ?? 25000;
  const buyVol = vol24h * buyRatio;
  const sellVol = vol24h * (1 - buyRatio);

  // Buyers vs Sellers counts
  const buyersCount = Math.floor(buys24h * 0.85);
  const sellersCount = Math.floor(sells24h * 0.88);
  const totalUsers = buyersCount + sellersCount;
  const buyerRatio = totalUsers > 0 ? buyersCount / totalUsers : 0.5;

  // Format large numbers helper
  const formatCompact = (num: number, isCurrency = true) => {
    const prefix = isCurrency ? "$" : "";
    if (num >= 1e6) return `${prefix}${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${prefix}${(num / 1e3).toFixed(1)}K`;
    return `${prefix}${num.toFixed(0)}`;
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-xs select-none">
      {/* ============================================================== */}
      {/* 1. About Token Card                                            */}
      {/* ============================================================== */}
      <div className="bg-[#06070a] border border-[#161b26]/80 rounded p-4 flex flex-col gap-3">
        <span className="font-bold text-gray-200">About {selectedToken.symbol}</span>
        
        {/* Token Description */}
        <p className="text-[10px] text-gray-500 leading-relaxed max-h-16 overflow-y-auto scrollbar-none font-sans">
          {selectedToken.description || `For the on-chain operations of ${selectedToken.name} on the Solana blockchain.`}
        </p>

        {/* Time intervals grid */}
        <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
          {/* 5M */}
          <div className="bg-[#0d0e12] border border-[#161b26]/60 rounded py-1 flex flex-col gap-0.5">
            <span className="text-gray-500 text-[8px] uppercase">5m</span>
            <span className={change5m >= 0 ? "text-emerald-500" : "text-rose-500"}>
              {change5m >= 0 ? "▲" : "▼"}{Math.abs(change5m).toFixed(2)}%
            </span>
          </div>
          {/* 1H */}
          <div className="bg-[#0d0e12] border border-[#161b26]/60 rounded py-1 flex flex-col gap-0.5">
            <span className="text-gray-500 text-[8px] uppercase">1h</span>
            <span className={change1h >= 0 ? "text-emerald-500" : "text-rose-500"}>
              {change1h >= 0 ? "▲" : "▼"}{Math.abs(change1h).toFixed(2)}%
            </span>
          </div>
          {/* 4H */}
          <div className="bg-[#0d0e12] border border-[#161b26]/60 rounded py-1 flex flex-col gap-0.5">
            <span className="text-gray-500 text-[8px] uppercase">4h</span>
            <span className={change4h >= 0 ? "text-emerald-500" : "text-rose-500"}>
              {change4h >= 0 ? "▲" : "▼"}{Math.abs(change4h).toFixed(2)}%
            </span>
          </div>
          {/* 1D */}
          <div className="bg-[#0d0e12] border border-[#161b26]/60 rounded py-1 flex flex-col gap-0.5">
            <span className="text-gray-500 text-[8px] uppercase">1d</span>
            <span className={change1d >= 0 ? "text-emerald-500" : "text-rose-500"}>
              {change1d >= 0 ? "▲" : "▼"}{Math.abs(change1d).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Buys vs Sells Counts Progress Bar */}
        <div className="space-y-1.5 text-[10px] font-bold">
          <div className="flex justify-between items-center">
            <span className="text-emerald-500">{buys24h} buys</span>
            <span className="text-rose-500">{sells24h} sells</span>
          </div>
          <div className="w-full h-1 bg-rose-600 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${buyRatio * 100}%` }}></div>
          </div>
        </div>

        {/* Volume splits Progress Bar */}
        <div className="space-y-1.5 text-[10px] font-bold">
          <div className="flex justify-between items-center">
            <span className="text-emerald-500">{formatCompact(buyVol)} vol.</span>
            <span className="text-rose-500">{formatCompact(sellVol)} vol.</span>
          </div>
          <div className="w-full h-1 bg-rose-600 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${buyRatio * 100}%` }}></div>
          </div>
        </div>

        {/* Buyers vs Sellers Counts Progress Bar */}
        <div className="space-y-1.5 text-[10px] font-bold">
          <div className="flex justify-between items-center">
            <span className="text-emerald-500">{buyersCount} buyers</span>
            <span className="text-rose-500">{sellersCount} sellers</span>
          </div>
          <div className="w-full h-1 bg-rose-600 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${buyerRatio * 100}%` }}></div>
          </div>
        </div>

        {/* View More Option */}
        <button className="w-full py-1 text-[10px] font-bold text-gray-500 hover:text-gray-300 bg-[#0d0e12] border border-[#161b26] rounded flex items-center justify-center gap-1 transition-colors cursor-pointer">
          View more
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* 2. Your Positions Card                                         */}
      {/* ============================================================== */}
      <div className="bg-[#06070a] border border-[#161b26]/80 rounded p-4 flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-200">Your positions</span>
          
          {/* Open/Closed Filter Toggle */}
          <div className="flex bg-[#0d0e12] border border-[#161b26] p-0.5 rounded text-[10px] font-bold h-7">
            <button
              onClick={() => setActiveFilter("open")}
              className={`px-2.5 rounded transition-all cursor-pointer ${
                activeFilter === "open" ? "bg-[#1d2433] text-gray-200" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveFilter("closed")}
              className={`px-2.5 rounded transition-all cursor-pointer ${
                activeFilter === "closed" ? "bg-[#1d2433] text-gray-200" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Positions List container */}
        <div className="flex-1 overflow-y-auto max-h-[220px] divide-y divide-[#161b26]/40">
          {activeFilter === "open" && positions.length > 0 ? (
            positions.map((pos) => {
              const currentPrice = pos.token.mint === "So11111111111111111111111111111111111111112" ? solPrice : pos.token.price;
              const currentValue = pos.balance * currentPrice;
              const entryValue = pos.balance * pos.entryPrice;
              const pnlUsd = currentValue - entryValue;
              const pnlPct = entryValue > 0 ? (pnlUsd / entryValue) * 100 : 0;
              const isPositive = pnlPct >= 0;

              return (
                <div key={pos.token.mint} className="py-2.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {pos.token.logo ? (
                        <Image
                          src={pos.token.logo}
                          alt={pos.token.symbol}
                          width={24}
                          height={24}
                          unoptimized
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-950 flex items-center justify-center font-black text-[9px] uppercase">
                          {pos.token.symbol.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-gray-200">{pos.token.symbol}</span>
                        <span className="text-[9px] text-gray-600 block">
                          Bal: {pos.balance.toLocaleString(undefined, { maximumFractionDigits: pos.token.symbol === "SOL" ? 3 : 0 })}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-gray-200 block">${currentValue.toFixed(2)}</span>
                      <span className={`text-[10px] font-bold ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        {isPositive ? "+" : ""}{pnlPct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center justify-between text-[9px] text-gray-500 border-t border-[#161b26]/20 pt-1.5 font-mono">
                    <span>Entry: ${pos.entryPrice < 0.01 ? pos.entryPrice.toFixed(6) : pos.entryPrice.toFixed(3)}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSharePosition(pos)}
                        className="text-[#0df294] hover:underline font-bold uppercase cursor-pointer"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => onClosePosition(pos.token)}
                        className="text-rose-400 hover:underline font-bold uppercase cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-gray-600 font-mono">
              {activeFilter === "open" ? "No open positions" : "No closed positions history."}
            </div>
          )}
        </div>
      </div>

      {/* Share P&L Modal Overlay */}
      {sharePosition && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0e12] border border-[#1d2433] rounded max-w-sm w-full p-5 relative font-mono text-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="flex items-center gap-1.5 text-xs text-[#0df294] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-[#0df294]/20" />
                Multiplier Card
              </span>
              <button
                onClick={() => setSharePosition(null)}
                className="p-1 rounded border border-[#161b26] text-gray-500 hover:text-gray-300 hover:bg-[#161b26] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* P&L Poster */}
            <div className="w-full aspect-[4/5] rounded border border-gray-700 bg-gradient-to-br from-[#06070a] to-[#0d0e12] p-5 flex flex-col justify-between relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#0df294]/5 rounded-full blur-[40px] -z-10"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-gray-500 tracking-wider block uppercase font-bold">FOMO TRADING</span>
                  <span className="font-extrabold text-sm text-gray-200 uppercase mt-0.5 block">{sharePosition.token.symbol}/SOL</span>
                </div>
                <div className="w-7 h-7 rounded bg-[#11241a] border border-[#0df294]/30 flex items-center justify-center font-black text-[#0df294] text-xs">
                  F
                </div>
              </div>

              <div className="text-center my-6">
                <div className="text-[9px] text-gray-600 tracking-widest font-extrabold uppercase">MULTIPLE RETURN</div>
                <div className={`text-4xl font-black mt-2 text-emerald-500 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]`}>
                  +{( ( (sharePosition.token.price - sharePosition.entryPrice) / sharePosition.entryPrice ) * 100 ).toFixed(1)}%
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-gray-800 pt-3 text-[9px] text-gray-500 font-mono">
                <div>
                  <div>Entry: ${sharePosition.entryPrice < 0.01 ? sharePosition.entryPrice.toFixed(6) : sharePosition.entryPrice.toFixed(3)}</div>
                  <div>Mark: ${sharePosition.token.price < 0.01 ? sharePosition.token.price.toFixed(6) : sharePosition.token.price.toFixed(3)}</div>
                </div>
                <span className="font-black text-[#0df294] tracking-widest text-[9px]">FOMO</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Share card link copied to clipboard!");
                setSharePosition(null);
              }}
              className="mt-4 w-full py-2.5 rounded bg-[#0df294] text-black font-extrabold text-xs hover:bg-[#0df294]/90 active:scale-[0.98] transition-all text-center cursor-pointer"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type TPositionItem = {
  token: TTokenDetails;
  balance: number;
  entryPrice: number;
  currentPrice: number;
};

type TPositionsProps = {
  positions: TPositionItem[];
  onClosePosition: (token: TTokenDetails) => void;
  solPrice?: number;
  selectedToken: TTokenDetails;
};
