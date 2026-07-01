"use client";

import React, { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";

export default function DepositModal({ isOpen, onClose, cashBalance, onUpdateCashBalance }: TDepositModalProps) {
  const [view, setView] = useState<"main" | "crypto">("main");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in select-none">
      {/* Modal Container */}
      <div className="relative w-full max-w-[420px] bg-[#0c0d12] border border-[#1d2433] rounded-xl shadow-2xl p-5 font-mono text-gray-300 flex flex-col gap-4">
        
        {/* Close button in top-right */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#0d0e12] border border-[#1d2433] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Title with Back Arrow if on crypto sub-view */}
        <div className="relative flex items-center justify-center py-1">
          {view !== "main" && (
            <button 
              onClick={() => setView("main")}
              className="absolute left-0 p-1 text-gray-400 hover:text-white cursor-pointer transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="font-extrabold text-white text-base">
            {view === "main" ? "Deposit with" : "Deposit Crypto"}
          </span>
        </div>

        {/* Conditionally render main options or crypto addresses */}
        {view === "main" ? (
          <div className="flex flex-col gap-3">
            {/* Crypto Deposit Card */}
            <div 
              onClick={() => setView("crypto")}
              className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-4 flex justify-between items-center hover:bg-[#161a24] transition-colors cursor-pointer group"
            >
              <div className="flex flex-col gap-1 text-left">
                <span className="text-white text-sm font-extrabold">Crypto</span>
                <span className="text-gray-500 text-[10.5px]">Transfer USDC from a crypto wallet</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
                <rect x="17" y="17" width="4" height="4" rx="0.5" />
              </svg>
            </div>

            {/* Credit or Debit Card */}
            <div className="bg-[#12131a]/40 border border-[#1d2433]/30 rounded-lg p-4 flex justify-between items-center opacity-65 select-none">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-gray-400 text-sm font-extrabold">Credit or debit</span>
                <span className="text-gray-600 text-[10.5px]">Coming soon!</span>
              </div>
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
        ) : (
          /* Crypto Address List for Deposit */
          <div className="flex flex-col gap-3">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center px-2">
              Copy address to send funds (SOL/USDC)
            </p>

            {/* Solana Card */}
            <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center text-left">
              <div className="flex flex-col gap-1 text-xs text-gray-455 font-bold min-w-0">
                <span>Solana address</span>
                <span className="text-white text-[10.5px] truncate font-bold select-all">B3u6D7X1w4pYWYQHDc7jmBm3Xs7MyydygkswvfDyQMzw</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("B3u6D7X1w4pYWYQHDc7jmBm3Xs7MyydygkswvfDyQMzw");
                  alert("Solana address copied!");
                }}
                className="p-1.5 text-gray-500 hover:text-white cursor-pointer transition-colors"
                title="Copy Address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Base Card */}
            <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center text-left">
              <div className="flex flex-col gap-1 text-xs text-gray-455 font-bold min-w-0">
                <span>Base address</span>
                <span className="text-white text-[10.5px] truncate font-bold select-all">0x68aB8972F46821dcCC6F1A66c9848D6582BA3464</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("0x68aB8972F46821dcCC6F1A66c9848D6582BA3464");
                  alert("Base address copied!");
                }}
                className="p-1.5 text-gray-500 hover:text-white cursor-pointer transition-colors"
                title="Copy Address"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Mock funding button for user demo convenience */}
            <button 
              onClick={() => {
                const newBal = parseFloat((cashBalance + 100).toFixed(2));
                onUpdateCashBalance(newBal);
                alert("Successfully received mock $100.00 USDC!");
                onClose();
              }}
              className="w-full bg-[#0df294] hover:bg-[#0df294]/90 text-black text-xs font-extrabold py-3 mt-1 rounded-lg cursor-pointer transition-all hover:shadow-lg hover:shadow-emerald-950/20"
            >
              Receive mock $100.00 USDC
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TDepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cashBalance: number;
  onUpdateCashBalance: (newVal: number) => void;
};
