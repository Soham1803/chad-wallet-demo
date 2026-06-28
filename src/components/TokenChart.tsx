"use client";

import React, { useEffect, useRef } from "react";
import { TokenTicker } from "./RotatingBanner";
import { Activity } from "lucide-react";

interface TokenChartProps {
  token: TokenTicker;
}

// Maps our token symbols to valid TradingView symbols
const TRADINGVIEW_SYMBOL_MAP: Record<string, string> = {
  SOL: "BINANCE:SOLUSDT",
  BONK: "BINANCE:BONKUSDT",
  WIF: "BINANCE:WIFUSDT",
  JUP: "BINANCE:JUPUSDT",
  POPCAT: "GATEIO:POPCATUSDT",
  MEW: "GATEIO:MEWUSDT",
  BOME: "BINANCE:BOMEUSDT",
  CHAD: "BINANCE:SOLUSDT", // Fallback custom token to SOL for chart reference
};

export default function TokenChart({ token }: TokenChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { symbol } = token;

  // Initialize/re-initialize the TradingView widget when the token symbol changes
  useEffect(() => {
    if (!containerRef.current) return;

    // Determine the TradingView symbol
    const tvSymbol = TRADINGVIEW_SYMBOL_MAP[symbol] || "BINANCE:SOLUSDT";

    // Clear previous container contents (safely)
    containerRef.current.innerHTML = "";

    // Create the widget container structure
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container w-full h-full";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget w-full h-full";
    widgetContainer.appendChild(widgetDiv);

    // Create the script element
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // Pass the config as JSON inside the script
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1", // Candlestick
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      isTransparent: true,
      backgroundColor: "#030712",
      hide_top_toolbar: true,
      hide_side_toolbar: true,
      gridColor: "rgba(21, 34, 56, 0.45)",
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-full bg-transparent overflow-hidden flex flex-col">
      {/* Chart Header */}
      <div className="px-4 py-3 bg-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></div>
          <span className="font-bold text-xs text-foreground/80 flex items-center gap-1.5 uppercase font-mono tracking-wider">
            <Activity className="w-3.5 h-3.5 text-brand-green" />
            Live Market Chart: {token.symbol}/USD
          </span>
        </div>
        {token.symbol === "CHAD" && (
          <span className="text-[10px] text-foreground/40 italic">
            *Mapping custom token to SOL index
          </span>
        )}
      </div>

      {/* Widget Container */}
      <div
        className="flex-1 min-h-[300px] w-full bg-transparent p-0"
        ref={containerRef}
      >
        {/* The widget will be mounted dynamically here */}
      </div>
    </div>
  );
}
