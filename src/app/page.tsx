"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import {
  ArrowRight,
  Flame,
  Zap,
  Users,
  QrCode,
  MessageSquare,
  Cpu,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingBanner from "@/components/RotatingBanner";
import Image from "next/image";
import DummyTradingPanel from "@/components/DummyTradingPanel";

// Mock live-updating social theses to emulate the fomo.family social layer
interface ThesisPost {
  id: number;
  user: string;
  avatar: string;
  token: string;
  action: "BUY" | "SELL";
  amount: string;
  time: string;
  content: string;
}

const INITIAL_THESES: ThesisPost[] = [
  {
    id: 1,
    user: "SolanaSlayer.sol",
    avatar: "SS",
    token: "SOL",
    action: "BUY",
    amount: "12.5 SOL",
    time: "2m ago",
    content:
      "Solana looks extremely strong here, holding support. Target is $160 by Friday. LFG!",
  },
  {
    id: 2,
    user: "MemeLord_99",
    avatar: "ML",
    token: "WIF",
    action: "BUY",
    amount: "4.2k WIF",
    time: "5m ago",
    content: "Hat stays on. Volume is rising on Jup, breakout imminent.",
  },
  {
    id: 3,
    user: "ChadTrader_Alpha",
    avatar: "CT",
    token: "CHAD",
    action: "BUY",
    amount: "80,000 CHAD",
    time: "8m ago",
    content:
      "ChadWallet web launch is clean. This utility token is severely undervalued. Buying the dip.",
  },
  {
    id: 4,
    user: "DegenerateCat",
    avatar: "DC",
    token: "POPCAT",
    action: "SELL",
    amount: "10,000 POPCAT",
    time: "12m ago",
    content: "Taking some profit after a nice 20% pump. Will rebuy lower.",
  },
];

