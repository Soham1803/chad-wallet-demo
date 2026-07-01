"use client";

import React from "react";
import { Gift, Copy } from "lucide-react";

export default function ReferralsModal({ isOpen, onClose }: TReferralsModalProps) {
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
            Referrals
          </span>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col items-center select-none">
          <span className="text-4xl font-extrabold text-white text-center mt-2">
            $0
          </span>
          <span className="text-[10px] text-gray-500 font-bold text-center uppercase tracking-wider mb-5">
            Total earned rewards
          </span>

          {/* Earn Banner Container */}
          <div className="w-full bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-4">
            {/* Banner top pill */}
            <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wide">
              <Gift className="w-3.5 h-3.5" />
              Earn 25% of your friends&apos; fees
            </div>

            {/* Left/Right Split */}
            <div className="grid grid-cols-2 divide-x divide-indigo-500/20 text-center font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-extrabold text-white">$0</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Earned last 7d</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-extrabold text-white">0</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">Friends referred</span>
              </div>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="w-full flex items-center justify-between bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 mt-4">
            <span className="text-white text-xs select-all font-mono font-bold truncate">
              chadwallet.io/r/ChiefTestySlug
            </span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText("chadwallet.io/r/ChiefTestySlug");
                alert("Referral link copied!");
              }}
              className="p-1 text-gray-400 hover:text-white cursor-pointer transition-colors shrink-0"
              title="Copy Referral Link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-gray-500 font-bold text-center mt-4 leading-relaxed">
            Invite your friends to start earning 25% of their trading fees.
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TReferralsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
