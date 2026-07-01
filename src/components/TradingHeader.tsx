"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import {
  Search,
  Copy,
  ExternalLink,
  LogOut,
  Check,
  Wallet,
  Plus,
  Settings,
  User,
  EyeOff,
  Gift,
} from "lucide-react";
import { searchSolanaTokens, TTokenDetails } from "@/utils/solanaApi";
import Image from "next/image";

export default function TradingHeader() {
  const router = useRouter();
  const { login, logout, authenticated, user, ready } = usePrivy();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TTokenDetails[]>([]);
  const [blurBalances, setBlurBalances] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const activeWallet = user?.wallet?.address;
  const displayedResults = searchQuery.trim() ? searchResults : [];

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Debounced token search
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchSolanaTokens(searchQuery);
      setSearchResults(results.slice(0, 6));
      setIsSearching(false);
      setShowSearchResults(true);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowAvatarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        const searchInput = document.getElementById("header-search-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectToken = (token: TTokenDetails) => {
    setShowSearchResults(false);
    setSearchQuery("");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/trading?token=${token.mint}`);
      window.dispatchEvent(new Event("urlchange"));
    }
  };

  const handleCopyAddress = () => {
    if (activeWallet) {
      navigator.clipboard.writeText(activeWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchQuery(text);
      const searchInput = document.getElementById("header-search-input");
      searchInput?.focus();
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 px-4 bg-[#06070a] border-b border-[#161b26]/80 flex items-center justify-between select-none">
      {/* Left: FOMO Text Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="font-black text-2xl tracking-tighter text-white hover:text-white/90 transition-colors">
          ChadWallet
        </span>
      </Link>

      {/* Center: Search Bar */}
      <div ref={searchRef} className="relative w-full max-w-lg mx-4">
        <div className="relative flex items-center bg-[#0d0e12] border border-[#1d2433] hover:border-[#2d374d] rounded-md h-9 px-3 transition-colors">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            id="header-search-input"
            type="text"
            placeholder="Search for tokens or traders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchResults(displayedResults.length > 0)}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none h-full"
          />
          <button
            onClick={handlePaste}
            className="text-[10px] font-bold text-gray-500 hover:text-gray-300 bg-[#161a22] px-1.5 py-0.5 rounded border border-[#2d374d] transition-colors"
          >
            Paste
          </button>
          <span className="text-[10px] font-mono font-bold text-gray-600 border border-[#161a22] bg-[#0d0e12] px-1 rounded ml-1.5">
            /
          </span>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (displayedResults.length > 0 || isSearching) && (
          <div className="absolute top-10 left-0 w-full bg-[#0d0e12] border border-[#1d2433] rounded-md shadow-2xl overflow-hidden z-50">
            {isSearching ? (
              <div className="p-4 text-center text-xs text-gray-500 font-mono">
                Searching DexScreener Solana pools...
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-[#161b26]/50">
                {displayedResults.map((result) => (
                  <div
                    key={result.mint}
                    onClick={() => handleSelectToken(result)}
                    className="flex items-center justify-between p-3 hover:bg-[#161b26] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {result.logo ? (
                        <Image
                          src={result.logo}
                          alt={result.symbol}
                          width={28}
                          height={28}
                          unoptimized
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-[10px] font-black text-white">
                          {result.symbol.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm text-gray-200">
                            {result.symbol}
                          </span>
                          <span className="text-[9px] text-gray-500 truncate max-w-[150px]">
                            {result.name}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-gray-600">
                          {result.mint.slice(0, 6)}...{result.mint.slice(-4)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-gray-200">
                        $
                        {result.price < 0.001
                          ? result.price.toFixed(6)
                          : result.price.toFixed(3)}
                      </div>
                      <div
                        className={`text-[10px] font-mono ${result.change24h >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {result.change24h >= 0 ? "+" : ""}
                        {result.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Cash balance, Wallet state & Avatar */}
      <div className="flex items-center gap-4">
        {/* Deposit Cash Area */}
        <div className="flex flex-col items-end leading-tight text-right select-none">
          <span className={`text-xs font-mono font-bold text-gray-200 transition-all duration-150 ${blurBalances ? "blur-[4.5px] select-none" : ""}`}>
            $0.00 cash
          </span>
          <button className="text-[10px] font-bold text-[#0df294] hover:underline flex items-center gap-0.5 cursor-pointer">
            <Plus className="w-3 h-3" />
            Deposit more
          </button>
        </div>

        {/* Privy Connection Indicator & Avatar Dropdown */}
        {ready ? (
          !authenticated ? (
            <button
              onClick={login}
              className="px-4 py-1.5 rounded bg-[#0df294] text-black text-xs font-bold hover:bg-[#0df294]/90 active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              Connect Wallet
            </button>
          ) : (
            <div 
              ref={avatarRef}
              onMouseEnter={() => setShowAvatarDropdown(true)}
              onMouseLeave={() => setShowAvatarDropdown(false)}
              className="relative"
            >
              {/* Merged Trigger Pill */}
              <div className="flex items-center bg-[#0d0e12] hover:bg-[#161b26] border border-[#1d2433] rounded-md px-2 py-1 gap-2 cursor-pointer transition-colors duration-150 select-none">
                {/* Left: Balance block */}
                <div className={`flex items-center gap-1 text-[11px] font-mono text-gray-300 transition-all duration-150 ${blurBalances ? "blur-[4.5px] select-none" : ""}`}>
                  <span className="text-gray-200 font-bold">$0.00</span>
                  <span className="text-gray-600 font-bold">--</span>
                </div>

                {/* Right: Avatar bubble */}
                <div className="w-6 h-6 rounded-full border border-blue-500/80 bg-blue-950 flex items-center justify-center relative shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full border border-blue-400/80 flex items-center justify-center text-[8px] font-black text-blue-300 select-none font-mono">
                    F
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-0.2 border border-[#06070a] shadow">
                    <Check className="w-1.5 h-1.5 stroke-[4px]" />
                  </div>
                </div>
              </div>

              {/* Avatar Options Dropdown */}
              {showAvatarDropdown && (
                <div className="absolute top-[32px] right-0 w-[180px] bg-[#0c0d12] border border-[#1d2433] rounded-lg shadow-2xl p-2 z-50 text-[11px] text-gray-300 flex flex-col gap-1 font-mono transition-all duration-200 animate-fade-in">
                  
                  {/* Your Profile */}
                  <button 
                    onClick={() => {
                      setShowAvatarDropdown(false);
                      window.dispatchEvent(new Event("viewprofile"));
                    }}
                    className="flex items-center gap-2.5 w-full text-left p-2 rounded hover:bg-[#161b26] text-gray-300 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    <span>Your profile</span>
                  </button>

                  {/* Manage Account */}
                  <button 
                    onClick={() => {
                      setShowAvatarDropdown(false);
                      window.dispatchEvent(new Event("openmanageaccount"));
                    }}
                    className="flex items-center gap-2.5 w-full text-left p-2 rounded hover:bg-[#161b26] text-gray-300 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-gray-500" />
                    <span>Manage account</span>
                  </button>

                  {/* Blur Balances */}
                  <div className="flex items-center justify-between w-full p-2 rounded hover:bg-[#161b26] text-gray-300 transition-colors select-none">
                    <div className="flex items-center gap-2.5">
                      <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                      <span>Blur balances</span>
                    </div>
                    {/* Tiny Switch */}
                    <button 
                      onClick={() => setBlurBalances(!blurBalances)}
                      className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                        blurBalances ? "bg-[#0df294]" : "bg-gray-800"
                      }`}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                          blurBalances ? "translate-x-3" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Referrals */}
                  <button className="flex items-center gap-2.5 w-full text-left p-2 rounded hover:bg-[#161b26] text-gray-300 transition-colors cursor-pointer">
                    <Gift className="w-3.5 h-3.5 text-gray-500" />
                    <span>Referrals</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-[#1d2433] my-1"></div>

                  {/* Log Out */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 w-full text-left p-2 rounded hover:bg-rose-950/20 text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="w-20 h-8 rounded bg-[#0d0e12] border border-[#1d2433] animate-pulse"></div>
        )}
      </div>
    </header>
  );
}
