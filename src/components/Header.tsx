"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { AppleAppLink, GooglePlayAppLink } from "./MobileAppLinks";
import useResponsive from "@/hooks/useResponsive";

export default function Header() {
  const pathname = usePathname();
  const { login, logout, authenticated, user, ready } = usePrivy();

  const { isMobile } = useResponsive();
  const isTradingPage = pathname === "/trading";

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const activeWallet = user?.wallet?.address;

  // Redirection check: if user is authenticated and lands on homepage, push to trading (desktop only)
  React.useEffect(() => {
    if (ready && authenticated && pathname === "/" && !isMobile) {
      window.location.replace("/trading");
    }
  }, [ready, authenticated, pathname, isMobile]);

  return (
    <header className="sticky top-0 z-40 w-full h-16 px-4 md:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <Image
          src="/logos/dark.png"
          alt="ChadWallet"
          width={45}
          height={45}
          className="rounded-full"
        />
        <span className="font-extrabold text-3xl tracking-wider text-brand">
          ChadWallet
        </span>
      </Link>

      {/* Navigation & Auth */}
      <div className="hidden md:flex w-1/2 h-full items-center justify-end gap-4">
        {/* Mobile Download Links */}
        {!isTradingPage && (
          <div className="flex w-72 h-full items-center justify-between">
            <AppleAppLink />
            <GooglePlayAppLink />
          </div>
        )}

        {/* Privy Login/Profile Button */}
        {ready ? (
          !authenticated ? (
            <button
              onClick={login}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0f0f0f] text-white text-base font-bold hover:shadow-lg hover:shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-panel border border-dark-border text-xs font-mono text-foreground/90">
                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
                <span>
                  {activeWallet
                    ? formatAddress(activeWallet)
                    : user?.email?.address || "Connected"}
                </span>
              </div>
              <button
                onClick={logout}
                title="Disconnect"
                className="p-1.5 rounded-lg bg-dark-card hover:bg-brand-red/10 border border-dark-border hover:border-brand-red/40 text-foreground/60 hover:text-brand-red transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )
        ) : (
          <div className="w-20 h-9 rounded-lg bg-dark-card border border-dark-border animate-pulse"></div>
        )}
      </div>
    </header>
  );
}
