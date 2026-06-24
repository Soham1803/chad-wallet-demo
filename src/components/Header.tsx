'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@/components/PrivyProviderWrapper';
import { Wallet, LogOut, Download, BarChart2 } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { login, logout, authenticated, user, ready } = usePrivy();

  const isTradingPage = pathname === '/trading';

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const activeWallet = user?.wallet?.address;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-dark-border/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-green to-brand-cyan flex items-center justify-center font-black text-white text-base shadow-lg shadow-brand-green/20 group-hover:scale-105 transition-transform duration-200">
          C
          <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
        <span className="font-extrabold text-lg tracking-wider text-gradient uppercase font-mono">
          ChadWallet
        </span>
      </Link>

      {/* Navigation & Auth */}
      <div className="flex items-center gap-4">
        {/* Trading Dashboard Shortcut */}
        {!isTradingPage ? (
          <Link
            href="/trading"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-green/30 text-xs font-semibold text-brand-green bg-brand-green/5 hover:bg-brand-green/10 hover:border-brand-green/50 transition-all duration-200"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Trade Now
          </Link>
        ) : (
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-border text-xs font-semibold text-foreground/75 hover:text-foreground hover:bg-dark-card transition-all duration-200"
          >
            Home
          </Link>
        )}

        {/* Mobile Download Link */}
        <a
          href="#download-apps"
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-dark-panel transition-all duration-200"
        >
          <Download className="w-3.5 h-3.5" />
          Get App
        </a>

        {/* Privy Login/Profile Button */}
        {ready ? (
          authenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-panel border border-dark-border text-xs font-mono text-foreground/90">
                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                <span>{activeWallet ? formatAddress(activeWallet) : (user?.email?.address || 'Connected')}</span>
              </div>
              <button
                onClick={logout}
                title="Disconnect"
                className="p-1.5 rounded-lg bg-dark-card hover:bg-brand-red/10 border border-dark-border hover:border-brand-red/40 text-foreground/60 hover:text-brand-red transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-green to-brand-cyan text-white text-xs font-bold hover:shadow-lg hover:shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          )
        ) : (
          <div className="w-28 h-9 rounded-lg bg-dark-card border border-dark-border animate-pulse"></div>
        )}
      </div>
    </header>
  );
}
