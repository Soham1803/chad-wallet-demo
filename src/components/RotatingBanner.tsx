import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchRealTokenPrices } from "@/utils/solanaApi";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import DEFAULT_TOKENS_JSON from "@/data/rotatingTokens.json";

export interface TokenTicker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  mint: string;
  decimals: number;
  logo?: string;
}

const DEFAULT_TOKENS: TokenTicker[] = DEFAULT_TOKENS_JSON;

interface RotatingBannerProps {
  reverse?: boolean;
}

export default function RotatingBanner({
  reverse = false,
}: RotatingBannerProps) {
  const router = useRouter();
  const { login, authenticated, ready } = usePrivy();
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
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return; // Do nothing on mobile
    }
    if (ready && !authenticated) {
      sessionStorage.setItem("shouldRedirectToTrading", "true");
      sessionStorage.setItem("shouldRedirectToTradingUrl", `/trading?token=${symbol}`);
      login();
    } else {
      router.push(`/trading?token=${symbol}`);
    }
  };

  // Duplicate items to ensure smooth infinite loop scroll
  const marqueeItems = [...tokens, ...tokens, ...tokens, ...tokens];

  return (
    <div className="w-full bg-dark-card border-y border-dark-border py-2 overflow-hidden flex select-none z-10">
      <div
        className={`flex whitespace-nowrap min-w-full shrink-0 gap-6 items-center ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {marqueeItems.map((token, idx) => {
          const isPositive = token.change24h >= 0;
          return (
            <div
              key={`${token.symbol}-${idx}`}
              onClick={() => handleTokenClick(token.symbol)}
              className="inline-flex items-center gap-2 bg-dark-bg/60 md:hover:bg-dark-panel md:hover:scale-105 border border-dark-border/40 md:hover:border-brand-green/40 px-3 py-1.5 rounded-full cursor-default md:cursor-pointer transition-all duration-200"
            >
              {/* Token Icon */}
              {token.logo ? (
                <Image
                  src={token.logo}
                  alt={token.symbol}
                  width={20}
                  height={20}
                  className="rounded-full object-cover shadow-sm select-none"
                />
              ) : (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                  {token.symbol.substring(0, 2)}
                </div>
              )}

              <span className="font-semibold text-xs text-foreground/90">
                {token.symbol}
              </span>

              <span className="text-xs text-foreground/50 font-mono">
                $
                {token.price.toLocaleString(undefined, {
                  minimumFractionDigits: token.price < 0.01 ? 6 : 2,
                })}
              </span>

              <span
                className={`inline-flex items-center text-[10px] font-mono font-medium ${
                  isPositive ? "text-brand-green" : "text-brand-red"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                )}
                {isPositive ? "+" : ""}
                {token.change24h}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
