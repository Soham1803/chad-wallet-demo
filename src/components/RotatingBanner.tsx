import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { fetchRealTokenPrices } from '@/utils/solanaApi';

export interface TokenTicker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  mint: string;
  decimals: number;
  logo?: string;
}

// Pre-defined Solana tokens with real-world decimals and addresses
const DEFAULT_TOKENS: TokenTicker[] = [
  { symbol: 'SOL', name: 'Solana', price: 142.45, change24h: 5.34, mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'CHAD', name: 'ChadWallet Token', price: 0.0425, change24h: 15.42, mint: 'CHADxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', decimals: 9 },
  { symbol: 'BONK', name: 'Bonk', price: 0.00002134, change24h: -2.15, mint: 'DezXAZ8z7PnrFcPykJzbO5JHcUqpHE8GDJEDgimOBBN', decimals: 5 },
  { symbol: 'WIF', name: 'dogwifhat', price: 2.12, change24h: 12.85, mint: 'EKpQGSJtjMFqKZ9KQGWjzD4WCo4PDaf8dZVWudqwm1W7', decimals: 6 },
  { symbol: 'POPCAT', name: 'Popcat', price: 0.824, change24h: -4.32, mint: '7GCihJUkKEFW2MkyCcLrC2j221uJWo95bSdWfzcrd2K7', decimals: 6 },
  { symbol: 'JUP', name: 'Jupiter', price: 0.785, change24h: 1.45, mint: 'JUPyiwrYd2CQCChjJUiKVtH7jEEJ22u2w7j6r2FmWZq', decimals: 6 },
  { symbol: 'MEW', name: 'cat in a dogs world', price: 0.00412, change24h: 8.76, mint: 'MEW143a5742Cn6SZ8ssz7M5D1AL2ey3tA9G9G1N7R', decimals: 6 },
  { symbol: 'BOME', name: 'BOOK OF MEME', price: 0.00845, change24h: -0.84, mint: 'uk3wueUrw3u8Htxu4mGWiEwNeLJTfTvCnSfCcSCL67E', decimals: 6 },
];

interface RotatingBannerProps {
  reverse?: boolean;
}

export default function RotatingBanner({ reverse = false }: RotatingBannerProps) {
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenTicker[]>(DEFAULT_TOKENS);

  // Fetch real-time token prices and changes from DexScreener
  useEffect(() => {
    const updatePrices = async () => {
      setTokens((prev) => {
        fetchRealTokenPrices(prev).then((updated) => {
          setTokens(updated);
        });
        return prev;
      });
    };

    updatePrices(); // Initial load
    const interval = setInterval(updatePrices, 15000); // Polling every 15s

    return () => clearInterval(interval);
  }, []);

  const handleTokenClick = (symbol: string) => {
    router.push(`/trading?token=${symbol}`);
  };

  // Duplicate items to ensure smooth infinite loop scroll
  const marqueeItems = [...tokens, ...tokens, ...tokens, ...tokens];

  return (
    <div className="w-full bg-dark-card border-y border-dark-border py-2 overflow-hidden flex select-none">
      <div
        className={`flex whitespace-nowrap min-w-full shrink-0 gap-6 items-center ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {marqueeItems.map((token, idx) => {
          const isPositive = token.change24h >= 0;
          return (
            <div
              key={`${token.symbol}-${idx}`}
              onClick={() => handleTokenClick(token.symbol)}
              className="inline-flex items-center gap-2 bg-dark-bg/60 hover:bg-dark-panel hover:scale-105 border border-dark-border/40 hover:border-brand-green/40 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
            >
              {/* Token Icon Placeholder */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-green to-brand-cyan flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                {token.symbol.substring(0, 2)}
              </div>
              
              <span className="font-semibold text-xs text-foreground/90">{token.symbol}</span>
              
              <span className="text-xs text-foreground/50 font-mono">
                ${token.price.toLocaleString(undefined, { minimumFractionDigits: token.price < 0.01 ? 6 : 2 })}
              </span>

              <span
                className={`inline-flex items-center text-[10px] font-mono font-medium ${
                  isPositive ? 'text-brand-green' : 'text-brand-red'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {isPositive ? '+' : ''}
                {token.change24h}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
