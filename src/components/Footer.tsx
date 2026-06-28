import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-dark-card border-t border-dark-border/80 px-6 md:px-8 py-12 mt-auto flex flex-col md:flex-row justify-between gap-8 md:gap-4">
      <div className="flex flex-col justify-center md:justify-start gap-3">
        <div className="flex flex-col items-start gap-2">
          <span className="font-bold text-3xl md:text-4xl tracking-wide uppercase font-mono">
            ChadWallet
          </span>
          <span className="font-semibold text-lg md:text-xl tracking-wide text-gray-400 font-mono">
            Where the Chads trade.
          </span>
        </div>

        <p className="text-[11px] text-foreground/45">
          © {new Date().getFullYear()} ChadWallet
        </p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-start md:items-end justify-start md:justify-end gap-8 md:gap-6 text-xs text-foreground/60">
        <div className="flex flex-col gap-2 min-w-[100px]">
          <span className="text-gray-400 text-sm uppercase font-semibold">SOCIAL</span>
          <a
            href="https://x.com/getchadwallet"
            className="hover:text-foreground transition-colors duration-150"
          >
            X/Twitter
          </a>
          <a
            href="https://www.linkedin.com/company/chadwallet/"
            className="hover:text-foreground transition-colors duration-150"
          >
            LinkedIn
          </a>
        </div>
        <div className="flex flex-col gap-2 min-w-[150px]">
          <span className="text-gray-400 text-sm uppercase font-semibold">GET APP</span>
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
        </div>
        <div className="flex flex-col gap-2"></div>
      </div>
    </footer>
  );
}
