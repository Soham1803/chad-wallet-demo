"use client";

import React, { useState } from "react";

export default function WithdrawModal({ isOpen, onClose, cashBalance, onUpdateCashBalance }: TWithdrawModalProps) {
  const [withdrawAmount, setWithdrawAmount] = useState(0);

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

        {/* Header Title */}
        <div className="relative flex items-center justify-center py-1">
          <span className="font-extrabold text-white text-base">
            Withdraw to crypto wallet
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4">
          
          {/* Input amount box */}
          <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-gray-500 text-lg font-bold font-mono select-none">$</span>
              <input 
                type="number"
                value={withdrawAmount === 0 ? "" : withdrawAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setWithdrawAmount(isNaN(val) ? 0 : val);
                }}
                placeholder="0"
                className="bg-transparent text-white text-xl font-bold font-mono focus:outline-none w-full placeholder:text-gray-700 min-w-0"
              />
            </div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider select-none shrink-0 ml-2">
              Enter amount
            </span>
          </div>

          {/* Percentage pills */}
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  const amount = parseFloat((cashBalance * (pct / 100)).toFixed(2));
                  setWithdrawAmount(amount);
                }}
                className="bg-[#12131a] hover:bg-[#1d2433] border border-[#1d2433]/70 rounded-lg py-2.5 text-center text-xs font-bold text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                {pct === 100 ? "Max" : `${pct}%`}
              </button>
            ))}
          </div>

          {/* Available balance row */}
          <div className="flex justify-between items-center text-[10.5px] font-bold px-1 mt-1">
            <span className="text-gray-500 uppercase tracking-wider">Available balance</span>
            <span className="text-white font-mono">${cashBalance.toFixed(2)}</span>
          </div>

          {/* Continue button */}
          <button 
            disabled={withdrawAmount <= 0 || withdrawAmount > cashBalance}
            onClick={() => {
              const remaining = parseFloat((cashBalance - withdrawAmount).toFixed(2));
              onUpdateCashBalance(remaining);
              alert(`Successfully withdrew $${withdrawAmount.toFixed(2)}!`);
              onClose();
              setWithdrawAmount(0);
            }}
            className={`w-full text-center py-3.5 rounded-lg text-xs font-extrabold transition-all select-none mt-2 ${
              withdrawAmount > 0 && withdrawAmount <= cashBalance
                ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer hover:shadow-lg hover:shadow-blue-900/10" 
                : "bg-[#1e1f29] text-gray-600 cursor-not-allowed"
            }`}
          >
            Continue
          </button>

        </div>

      </div>
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TWithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cashBalance: number;
  onUpdateCashBalance: (newVal: number) => void;
};
