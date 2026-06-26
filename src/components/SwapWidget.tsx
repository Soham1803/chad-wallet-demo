'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@/components/PrivyProviderWrapper';
import { TokenTicker } from './RotatingBanner';
import { ArrowUpDown, Settings2, ShieldCheck, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchJupiterQuote } from '@/utils/solanaApi';

interface SwapWidgetProps {
  token: TokenTicker;
  solBalance: number;
  tokenBalance: number;
  onTrade: (action: 'BUY' | 'SELL', token: TokenTicker, amountToken: number, amountSol: number) => void;
  solPrice?: number;
}

export default function SwapWidget({
  token,
  solBalance,
  tokenBalance,
  onTrade,
  solPrice = 142.45,
}: SwapWidgetProps) {
  const { login, authenticated, ready } = usePrivy();
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [slippage, setSlippage] = useState(1.0); // Default 1%
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync inputs based on active tab and rates
  const handleAmountFromChange = (val: string) => {
    setAmountFrom(val);
  };

  // Fetch real swap quotes from Jupiter API as the user types
  useEffect(() => {
    const numFrom = Number(amountFrom);
    if (isNaN(numFrom) || numFrom <= 0) {
      const t = setTimeout(() => setAmountTo(''), 0);
      return () => clearTimeout(t);
    }

    // Skip Jupiter calls if trading our mock CHAD token
    if (token.symbol === 'CHAD') {
      const rate = solPrice / token.price;
      const t = setTimeout(() => {
        if (activeTab === 'BUY') {
          setAmountTo((numFrom * rate).toFixed(4));
        } else {
          setAmountTo((numFrom / rate).toFixed(4));
        }
      }, 0);
      return () => clearTimeout(t);
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      const inputMint = activeTab === 'BUY' ? 'So11111111111111111111111111111111111111112' : token.mint;
      const outputMint = activeTab === 'BUY' ? token.mint : 'So11111111111111111111111111111111111111112';
      const inputDecimals = activeTab === 'BUY' ? 9 : token.decimals;
      const outputDecimals = activeTab === 'BUY' ? token.decimals : 9;

      const atomicAmount = Math.floor(numFrom * Math.pow(10, inputDecimals));

      const quote = await fetchJupiterQuote(inputMint, outputMint, atomicAmount, slippage * 100);
      setLoading(false);

      if (quote) {
        const outFloat = quote.outAmount / Math.pow(10, outputDecimals);
        setAmountTo(outFloat.toFixed(outputDecimals === 9 ? 6 : 4));
      }
    }, 500); // 500ms debounce to prevent API spamming

    return () => clearTimeout(delayDebounceFn);
  }, [amountFrom, token, activeTab, slippage, solPrice]);

  // Reset inputs when selected token or tab changes
  useEffect(() => {
    setTimeout(() => {
      setAmountFrom('');
      setAmountTo('');
    }, 0);
  }, [token, activeTab]);

  const handleSetMax = () => {
    if (activeTab === 'BUY') {
      // Leave a tiny bit of SOL for gas
      const maxSol = Math.max(0, solBalance - 0.005);
      handleAmountFromChange(maxSol.toString());
    } else {
      handleAmountFromChange(tokenBalance.toString());
    }
  };

  const handleExecuteSwap = async () => {
    const numFrom = Number(amountFrom);
    const numTo = Number(amountTo);
    if (!numFrom || numFrom <= 0) return;

    if (activeTab === 'BUY' && numFrom > solBalance) {
      alert('Insufficient SOL balance!');
      return;
    }

    if (activeTab === 'SELL' && numFrom > tokenBalance) {
      alert(`Insufficient ${token.symbol} balance!`);
      return;
    }

    setLoading(true);
    
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    
    // Trigger confetti burst on transaction success!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: activeTab === 'BUY' ? ['#10b981', '#8b5cf6', '#06b6d4'] : ['#ef4444', '#8b5cf6', '#ec4899'],
    });

    // Execute parent trade updates
    if (activeTab === 'BUY') {
      onTrade('BUY', token, numTo, numFrom);
    } else {
      onTrade('SELL', token, numFrom, numTo);
    }

    // Reset fields
    setAmountFrom('');
    setAmountTo('');
  };

  // Simple stats calculation for details box
  const numFrom = Number(amountFrom) || 0;
  const numTo = Number(amountTo) || 0;
  const rate = solPrice / token.price;
  const priceImpact = numFrom > 0 ? (numFrom > 50 ? '3.4%' : '0.12%') : '0.00%';

  return (
    <div className="bg-dark-panel border border-dark-border/80 rounded-2xl p-4 flex flex-col gap-4 relative">
      {/* Settings overlay toggle */}
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-sm tracking-wide text-foreground/80 uppercase font-mono">
          Execute Trade
        </span>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded-lg border transition-all ${
            showSettings 
              ? 'border-brand-green/40 text-brand-green bg-brand-green/5' 
              : 'border-dark-border text-foreground/40 hover:text-foreground/70 hover:bg-dark-card'
          }`}
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Slippage Settings Panel */}
      {showSettings && (
        <div className="bg-dark-card border border-dark-border rounded-xl p-3 text-xs space-y-3">
          <div className="font-semibold text-foreground/85">Max Slippage Settings</div>
          <div className="flex gap-2">
            {[0.5, 1.0, 3.0, 5.0].map((val) => (
              <button
                key={val}
                onClick={() => setSlippage(val)}
                className={`flex-1 py-1 rounded border transition-colors ${
                  slippage === val
                    ? 'border-brand-green text-brand-green bg-brand-green/5 font-bold'
                    : 'border-dark-border text-foreground/50 hover:bg-dark-panel'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
          <div className="text-[10px] text-foreground/40">
            Higher slippage protects swaps from failing during volatile price fluctuations but may result in less tokens received.
          </div>
        </div>
      )}

      {/* BUY / SELL Switch */}
      <div className="flex bg-dark-bg p-1 rounded-xl border border-dark-border/40">
        <button
          onClick={() => setActiveTab('BUY')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'BUY'
              ? 'bg-brand-green text-white shadow-md'
              : 'text-foreground/50 hover:text-foreground/80'
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setActiveTab('SELL')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'SELL'
              ? 'bg-brand-red text-white shadow-md'
              : 'text-foreground/50 hover:text-foreground/80'
          }`}
        >
          SELL
        </button>
      </div>

      {/* Input Group: FROM */}
      <div className="bg-dark-card border border-dark-border/60 rounded-xl p-3.5 space-y-2">
        <div className="flex justify-between items-center text-[10px] text-foreground/40 font-semibold">
          <span>PAY FROM</span>
          <span>
            Bal:{' '}
            {activeTab === 'BUY'
              ? `${solBalance.toFixed(4)} SOL`
              : `${tokenBalance.toLocaleString()} ${token.symbol}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="0.00"
            value={amountFrom}
            onChange={(e) => handleAmountFromChange(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent text-lg font-bold font-mono text-foreground/95 focus:outline-none placeholder:text-foreground/20"
          />
          <button
            onClick={handleSetMax}
            disabled={loading}
            className="px-2.5 py-1 rounded bg-brand-green/10 border border-brand-green/30 hover:border-brand-green/50 text-[10px] font-bold text-brand-green transition-all"
          >
            MAX
          </button>
          <span className="font-bold text-xs font-mono text-foreground/80 bg-dark-panel px-2.5 py-1.5 rounded border border-dark-border">
            {activeTab === 'BUY' ? 'SOL' : token.symbol}
          </span>
        </div>
      </div>

      {/* Center Switch Icon */}
      <div className="flex justify-center -my-2.5 relative z-10">
        <div className="w-7 h-7 rounded-full bg-dark-border border border-dark-panel flex items-center justify-center text-foreground/50 shadow-lg">
          <ArrowUpDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Input Group: TO */}
      <div className="bg-dark-card border border-dark-border/60 rounded-xl p-3.5 space-y-2">
        <div className="flex justify-between items-center text-[10px] text-foreground/40 font-semibold">
          <span>RECEIVE ESTIMATED</span>
          <span>
            Bal:{' '}
            {activeTab === 'BUY'
              ? `${tokenBalance.toLocaleString()} ${token.symbol}`
              : `${solBalance.toFixed(4)} SOL`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="0.00"
            value={amountTo}
            readOnly
            disabled={loading}
            className="flex-1 bg-transparent text-lg font-bold font-mono text-foreground/95 focus:outline-none placeholder:text-foreground/20"
          />
          <span className="font-bold text-xs font-mono text-foreground/80 bg-dark-panel px-2.5 py-1.5 rounded border border-dark-border">
            {activeTab === 'BUY' ? token.symbol : 'SOL'}
          </span>
        </div>
      </div>

      {/* Transaction details box */}
      {numFrom > 0 && (
        <div className="bg-dark-card/30 border border-dark-border/40 rounded-xl p-3 text-[10px] text-foreground/50 font-mono space-y-1.5">
          <div className="flex justify-between">
            <span>Rate</span>
            <span>
              1 SOL = {rate < 1 ? rate.toFixed(6) : rate.toFixed(2)} {token.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Price Impact</span>
            <span className={numFrom > 50 ? 'text-yellow-500 font-bold' : 'text-brand-green'}>
              {priceImpact}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee</span>
            <span>0.000005 SOL</span>
          </div>
          <div className="flex justify-between border-t border-dark-border/30 pt-1.5 mt-1.5 text-foreground/75 font-semibold">
            <span>Estimated Value</span>
            <span>
              ${(activeTab === 'BUY' ? numFrom * solPrice : numTo * solPrice).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Action CTA Button */}
      {!ready ? (
        <div className="w-full h-12 rounded-xl bg-dark-card border border-dark-border animate-pulse"></div>
      ) : !authenticated ? (
        <button
          onClick={login}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-green to-brand-cyan text-white font-bold text-sm shadow-lg hover:shadow-brand-green/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet to Trade
        </button>
      ) : (
        <button
          onClick={handleExecuteSwap}
          disabled={loading || numFrom <= 0}
          className={`w-full h-12 rounded-xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            loading || numFrom <= 0
              ? 'bg-dark-card text-foreground/20 border border-dark-border cursor-not-allowed'
              : activeTab === 'BUY'
              ? 'bg-brand-green hover:shadow-brand-green/20 text-white hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-brand-red hover:shadow-brand-red/20 text-white hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : activeTab === 'BUY' ? (
            `BUY ${token.symbol}`
          ) : (
            `SELL ${token.symbol}`
          )}
        </button>
      )}

      {/* Safe execution tag */}
      <div className="flex items-center justify-center gap-1 text-[9px] text-foreground/30 font-semibold uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
        Secured routing by Jupiter aggregator
      </div>
    </div>
  );
}
