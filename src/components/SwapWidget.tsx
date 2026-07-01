"use client";

import React, { useState } from "react";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import { TTokenDetails } from "@/utils/solanaApi";
import { Settings, Wallet } from "lucide-react";
import confetti from "canvas-confetti";

export default function SwapWidget({
  token,
  solBalance,
  tokenBalance,
  onTrade,
  solPrice = 142.45,
}: TSwapWidgetProps) {
  const { login, authenticated, ready } = usePrivy();
  const [activeTab, setActiveTab] = useState<"BUY" | "SELL">("BUY");
  const [amountInput, setAmountInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState(1.0); // Default 1%
  const [loading, setLoading] = useState(false);

  // Sync amount estimates
  const getEstimatedReturn = () => {
    const num = Number(amountInput);
    if (isNaN(num) || num <= 0) return 0;

    if (activeTab === "BUY") {
      // Input is in USD, calculate token returned
      return num / token.price;
    } else {
      // Input is in token units, calculate SOL returned
      return (num * token.price) / solPrice;
    }
  };

  // Preset click handlers
  const handleBuyPreset = (usdAmount: number) => {
    setAmountInput(usdAmount.toString());
  };

  const handleSellPreset = (percentage: number) => {
    const calculated = (tokenBalance * percentage) / 100;
    setAmountInput(calculated.toFixed(0));
  };

  const handleExecuteSwap = async () => {
    const numInput = Number(amountInput);
    if (!numInput || numInput <= 0) return;

    if (activeTab === "BUY") {
      const solRequired = numInput / solPrice;
      if (solRequired > solBalance) {
        alert("Insufficient SOL balance!");
        return;
      }

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);

      // Success confetti!
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { x: 0.85, y: 0.4 },
        colors: ["#0df294", "#3b82f6", "#ffffff"],
      });

      const tokensToReceive = numInput / token.price;
      onTrade("BUY", token, tokensToReceive, solRequired);
      setAmountInput("");
    } else {
      if (numInput > tokenBalance) {
        alert(`Insufficient ${token.symbol} balance!`);
        return;
      }

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);

      // Sell confetti (red/white)
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { x: 0.85, y: 0.4 },
        colors: ["#ef4444", "#3b82f6", "#ffffff"],
      });

      const solToReceive = (numInput * token.price) / solPrice;
      onTrade("SELL", token, numInput, solToReceive);
      setAmountInput("");
    }
  };

  const estimatedValue = getEstimatedReturn();

  return (
    <div className="bg-background border border-[#161b26]/80 rounded p-4 flex flex-col font-mono text-xs select-none">
      {/* 1. Buy/Sell Tabs */}
      <div className="flex bg-[#0d0e12] rounded p-0.5 border border-[#161b26]/50 mb-4 h-10">
        <button
          onClick={() => {
            setActiveTab("BUY");
            setAmountInput("");
          }}
          className={`flex-1 font-bold text-xs rounded transition-all cursor-pointer flex items-center justify-center ${
            activeTab === "BUY"
              ? "bg-[#11241a] text-[#0df294] border border-[#0df294]/30"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => {
            setActiveTab("SELL");
            setAmountInput("");
          }}
          className={`flex-1 font-bold text-xs rounded transition-all cursor-pointer flex items-center justify-center ${
            activeTab === "SELL"
              ? "bg-[#2c1518] text-rose-500 border border-rose-500/30"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Sell
        </button>
      </div>

      {/* 2. Amount Input Box */}
      <div className="bg-[#0d0e12] border border-[#161b26] rounded p-3 mb-3 flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center text-gray-200 text-lg font-bold w-1/2">
            {activeTab === "BUY" && <span className="mr-0.5 text-gray-500">$</span>}
            <input
              type="text"
              placeholder="0"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              disabled={loading}
              className="bg-transparent text-xl font-bold text-gray-150 focus:outline-none w-full placeholder-gray-700"
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase font-mono tracking-wider select-none shrink-0">
            Enter amount
          </span>
        </div>
      </div>

      {/* 3. Preset Quick Buttons & Settings Gear */}
      <div className="flex items-center gap-1.5 mb-3">
        {activeTab === "BUY" ? (
          <>
            <button
              onClick={() => handleBuyPreset(10)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              $10
            </button>
            <button
              onClick={() => handleBuyPreset(100)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              $100
            </button>
            <button
              onClick={() => handleBuyPreset(500)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              $500
            </button>
            <button
              onClick={() => handleBuyPreset(1000)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              $1000
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleSellPreset(0)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              Min
            </button>
            <button
              onClick={() => handleSellPreset(25)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              25%
            </button>
            <button
              onClick={() => handleSellPreset(50)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              50%
            </button>
            <button
              onClick={() => handleSellPreset(75)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              75%
            </button>
            <button
              onClick={() => handleSellPreset(100)}
              className="flex-1 py-2 rounded bg-[#0d0e12] border border-[#161b26] hover:border-gray-700 text-gray-300 font-bold text-[10px] transition-all cursor-pointer"
            >
              Max
            </button>
          </>
        )}

        {/* Slippage toggle settings button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded border bg-[#0d0e12] transition-all shrink-0 cursor-pointer ${
            showSettings ? "border-[#0df294]/45 text-[#0df294]" : "border-[#161b26] text-gray-500 hover:text-gray-300 hover:border-gray-700"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Slippage Panel */}
      {showSettings && (
        <div className="bg-[#0d0e12] border border-[#161b26] rounded p-2.5 mb-3 flex flex-col gap-2">
          <div className="text-[10px] font-bold text-gray-400">Max Slippage %</div>
          <div className="flex gap-1.5">
            {[0.5, 1.0, 3.0, 5.0].map((val) => (
              <button
                key={val}
                onClick={() => setSlippage(val)}
                className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                  slippage === val ? "bg-[#11241a] border-[#0df294]/30 text-[#0df294]" : "border-[#161b26] text-gray-500 hover:bg-[#161b26]"
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Wallet Balance Info */}
      <div className="text-gray-500 text-[10px] font-bold flex justify-between items-center mb-3">
        <span>
          {activeTab === "BUY" ? (
            `${solBalance.toFixed(2)} SOL available`
          ) : (
            `${tokenBalance.toLocaleString()} ${token.symbol} available`
          )}
        </span>
        {amountInput && estimatedValue > 0 && (
          <span className="text-gray-400 font-mono">
            Est: {activeTab === "BUY" ? `${estimatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${token.symbol}` : `${estimatedValue.toFixed(4)} SOL`}
          </span>
        )}
      </div>

      {/* 5. CTA Trigger Button */}
      {!ready ? (
        <div className="w-full h-11 bg-[#0d0e12] border border-[#161b26] rounded animate-pulse"></div>
      ) : !authenticated ? (
        <button
          onClick={login}
          className="w-full h-11 bg-[#0df294] text-black font-extrabold rounded hover:bg-[#0df294]/90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg"
        >
          <Wallet className="w-4 h-4 text-black stroke-[3px]" />
          Connect Wallet to Trade
        </button>
      ) : (
        <button
          onClick={handleExecuteSwap}
          disabled={loading || !amountInput || Number(amountInput) <= 0}
          className={`w-full h-11 font-extrabold rounded transition-all cursor-pointer flex items-center justify-center shadow-lg ${
            loading || !amountInput || Number(amountInput) <= 0
              ? "bg-[#0d0e12] text-gray-700 border border-[#161b26] cursor-not-allowed"
              : activeTab === "BUY"
              ? "bg-[#0df294] text-black hover:bg-[#0df294]/90 active:scale-[0.98]"
              : "bg-rose-600 text-white hover:bg-rose-500 active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
          ) : activeTab === "BUY" ? (
            `Buy ${token.symbol}`
          ) : (
            `Sell ${token.symbol}`
          )}
        </button>
      )}
    </div>
  );
}

type TSwapWidgetProps = {
  token: TTokenDetails;
  solBalance: number;
  tokenBalance: number;
  onTrade: (
    action: "BUY" | "SELL",
    token: TTokenDetails,
    amountToken: number,
    amountSol: number,
  ) => void;
  solPrice?: number;
};
