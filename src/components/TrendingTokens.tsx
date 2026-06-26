'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Flame, TrendingUp } from 'lucide-react';
import { TokenTicker } from './RotatingBanner';

interface TrendingTokensProps {
  tokens: TokenTicker[];
  selectedToken: TokenTicker;
  onSelectToken: (token: TokenTicker) => void;
}

export default function TrendingTokens({
  tokens,
  selectedToken,
  onSelectToken,
}: TrendingTokensProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'volume'>('trending');

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by performance/change for trending tab, or dummy sort by price for volume tab
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    if (activeTab === 'trending') {
      return Math.abs(b.change24h) - Math.abs(a.change24h);
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div className="flex flex-col h-full bg-dark-panel border border-dark-border/80 rounded-2xl overflow-hidden">
      {/* Search Input */}
      <div className="p-3 border-b border-dark-border/60 bg-dark-card/30">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border/80 focus:border-brand-green/50 rounded-xl py-1.5 pl-9 pr-4 text-xs placeholder:text-foreground/30 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-border/60 text-xs font-semibold bg-dark-card/20">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'trending'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Trending
        </button>
        <button
          onClick={() => setActiveTab('volume')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'volume'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Volume
        </button>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto divide-y divide-dark-border/40">
        {sortedTokens.length > 0 ? (
          sortedTokens.map((token) => {
            const isSelected = token.symbol === selectedToken.symbol;
            const isPositive = token.change24h >= 0;

            return (
              <div
                key={token.symbol}
                onClick={() => onSelectToken(token)}
                className={`flex items-center justify-between p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-brand-green/10 border-l-2 border-brand-green'
                    : 'hover:bg-dark-card/45'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Token logo */}
                  {token.logo ? (
                    <Image
                      src={token.logo}
                      alt={token.symbol}
                      width={32}
                      height={32}
                      className="rounded-full object-cover shadow-inner select-none bg-dark-bg"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-green to-brand-cyan flex items-center justify-center text-xs font-black text-white shadow-inner select-none">
                      {token.symbol.substring(0, 2)}
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-foreground/95">{token.symbol}</span>
                      {token.symbol === 'CHAD' && (
                        <span className="text-[8px] font-mono px-1 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/25">
                          CHAD
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-foreground/40 block mt-0.5 truncate max-w-[90px]">
                      {token.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-foreground/90">
                    ${token.price.toLocaleString(undefined, { minimumFractionDigits: token.price < 0.01 ? 6 : 2 })}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-medium mt-0.5 ${
                      isPositive ? 'text-brand-green' : 'text-brand-red'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {token.change24h}%
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-foreground/30">
            No tokens found
          </div>
        )}
      </div>
    </div>
  );
}
