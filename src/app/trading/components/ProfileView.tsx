"use client";

import React from "react";
import { Check, Gift } from "lucide-react";

export default function ProfileView({ cashBalance }: TProfileViewProps) {
  return (
    <div className="flex-1 h-full flex flex-col bg-[#010204] overflow-y-auto p-4 gap-4 scrollbar-none font-mono text-gray-300 border-r border-[#161b26]/80 animate-fade-in">
      {/* Hero Banner Area */}
      <div className="relative rounded-lg bg-[#0d0e12] border border-[#1d2433] p-5 flex flex-col gap-8 select-none">
        {/* Banner Background mock */}
        <div className="h-24 w-full rounded bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-[#1d2433]/50 relative overflow-hidden">
          <button
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-gray-800 text-gray-400 hover:text-white cursor-pointer transition-colors"
            title="Edit banner"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>

        {/* Profile Details Row */}
        <div className="flex justify-between items-end -mt-12 px-2">
          <div className="flex items-end gap-3.5">
            {/* Large Avatar */}
            <div className="w-16 h-16 rounded-full border-4 border-[#0c0d12] bg-blue-950 flex items-center justify-center relative shrink-0 shadow-lg">
              <div className="w-9 h-9 rounded-full border border-blue-400/80 flex items-center justify-center text-lg font-black text-blue-300 select-none">
                F
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border border-[#0c0d12] shadow">
                <Check className="w-2.5 h-2.5 stroke-[4px]" />
              </div>
            </div>

            {/* Name and Tags */}
            <div className="flex flex-col mb-1 leading-normal">
              <span className="text-sm font-extrabold text-gray-200">
                ChiefTestySlug
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">
                @ChiefTestySlug
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-1">
            <div className="text-right mr-3 leading-normal">
              <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
                <div>
                  <span className="text-gray-100 mr-1 text-sm font-extrabold">
                    0
                  </span>
                  <span className="text-gray-500 font-medium">
                    Following
                  </span>
                </div>
                <div>
                  <span className="text-gray-100 mr-1 text-sm font-extrabold">
                    0
                  </span>
                  <span className="text-gray-500 font-medium">
                    Followers
                  </span>
                </div>
              </div>
            </div>

            <button className="px-3.5 py-1.5 rounded-md border border-[#1d2433] bg-[#0d0e12] hover:bg-[#161b26] text-gray-200 text-[10px] font-extrabold hover:text-white cursor-pointer transition-colors">
              Edit profile
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("openreferrals"))}
              className="p-2 rounded-md border border-[#1d2433] bg-[#0d0e12] hover:bg-[#161b26] text-gray-400 hover:text-white cursor-pointer transition-colors"
              title="Referrals"
            >
              <Gift className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Badges details */}
        <div className="flex items-center gap-5 text-[10px] text-gray-500 font-bold px-2 pt-2 border-t border-[#161b26]/50">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">🕒</span>
            No hold time
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">🔄</span>0 trades
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">📅</span>
            Joined Jun 2026
          </div>
        </div>
      </div>

      {/* Main Stats Grid Column layouts */}
      <div className="flex-1 grid grid-cols-5 gap-4 min-h-0">
        {/* Left Sub-column: Performance & Balances (Col-span 2) */}
        <div className="col-span-2 flex flex-col gap-4 min-h-0">
          {/* PnL Card */}
          <div className="rounded-lg bg-[#0d0e12] border border-[#1d2433] p-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="leading-tight">
                <span className="text-2xl font-black text-gray-150 font-mono">
                  $0.00
                </span>
                <span className="text-[10px] text-emerald-500 font-bold block mt-1">
                  +$0 24h
                </span>
              </div>
              {/* Period pills */}
              <div className="flex gap-1 text-[9px] font-bold text-gray-500 bg-black/40 rounded p-0.5 border border-[#161b26]/50">
                {["24H", "7D", "30D", "ALL"].map((p) => (
                  <button
                    key={p}
                    className={`px-2 py-0.5 rounded transition-colors ${p === "24H" ? "bg-[#1d2433] text-gray-200 border border-gray-700/50" : "hover:text-gray-300"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Empty Chart performance mock */}
            <div className="h-28 w-full border border-[#161b26]/40 bg-black/25 rounded relative flex items-center justify-center overflow-hidden">
              <div className="absolute left-0 right-0 h-0.5 bg-[#0df294]/80 shadow-[0_0_8px_#0df294]"></div>
            </div>

            {/* Cash balance row */}
            <div className="flex items-center justify-between bg-black/20 p-2.5 rounded border border-[#161b26]/50 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-base text-gray-500">💰</span>
                <div className="leading-tight flex flex-col">
                  <span className="text-[9px] text-gray-500 font-bold uppercase">
                    Cash balance
                  </span>
                  <span className="text-sm font-extrabold text-gray-200">
                    ${cashBalance.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.dispatchEvent(new Event("openwithdraw"))}
                  className="px-3 py-1.5 rounded border border-[#1d2433] bg-[#0d0e12] text-gray-400 hover:text-gray-200 text-[10px] font-extrabold cursor-pointer"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => window.dispatchEvent(new Event("opendeposit"))}
                  className="px-3 py-1.5 rounded bg-[#2563eb] hover:bg-blue-600 text-white text-[10px] font-extrabold cursor-pointer"
                >
                  Deposit
                </button>
              </div>
            </div>
          </div>

          {/* Positions Card */}
          <div className="rounded-lg bg-[#0d0e12] border border-[#1d2433] p-4 flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex justify-between items-center pb-2 border-b border-[#161b26]/50">
              <span className="text-[11px] font-black text-gray-200 uppercase tracking-wider">
                Your positions
              </span>
              <div className="flex gap-1 text-[9px] font-bold text-gray-500 bg-black/40 rounded p-0.5 border border-[#161b26]/50">
                {["Recent", "Open", "Closed"].map((p) => (
                  <button
                    key={p}
                    className={`px-2 py-0.5 rounded transition-colors ${p === "Closed" ? "bg-[#1d2433] text-gray-200 border border-gray-700/50" : "hover:text-gray-300"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center text-[10px] text-gray-600 italic">
              No closed positions
            </div>
          </div>
        </div>

        {/* Right Sub-column: Trades/Swaps List (Col-span 3) */}
        <div className="col-span-3 rounded-lg bg-[#0d0e12] border border-[#1d2433] p-4 flex flex-col gap-3 min-h-0">
          <div className="flex items-center gap-4 pb-2 border-b border-[#161b26]/50 text-[10px] font-bold text-gray-500">
            {["All swaps", "Buys", "Sells"].map((t) => (
              <button
                key={t}
                className={`pb-1 transition-colors relative ${t === "All swaps" ? "text-white border-b border-white font-black" : "hover:text-gray-300"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Swaps Table Headers */}
          <div className="grid grid-cols-5 text-[9px] font-bold text-gray-500 px-2 py-1 bg-black/20 rounded border border-[#161b26]/40 uppercase tracking-wider">
            <span>Token</span>
            <span>Action</span>
            <span>Amount</span>
            <span>MCap</span>
            <span className="text-right">Time</span>
          </div>

          {/* Table Body Empty representation */}
          <div className="flex-1 flex items-center justify-center text-[10px] text-gray-600 italic">
            No trades yet
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TProfileViewProps = {
  cashBalance: number;
};
