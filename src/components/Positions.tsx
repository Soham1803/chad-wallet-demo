'use client';

import React, { useState } from 'react';
import { TokenTicker } from './RotatingBanner';
import { Share2, Sparkles, X, TrendingUp } from 'lucide-react';

interface PositionItem {
  token: TokenTicker;
  balance: number;
  entryPrice: number;
  currentPrice: number;
}

interface PositionsProps {
  positions: PositionItem[];
  onClosePosition: (token: TokenTicker) => void;
  solPrice?: number;
}

export default function Positions({ positions, onClosePosition, solPrice = 142.45 }: PositionsProps) {
  const [sharePosition, setSharePosition] = useState<PositionItem | null>(null);

  return (
    <div className="bg-dark-panel border border-dark-border/80 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-1.5 border-b border-dark-border/40 pb-2 mb-1">
        <TrendingUp className="w-4 h-4 text-brand-green" />
        <span className="font-extrabold text-sm tracking-wide text-foreground/80 uppercase font-mono">
          Your Positions
        </span>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {positions.length > 0 ? (
          positions.map((pos) => {
            const currentPrice = pos.token.symbol === 'SOL' ? solPrice : pos.token.price;
            const entryValue = pos.balance * pos.entryPrice;
            const currentValue = pos.balance * currentPrice;
            const pnlUsd = currentValue - entryValue;
            const pnlPct = entryValue > 0 ? (pnlUsd / entryValue) * 100 : 0;
            const isPositive = pnlPct >= 0;

            return (
              <div
                key={pos.token.symbol}
                className="bg-dark-card/40 border border-dark-border/50 hover:border-dark-border rounded-xl p-3 flex flex-col gap-2.5 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-green to-brand-cyan flex items-center justify-center text-[10px] font-black text-white">
                      {pos.token.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-foreground/90">{pos.token.symbol}</span>
                      <span className="text-[9px] text-foreground/40 font-mono block">
                        Bal: {pos.balance.toLocaleString(undefined, { maximumFractionDigits: pos.token.symbol === 'SOL' ? 4 : 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-foreground/90 block">
                      ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isPositive ? 'text-brand-green' : 'text-brand-red'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {pnlPct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Info row */}
                <div className="flex justify-between items-center text-[9px] text-foreground/45 border-t border-dark-border/20 pt-2 font-mono">
                  <div>
                    Avg Entry:{' '}
                    <span className="text-foreground/70">
                      ${pos.entryPrice.toLocaleString(undefined, { minimumFractionDigits: pos.entryPrice < 0.01 ? 6 : 2 })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSharePosition(pos)}
                      className="inline-flex items-center gap-0.5 text-brand-green hover:text-brand-cyan transition-colors font-bold uppercase"
                    >
                      <Share2 className="w-2.5 h-2.5" />
                      Share
                    </button>
                    {pos.token.symbol !== 'SOL' && (
                      <button
                        onClick={() => onClosePosition(pos.token)}
                        className="text-brand-red hover:text-red-400 transition-colors font-bold uppercase"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-foreground/30 font-mono">
            No active positions. Buy a token to open a position.
          </div>
        )}
      </div>

      {/* Share P&L Modal Overlay */}
      {sharePosition && (() => {
        const currentPrice = sharePosition.token.symbol === 'SOL' ? solPrice : sharePosition.token.price;
        const entryValue = sharePosition.balance * sharePosition.entryPrice;
        const currentValue = sharePosition.balance * currentPrice;
        const pnlUsd = currentValue - entryValue;
        const pnlPct = entryValue > 0 ? (pnlUsd / entryValue) * 100 : 0;
        const isPositive = pnlPct >= 0;

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-dark-bg border border-dark-border/80 rounded-2xl max-w-sm w-full p-5 relative overflow-hidden group glow-green shadow-2xl">
              {/* Outer Cyber grid decoration */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
              
              {/* Top controls */}
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-brand-cyan font-extrabold uppercase font-mono tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 fill-brand-cyan/20" />
                  Multiplier Card
                </div>
                <button
                  onClick={() => setSharePosition(null)}
                  className="p-1 rounded-lg border border-dark-border text-foreground/45 hover:text-foreground hover:bg-dark-card transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* The P&L Card itself (to screenshot/admire) */}
              <div className="w-full aspect-[4/5] rounded-xl bg-gradient-to-br from-dark-panel via-dark-card to-dark-panel border border-brand-green/40 p-5 flex flex-col justify-between relative shadow-2xl overflow-hidden">
                {/* Floating blurs inside card */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-brand-green/10 rounded-full blur-[40px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-cyan/10 rounded-full blur-[40px] -z-10"></div>

                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-foreground/45 tracking-widest font-bold block uppercase font-mono">
                      ChadWallet Positions
                    </span>
                    <span className="font-extrabold text-lg text-foreground tracking-wide font-mono uppercase mt-1 block">
                      {sharePosition.token.symbol}/SOL
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-green to-brand-cyan flex items-center justify-center font-black text-white text-sm">
                    C
                  </div>
                </div>

                {/* Large Return Info */}
                <div className="text-center my-6">
                  <div className="text-[10px] text-foreground/35 tracking-widest font-extrabold uppercase font-mono">
                    PROFIT & LOSS MULTIPLIER
                  </div>
                  <div
                    className={`text-5xl font-black font-mono tracking-tighter mt-2 filter drop-shadow-[0_0_12px_rgba(16,185,129,0.15)] ${
                      isPositive ? 'text-brand-green' : 'text-brand-red'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {pnlPct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] font-mono text-foreground/50 mt-1">
                    Value: ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end border-t border-dark-border/40 pt-4 font-mono text-[9px] text-foreground/40">
                  <div className="space-y-0.5">
                    <div>Entry: ${sharePosition.entryPrice.toLocaleString(undefined, { minimumFractionDigits: sharePosition.entryPrice < 0.01 ? 6 : 2 })}</div>
                    <div>Exit Index: ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: currentPrice < 0.01 ? 6 : 2 })}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-gradient block tracking-wider text-[10px] uppercase font-mono">
                      CHADWALLET
                    </span>
                    <span className="text-[8px] text-foreground/30">Join the social loop</span>
                  </div>
                </div>
              </div>

              {/* Share actions */}
              <div className="mt-5 flex gap-2 relative z-10">
                <button
                  onClick={() => {
                    alert('Copied link to clipboard! Ready to share on Twitter/Telegram.');
                    setSharePosition(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-cyan hover:shadow-lg hover:shadow-brand-green/20 text-white font-bold text-xs transition-all text-center"
                >
                  Copy Share Link
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
