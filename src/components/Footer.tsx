import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-dark-card border-t border-dark-border/80 px-4 md:px-8 py-4 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-wide text-gradient uppercase font-mono">
            ChadWallet
          </span>
          <span className="text-[10px] bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded-full font-mono">
            v1.0.0
          </span>
        </div>
        <span className="text-[11px] text-foreground/20 font-mono hidden sm:inline">|</span>
        <p className="text-[11px] text-foreground/45">
          © {new Date().getFullYear()} ChadWallet. Built for chads on Solana.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-xs text-foreground/60">
        <a
          href="https://apps.apple.com/us/app/chadwallet/id6757367474"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-cyan transition-colors duration-150"
        >
          App Store (iOS)
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-green transition-colors duration-150"
        >
          Play Store (Android)
        </a>
        <a
          href="#"
          className="hover:text-foreground transition-colors duration-150"
        >
          Terms of Service
        </a>
        <a
          href="#"
          className="hover:text-foreground transition-colors duration-150"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
