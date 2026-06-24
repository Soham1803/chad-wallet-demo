'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TokenTicker } from './RotatingBanner';
import { Activity } from 'lucide-react';

interface TokenChartProps {
  token: TokenTicker;
}

declare global {
  interface Window {
    TradingView?: {
      MediumWidget: new (options: Record<string, unknown>) => unknown;
    };
  }
}

// Maps our token symbols to valid TradingView symbols
const TRADINGVIEW_SYMBOL_MAP: Record<string, string> = {
  SOL: 'BINANCE:SOLUSDT',
  BONK: 'BINANCE:BONKUSDT',
  WIF: 'BINANCE:WIFUSDT',
  JUP: 'BINANCE:JUPUSDT',
  POPCAT: 'GATEIO:POPCATUSDT',
  MEW: 'GATEIO:MEWUSDT',
  BOME: 'BINANCE:BOMEUSDT',
  CHAD: 'BINANCE:SOLUSDT', // Fallback custom token to SOL for chart reference
};

export default function TokenChart({ token }: TokenChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load the TradingView Widget script dynamically
  useEffect(() => {
    const existingScript = document.getElementById('tradingview-widget-script');
    if (existingScript) {
      setTimeout(() => setScriptLoaded(true), 0);
      return;
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize/re-initialize the TradingView widget when the script loads or the token changes
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    // Determine the TradingView symbol
    const tvSymbol = TRADINGVIEW_SYMBOL_MAP[token.symbol] || 'BINANCE:SOLUSDT';

    // Clear previous container contents (safely)
    containerRef.current.innerHTML = '';
    const chartDiv = document.createElement('div');
    chartDiv.id = `tv_chart_${token.symbol}`;
    chartDiv.className = 'w-full h-full';
    containerRef.current.appendChild(chartDiv);

    // Initialize widget
    if (typeof window !== 'undefined' && window.TradingView) {
      new window.TradingView.MediumWidget({
        symbols: [
          [
            `${token.name} (${token.symbol})`,
            tvSymbol
          ]
        ],
        chartOnly: false,
        width: '100%',
        height: '100%',
        locale: 'en',
        colorTheme: 'dark',
        gridLineColor: 'rgba(31, 34, 46, 0.4)',
        fontColor: '#9ca3af',
        underLineColor: 'rgba(13, 242, 148, 0.15)',
        underLineBottomColor: 'rgba(13, 242, 148, 0.0)',
        trendLineColor: '#0df294', // Brand green
        container_id: chartDiv.id,
      } as Record<string, unknown>);
    }
  }, [scriptLoaded, token]);

  return (
    <div className="w-full h-full bg-dark-panel border border-dark-border/80 rounded-2xl overflow-hidden flex flex-col">
      {/* Chart Header */}
      <div className="px-4 py-3 border-b border-dark-border/60 bg-dark-card/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></div>
          <span className="font-bold text-xs text-foreground/80 flex items-center gap-1.5 uppercase font-mono tracking-wider">
            <Activity className="w-3.5 h-3.5 text-brand-green" />
            Live Market Chart: {token.symbol}/USD
          </span>
        </div>
        {token.symbol === 'CHAD' && (
          <span className="text-[10px] text-foreground/40 italic">
            *Mapping custom token to SOL index
          </span>
        )}
      </div>

      {/* Widget Container */}
      <div className="flex-1 min-h-[300px] w-full bg-dark-bg p-1" ref={containerRef}>
        {!scriptLoaded && (
          <div className="w-full h-full flex flex-col items-center justify-center text-xs text-foreground/40 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-green border-t-transparent animate-spin"></div>
            Loading TradingView Feed...
          </div>
        )}
      </div>
    </div>
  );
}
