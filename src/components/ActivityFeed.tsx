"use client";

import React, { useState } from "react";
import { TTokenDetails } from "@/utils/solanaApi";
import { Heart } from "lucide-react";
import mockTradersJson from "@/data/mockTraders.json";

export default function ActivityFeed({ token }: TActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<"holders" | "swaps" | "thesis">("holders");
  const [thesisOnly, setThesisOnly] = useState(false);
  const [friendsOnly, setFriendsOnly] = useState(false);

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

  // Helper to format large amounts
  const formatAmount = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const traders: TTraderRow[] = mockTradersJson;

  // Dynamically calculate holdings based on token price
  const resolvedRows = traders.map((trader) => {
    const entryPrice = token.price * trader.entryPriceMult;
    const currentPrice = token.price;
    const positionValue = trader.amount * currentPrice;
    const entryValue = trader.amount * entryPrice;
    const pnlUsd = positionValue - entryValue;
    const pnlPct = ((currentPrice - entryPrice) / entryPrice) * 100;

    return {
      ...trader,
      entryPrice,
      positionValue,
      pnlUsd,
      pnlPct,
    };
  });

  // Filter rows based on tabs/checkboxes
  const filteredRows = resolvedRows.filter((row) => {
    if (activeTab === "thesis" || thesisOnly) {
      return !!row.thesisText;
    }
    return true;
  });

  return (
    <div className="flex flex-col bg-[#06070a] border-t border-[#161b26]/85 overflow-hidden h-full font-mono text-xs select-none">
      {/* 1. Header Tab selectors */}
      <div className="flex items-center justify-between border-b border-[#161b26]/80 px-3 bg-[#0d0e12]/20 h-10 text-[11px] font-bold text-gray-500">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("holders")}
            className={`py-3 cursor-pointer ${
              activeTab === "holders" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            Holders
          </button>
          <button
            onClick={() => setActiveTab("swaps")}
            className={`py-3 cursor-pointer ${
              activeTab === "swaps" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            Swaps
          </button>
          <button
            onClick={() => setActiveTab("thesis")}
            className={`py-3 cursor-pointer ${
              activeTab === "thesis" ? "text-white border-b border-white" : "hover:text-gray-300"
            }`}
          >
            Thesis (2)
          </button>
        </div>

        {/* Right Filter checkboxes */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={thesisOnly}
              onChange={(e) => setThesisOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-transparent border-gray-700 checked:bg-[#0df294]"
            />
            Thesis only
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={friendsOnly}
              onChange={(e) => setFriendsOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-transparent border-gray-700 checked:bg-[#0df294]"
            />
            Friends only
          </label>
        </div>
      </div>

      {/* 2. Table Column Headers */}
      <div className="grid grid-cols-12 px-4 py-2 border-b border-[#161b26]/50 bg-[#0d0e12]/10 text-[10px] font-bold text-gray-600">
        <div className="col-span-3">Trader</div>
        <div className="col-span-2 text-right">Position</div>
        <div className="col-span-2 text-right">PnL</div>
        <div className="col-span-2 text-right">Avg. entry</div>
        <div className="col-span-3 pl-6">Thesis</div>
      </div>

      {/* 3. Table Rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#161b26]/20 bg-[#06070a]">
        {filteredRows.length > 0 ? (
          filteredRows.map((row, idx) => {
            const isPositive = row.pnlPct >= 0;

            return (
              <div
                key={`${row.username}-${idx}`}
                className="grid grid-cols-12 px-4 py-2 text-[11px] items-center hover:bg-[#0d0e12]/40 transition-colors"
              >
                {/* Trader column */}
                <div className="col-span-3 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${row.avatarColor} flex items-center justify-center text-[9px] font-black text-white shrink-0`}>
                    {row.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-gray-200 block truncate">{row.username}</span>
                    <span className="text-[9px] text-gray-600 block leading-none mt-0.5 whitespace-nowrap">
                      {row.holdTime}
                    </span>
                  </div>
                </div>

                {/* Position column */}
                <div className="col-span-2 text-right">
                  <div className="font-bold text-gray-300">
                    ${row.positionValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    {formatAmount(row.amount)} {token.symbol}
                  </div>
                </div>

                {/* PnL column */}
                <div className="col-span-2 text-right">
                  <div className={`font-bold ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                    {isPositive ? "+" : ""}${row.pnlUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className={`text-[9px] font-bold ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                    {isPositive ? "▲" : "▼"} {Math.abs(row.pnlPct).toFixed(2)}%
                  </div>
                </div>

                {/* Avg Entry column */}
                <div className="col-span-2 text-right">
                  <div className="font-bold text-gray-300">
                    $1M MC
                  </div>
                  <div className="text-[9px] text-gray-500 block leading-none mt-0.5">
                    {formatSubscriptPrice(row.entryPrice)}
                  </div>
                </div>

                {/* Thesis column */}
                <div className="col-span-3 pl-6 flex items-center justify-between text-gray-400">
                  <span className="truncate max-w-[80%] italic">
                    {row.thesisText || "--"}
                  </span>
                  {row.thesisText && (
                    <div className="flex items-center gap-1 text-[9px] text-gray-600 hover:text-rose-500 cursor-pointer shrink-0">
                      <Heart className="w-3 h-3" />
                      <span>{row.likes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-gray-600">No active positions under this filter.</div>
        )}
      </div>
    </div>
  );
}

type TActivityFeedProps = {
  token: TTokenDetails;
  solPrice?: number;
};

type TTraderRow = {
  username: string;
  avatarColor: string;
  holdTime: string;
  amount: number;
  entryPriceMult: number; // multiplier to base price to calculate entry
  thesisText?: string;
  likes: number;
};
