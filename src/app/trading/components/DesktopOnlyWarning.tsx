"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TradingHeader from "@/components/TradingHeader";
import { AppleAppLink, GooglePlayAppLink } from "@/components/MobileAppLinks";

export default function DesktopOnlyWarning() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#06070a] text-foreground font-mono">
      <TradingHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
          <div className="w-20 h-20 rounded bg-[#0d0e12] border border-[#1d2433] flex items-center justify-center text-cyan-450 shadow-lg shadow-cyan-500/10 relative">
            <span className="text-3xl">💻</span>
          </div>
        </div>

        <h1 className="text-xl font-extrabold tracking-wider uppercase mb-4 text-gray-200">
          Desktop Only
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed mb-8">
          The ChadWallet trading terminal is optimized for desktop trading
          layouts. Please switch to a desktop browser or download our mobile
          app.
        </p>

        <div className="bg-[#0d0e12] border border-[#161b26] rounded p-5 w-full flex flex-col items-center gap-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Get the Mobile App
          </p>
          <div className="flex flex-col gap-3 w-full">
            <AppleAppLink />
            <GooglePlayAppLink />
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 text-xs text-[#0df294] font-bold hover:underline flex items-center gap-2 cursor-pointer"
        >
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
}