export default function Home() {
  const router = useRouter();
  const { login, authenticated, ready } = usePrivy();
  const [theses, setTheses] = useState<ThesisPost[]>(INITIAL_THESES);
  const [tps, setTps] = useState(2450);
  const [activeUsers, setActiveUsers] = useState(12842);

  // Live simulation of metrics and feed activity
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setTps(Math.floor(2200 + Math.random() * 600));
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 5 - 2));
    }, 2500);

    const feedInterval = setInterval(() => {
      // Flashes a new thesis feed item
      const users = [
        "BlockChad.sol",
        "SolGimi",
        "MemeWhisperer",
        "PumpEnjoyer.sol",
        "AlphaSeeker",
      ];
      const avatars = ["BC", "SG", "MW", "PE", "AS"];
      const tokens = ["SOL", "CHAD", "WIF", "POPCAT", "BONK", "JUP"];
      const actions: ("BUY" | "SELL")[] = ["BUY", "BUY", "BUY", "SELL"];
      const contents = [
        "Breaking key resistance, accumulation phase looks complete.",
        "High whale wallet inflows in the last 10 minutes. Buying.",
        "This is literally free money right here. Full porting in.",
        "Short term top is in, rotating capital to other Solana memecoins.",
        "Super low slippage swap on ChadWallet, executing next entry.",
      ];

      const randomIndex = Math.floor(Math.random() * users.length);
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      const newPost: ThesisPost = {
        id: Date.now(),
        user: users[randomIndex],
        avatar: avatars[randomIndex],
        token: randomToken,
        action: randomAction,
        amount:
          randomAction === "BUY"
            ? `${(Math.random() * 20 + 2).toFixed(1)} SOL`
            : `${Math.floor(Math.random() * 10000 + 500)} ${randomToken}`,
        time: "Just now",
        content: contents[randomIndex],
      };

      setTheses((prev) => [newPost, ...prev.slice(0, 3)]);
    }, 9000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(feedInterval);
    };
  }, []);

  // Redirection handler after login completes
  useEffect(() => {
    if (ready && authenticated) {
      const needsRedirect = sessionStorage.getItem("shouldRedirectToTrading");
      if (needsRedirect === "true") {
        sessionStorage.removeItem("shouldRedirectToTrading");
        router.push("/trading");
      }
    }
  }, [ready, authenticated, router]);

  const handleLaunchApp = () => {
    if (ready && !authenticated) {
      sessionStorage.setItem("shouldRedirectToTrading", "true");
      login();
    } else {
      router.push("/trading");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-foreground overflow-x-hidden">
      <Image
        src="/images/space-bg.webp"
        alt="Space Background"
        width={1000}
        height={1000}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <Image
        src="/images/astronaut.webp"
        alt="Astronaut"
        width={500}
        height={500}
        className="absolute left-1/2 -translate-x-1/2 top-75 animate-float"
      />
      {/* Global Navigation */}
      <Header />

      {/* Top Banner (Scrolling ticker) */}
      {/* <RotatingBanner reverse={false} /> */}

      {/* Main Hero Section */}
      <section className="relative w-full h-screen pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glowing background blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-brand-green/10 blur-[100px] pointer-events-none -z-10 animate-pulse-glow"></div>
        <div className="absolute top-1/3 left-1/3 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-brand-cyan/5 blur-[80px] pointer-events-none -z-10"></div>
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-xs font-semibold text-brand-green mb-6 animate-float">
          <Flame className="w-3.5 h-3.5 fill-brand-green" />
          The Social Trading Revolution
        </div>
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight sm:leading-none">
          ChadWallet
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-foreground/60 max-w-2xl font-light">
          No seed phrases. No complexity. Sign in with Apple or Google, fund
          with one-click, share trading theses, and execute swaps instantly.
        </p>
        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <button
            onClick={handleLaunchApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl backdrop-blur-md hover:backdrop-blur-none bg-[#68ffc063] hover:bg-[#079057] text-white font-bold text-md hover:shadow-xl  transition-all duration-300 cursor-pointer"
          >
            Start Trading
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#download-apps"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl backdrop-blur-md hover:backdrop-blur-sm bg-dark-panel/50 text-md font-semibold transition-all duration-200"
          >
            Download App
          </a>
        </div>{" "}
        <span className="absolute left-1/2 -translate-x-1/2 bottom-20 text-xs text-brand-green font-bold">
          NOW AVAILABLE ON APP
        </span>
      </section>

      {/* Network Stats Counter */}
      <section className="flex flex-col items-center gap-8 w-full bg-dark-card/60  py-10">
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-5xl font-semibold font-roboto">
            Every <span className="text-brand-blue">chain</span>
          </h2>
          <h2 className="text-5xl font-semibold font-roboto">
            Hunt every <span className="text-brand-cyan">memecoin</span>
          </h2>
          <h2 className="text-5xl font-semibold font-roboto">
            One <span className="text-brand-green">wallet</span>
          </h2>
        </div>
        {/* Interactive App Mockup Preview */}
        <DummyTradingPanel />

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-brand-green font-mono">
              {tps}
            </div>
            <div className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">
              Solana Live TPS
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-foreground font-mono">
              {activeUsers.toLocaleString()}
            </div>
            <div className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">
              Active Chads Today
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-brand-cyan font-mono">
              $1.4M+
            </div>
            <div className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">
              Volume Handled
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-brand-cyan font-mono">
              &lt; 1.2s
            </div>
            <div className="text-xs text-foreground/40 mt-1 uppercase tracking-wider font-semibold">
              Average Execution
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="w-full py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center tracking-tight mb-12">
          DeFi Simplified, <span className="text-gradient">Chad Style</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-dark-panel border border-dark-border/80 hover:border-brand-green/40 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shadow-inner">
              <Zap className="w-5 h-5 fill-brand-green/15" />
            </div>
            <h3 className="text-lg font-bold">2-Second Onboarding</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Skip seed phrases, adapters, and browser extensions. Sign in
              seamlessly with Apple or Google through Privy. A secure Solana
              embedded wallet is automatically spun up for you instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-dark-panel border border-dark-border/80 hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Social-First UX</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Don&apos;t trade alone. See trending tokens directly, follow live
              trades, and read explanations (theses) from real holders
              explaining why they are in a position before you click buy.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-dark-panel border border-dark-border/80 hover:border-brand-cyan/40 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Jupiter Swaps Integration</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Get the absolute best pricing and route splits on the market.
              Powered directly by Jupiter API. Slippage auto-settings and
              transaction routing ensure you never miss an entry.
            </p>
          </div>
        </div>
      </section>

      {/* Simulated Live Theses Feed (fomo.family feel) */}
      <section className="w-full py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="border border-dark-border/80 rounded-2xl bg-dark-panel/60 p-6 md:p-8 glass-panel relative">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded text-[10px] text-brand-green font-mono font-bold">
            <MessageSquare className="w-3 h-3" />
            LIVE FEED
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            What Chads are Saying
          </h2>
          <p className="text-sm text-foreground/50 mb-6">
            Real-time social theses submitted by holders on Solana chain
          </p>

          <div className="space-y-4">
            {theses.map((thesis) => (
              <div
                key={thesis.id}
                className="p-4 rounded-xl bg-dark-card border border-dark-border/50 hover:border-dark-border hover:scale-[1.01] transition-all duration-150 flex flex-col md:flex-row md:items-start gap-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {thesis.avatar}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground/90">
                        {thesis.user}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-dark-panel border border-dark-border">
                        {thesis.token}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-extrabold ${
                          thesis.action === "BUY"
                            ? "bg-brand-green/10 text-brand-green"
                            : "bg-brand-red/10 text-brand-red"
                        }`}
                      >
                        {thesis.action} {thesis.amount}
                      </span>
                    </div>
                    <span className="text-xs text-foreground/30 font-mono">
                      {thesis.time}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-foreground/75 leading-relaxed font-sans">
                    {thesis.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleLaunchApp}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-green hover:text-brand-cyan transition-colors duration-150"
            >
              Connect to write your thesis
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* App Downloads Section */}
      <section
        id="download-apps"
        className="w-full py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-dark-border/40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-green/20">
              C
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Get the ChadWallet <br />
              <span className="text-gradient">Mobile App.</span>
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-md">
              Available now on Android and iOS. Take the ultimate social Solana
              wallet with you on-the-go. Secure keys, widgets, one-tap trading,
              and push notifications for token breakouts.
            </p>

            {/* Download Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {/* Apple Store */}
              <a
                href="https://apps.apple.com/us/app/chadwallet/id6757367474"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-dark-panel hover:bg-dark-card border border-dark-border hover:border-brand-cyan/50 rounded-xl px-5 py-3 transition-all duration-200 group"
              >
                {/* SVG Apple Logo */}
                <svg
                  className="w-6 h-6 fill-foreground group-hover:fill-brand-cyan transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.86-1.01 2.98 1.12.09 2.25-.56 2.94-1.41z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-foreground/40 leading-none">
                    Download on the
                  </div>
                  <div className="text-xs font-bold leading-tight mt-0.5">
                    App Store
                  </div>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-dark-panel hover:bg-dark-card border border-dark-border hover:border-brand-green/50 rounded-xl px-5 py-3 transition-all duration-200 group"
              >
                {/* SVG Google Play Logo */}
                <svg
                  className="w-6 h-6 fill-foreground group-hover:fill-brand-green transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 3.25c-.28 0-.53.11-.72.28L12.56 12l8.28-8.47c-.19-.17-.44-.28-.72-.28H5zM3.53 4.28C3.36 4.47 3.25 4.72 3.25 5v14c0 .28.11.53.28.72L11.56 12 3.53 4.28zm9.72 8.44l8.28 8.47c.28 0 .53-.11.72-.28h-14.7c-.28 0-.53.11-.72.28l8.28-8.47c.07-.07.13-.07.2-.07s.13 0 .2.07zm8.47-8.44L13.56 12l8.16 7.72c.17-.19.28-.44.28-.72V5c0-.28-.11-.53-.28-.72z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-foreground/40 leading-none">
                    Get it on
                  </div>
                  <div className="text-xs font-bold leading-tight mt-0.5">
                    Google Play
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-dark-panel/40 border border-dark-border/60 rounded-3xl p-8 max-w-lg mx-auto w-full">
            <div className="p-4 bg-white rounded-2xl shadow-inner flex items-center justify-center shrink-0">
              <QrCode className="w-36 h-36 text-dark-bg" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-lg font-bold">Scan to Download</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Scan the QR code with your phone camera to download the mobile
                app and connect your accounts instantly.
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded bg-brand-green/10 text-brand-green border border-brand-green/20 text-[10px] font-mono">
                Supports iOS 15+ & Android 9+
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Banner (Scrolling ticker, opposite direction) */}
      <RotatingBanner reverse={true} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
