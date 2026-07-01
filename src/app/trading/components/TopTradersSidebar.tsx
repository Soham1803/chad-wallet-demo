"use client";

import React from "react";
import Image from "next/image";

const TOP_TRADERS = [
  {
    name: "Dip Wheeler",
    username: "@DipWheeler",
    avatar:
      "https://cdn.dexscreener.com/cms/images/bf05934beb55942758e6a85cfd2800dc8170b799eec87da9611c769f8ff81b57?width=800&height=800&quality=95&format=auto",
  },
  { name: "PoorGoat", username: "@PoorGoat_", avatar: "" },
  { name: "DumbCrayonEater", username: "@DumbCrayonEater", avatar: "" },
  { name: "Vee", username: "@theveeman", avatar: "" },
  { name: "RUNE", username: "@RuneCrypto_", avatar: "" },
  { name: "techquant", username: "@techquant", avatar: "" },
  { name: "BinkBinkBink", username: "@BinkBinkBink", avatar: "" },
  { name: "Zinc", username: "@zinceth", avatar: "" },
  { name: "needledger", username: "@needledger", avatar: "" },
  { name: "CJ", username: "@carljohnson", avatar: "" },
];

export default function TopTradersSidebar() {
  return (
    <div className="w-[360px] h-full shrink-0 flex flex-col bg-[#06070a] p-4 gap-4 scrollbar-none font-mono border-l border-[#161b26]/80 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#161b26]/80">
        <div className="flex items-center gap-2">
          <span className="text-sm">👤</span>
          <span className="text-xs font-black text-gray-200 uppercase tracking-wider">
            Follow top traders
          </span>
        </div>
      </div>

      {/* Traders List */}
      <div className="flex-1 flex flex-col divide-y divide-[#161b26]/20">
        {TOP_TRADERS.map((trader) => (
          <div
            key={trader.username}
            className="flex items-center justify-between py-3"
          >
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-3 min-w-0">
              {trader.avatar ? (
                <Image
                  src={trader.avatar}
                  alt={trader.name}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-8 h-8 rounded-full object-cover shrink-0 select-none"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {trader.name.substring(0, 2)}
                </div>
              )}
              <div className="min-w-0 leading-tight">
                <span className="text-xs font-bold text-gray-200 block truncate">
                  {trader.name}
                </span>
                <span className="text-[9px] text-gray-500 block truncate">
                  {trader.username}
                </span>
              </div>
            </div>

            {/* Right: Follow Button */}
            <button className="px-3.5 py-1 rounded bg-[#2563eb] hover:bg-blue-600 text-white text-[10px] font-extrabold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer select-none">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
