"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";

export default function AccessDenied({ onLogin }: TAccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center bg-[#06070a]">
      <div className="w-full max-w-md p-6 text-center">
        {/* Neon Glow Lock Icon */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse"></div>
          <div className="w-20 h-20 rounded bg-[#0d0e12] border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10 relative">
            <Lock className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-xl font-extrabold tracking-wider uppercase mb-3 text-gray-200">
          Access Denied
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed mb-8">
          The trading terminal is secure. You must connect your Solana
          embedded wallet via Privy to view order books, live charts, and
          execute trades.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={onLogin}
            className="inline-flex items-center justify-center bg-[#0df294] text-black font-extrabold text-xs px-6 py-2.5 rounded shadow-lg hover:bg-[#0df294]/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#0d0e12] hover:bg-[#161b26] border border-[#161b26] hover:border-gray-700 text-gray-400 hover:text-gray-200 text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TAccessDeniedProps = {
  onLogin: () => void;
};
