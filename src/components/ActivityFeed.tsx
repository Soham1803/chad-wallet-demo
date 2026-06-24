'use client';

import React, { useEffect, useState } from 'react';
import { TokenTicker } from './RotatingBanner';
import { Users, History } from 'lucide-react';

interface ActivityFeedProps {
  token: TokenTicker;
}

interface TradeItem {
  id: string;
  wallet: string;
  action: 'BUY' | 'SELL';
  amountToken: number;
  amountSol: number;
  time: string;
}

interface HolderItem {
  rank: number;
  wallet: string;
  balance: number;
  percentage: number;
  isPool?: boolean;
}

export default function ActivityFeed({ token }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<'trades' | 'holders'>('trades');
  const [trades, setTrades] = useState<TradeItem[]>([]);

  // Generate mock top holders inline based on the token
  const isPoolToken = token.symbol !== 'SOL';
  const holders: HolderItem[] = [
    {
      rank: 1,
      wallet: isPoolToken ? 'Raydium Authority Pool (5Yc...t4)' : 'Binance Wallet Hot (2Rz...8p)',
      balance: token.symbol === 'SOL' ? 8421045 : 124500000 * (1 / token.price),
      percentage: token.symbol === 'SOL' ? 12.4 : 18.5,
      isPool: true,
    },
    {
      rank: 2,
      wallet: 'ChadWallet Vault (CHAD...v7)',
      balance: token.symbol === 'SOL' ? 3120400 : 42000000 * (1 / token.price),
      percentage: token.symbol === 'SOL' ? 4.6 : 6.2,
      isPool: true,
    },
    {
      rank: 3,
      wallet: 'whale_daddy.sol (8Gx...2w)',
      balance: token.symbol === 'SOL' ? 1420500 : 15000000 * (1 / token.price),
      percentage: token.symbol === 'SOL' ? 2.1 : 2.2,
    },
    {
      rank: 4,
      wallet: 'jup_arbitrage.sol (Jup...7x)',
      balance: token.symbol === 'SOL' ? 950200 : 8500000 * (1 / token.price),
      percentage: token.symbol === 'SOL' ? 1.4 : 1.3,
    },
    {
      rank: 5,
      wallet: 'sol_enjoyer.sol (C6v...w9)',
      balance: token.symbol === 'SOL' ? 520100 : 5000000 * (1 / token.price),
      percentage: token.symbol === 'SOL' ? 0.76 : 0.74,
    },
  ];

  // Initialize mock trades when token changes
  useEffect(() => {
    const initialTrades: TradeItem[] = Array.from({ length: 6 }).map((_, idx) => {
      const isBuy = Math.random() > 0.45;
      const amountSol = Number((Math.random() * 8 + 0.1).toFixed(2));
      const amountToken = Number((amountSol * (142.45 / token.price)).toFixed(token.price > 1 ? 2 : 0));
      return {
        id: `trade-${idx}-${Date.now()}`,
        wallet: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        action: isBuy ? 'BUY' : 'SELL',
        amountSol,
        amountToken,
        time: `${idx * 2 + 1}m ago`,
      };
    });
    
    // Defer state update to prevent react-hooks/set-state-in-effect warning
    setTimeout(() => setTrades(initialTrades), 0);
  }, [token]);

  // Simulating live incoming trades
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab !== 'trades') return;

      const isBuy = Math.random() > 0.4;
      const amountSol = Number((Math.random() * 15 + 0.05).toFixed(2));
      const amountToken = Number((amountSol * (142.45 / token.price)).toFixed(token.price > 1 ? 2 : 0));
      const wallets = ['D6z...3s', 'H8y...4q', 'K9x...1w', 'G7p...9z', 'L4r...2t', 'X1s...7y'];
      const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];

      const newTrade: TradeItem = {
        id: `trade-${Date.now()}`,
        wallet: randomWallet,
        action: isBuy ? 'BUY' : 'SELL',
        amountSol,
        amountToken,
        time: 'Just now',
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 9)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [token, activeTab]);

  return (
    <div className="flex flex-col bg-dark-panel border border-dark-border/80 rounded-2xl overflow-hidden h-full">
      {/* Tabs */}
      <div className="flex border-b border-dark-border/60 text-xs font-semibold bg-dark-card/20">
        <button
          onClick={() => setActiveTab('trades')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'trades'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Live Trades
        </button>
        <button
          onClick={() => setActiveTab('holders')}
          className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'holders'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Top Holders
        </button>
      </div>

      {/* Content pane */}
      <div className="flex-1 overflow-y-auto min-h-[220px]">
        {activeTab === 'trades' ? (
          <div className="divide-y divide-dark-border/30">
            {trades.map((trade) => {
              const isBuy = trade.action === 'BUY';
              return (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 text-xs hover:bg-dark-card/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/45 font-mono">{trade.wallet}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold leading-none ${
                        isBuy ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                      }`}
                    >
                      {trade.action}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground/90 font-mono">
                      {trade.amountToken.toLocaleString(undefined, { maximumFractionDigits: token.price > 1 ? 2 : 0 })} {token.symbol}
                    </span>
                    <span className="text-foreground/50 font-mono hidden sm:inline">
                      {trade.amountSol} SOL
                    </span>
                    <span className="text-[10px] text-foreground/30 font-mono w-12 text-right">
                      {trade.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-dark-border/30">
            {holders.map((holder) => (
              <div
                key={holder.rank}
                className="flex items-center justify-between p-3 text-xs hover:bg-dark-card/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] bg-dark-bg border border-dark-border text-foreground/40 w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {holder.rank}
                  </span>
                  <span className={`font-mono ${holder.isPool ? 'text-brand-green font-medium' : 'text-foreground/80'}`}>
                    {holder.wallet}
                  </span>
                </div>
                
                <div className="text-right font-mono flex items-center gap-4">
                  <span className="text-foreground/60 hidden sm:inline">
                    {Math.floor(holder.balance).toLocaleString()} {token.symbol}
                  </span>
                  <span className="font-bold text-foreground/90 w-12 text-right">
                    {holder.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
