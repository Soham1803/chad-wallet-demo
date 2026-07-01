"use client";

import React, { useState, useEffect } from "react";

export default function TradingFooter() {
  const [prices, setPrices] = useState({
    BTC: { price: 59800.08, change: 0.48 },
    ETH: { price: 1591.83, change: 1.15 },
    SOL: { price: 74.24, change: 3.82 },
    DOT: { price: 66.16, change: 6.6 },
  });

  // Dynamic price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => ({
        BTC: {
          price: prev.BTC.price + (Math.random() - 0.5) * 10,
          change: prev.BTC.change,
        },
        ETH: {
          price: prev.ETH.price + (Math.random() - 0.5) * 1,
          change: prev.ETH.change,
        },
        SOL: {
          price: prev.SOL.price + (Math.random() - 0.5) * 0.1,
          change: prev.SOL.change,
        },
        DOT: {
          price: prev.DOT.price + (Math.random() - 0.5) * 0.05,
          change: prev.DOT.change,
        },
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-8 bg-[#0d0e12] border-t border-[#161b26] flex items-center justify-between px-4 text-[10px] text-gray-500 font-mono select-none shrink-0">
      {/* Left: Tickers */}
      <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 font-mono"></span>
          <span className="font-bold text-gray-400">BTC</span>
          <span className="text-gray-300">
            $
            {prices.BTC.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-emerald-500 font-bold">
            ▲ {prices.BTC.change}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-gray-800 pl-4">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="font-bold text-gray-400">ETH</span>
          <span className="text-gray-300">
            $
            {prices.ETH.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-emerald-500 font-bold">
            ▲ {prices.ETH.change}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-gray-800 pl-4">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span className="font-bold text-gray-400">SOL</span>
          <span className="text-gray-300">
            $
            {prices.SOL.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-emerald-500 font-bold">
            ▲ {prices.SOL.change}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-gray-800 pl-4">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          <span className="font-bold text-gray-400">DOT</span>
          <span className="text-gray-300">
            $
            {prices.DOT.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-emerald-500 font-bold">
            ▲ {prices.DOT.change}%
          </span>
        </div>
      </div>

      {/* Right: Net status and policies */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-500 font-bold font-mono">Stable</span>
        </div>
        <span className="text-gray-800 font-bold font-mono">|</span>

        <a
          href="https://x.com/getchadwallet"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
