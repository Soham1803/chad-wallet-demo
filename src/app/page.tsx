"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import { Flame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingBanner from "@/components/RotatingBanner";
import Image from "next/image";
import DummyTradingPanel from "@/components/DummyTradingPanel";
import FeatureCard from "@/components/FeatureCard";
import StartTradingBtn from "@/components/buttons/StartTrading";
import DownloadAppBtn from "@/components/buttons/DownloadAppBtn";

export default function Home() {
  const { authenticated, ready } = usePrivy();

  // Redirection handler for authenticated users: automatically push to trading page (desktop only)
  useEffect(() => {
    if (ready && authenticated) {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        window.location.replace("/trading");
      }
    }
  }, [ready, authenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-foreground overflow-x-hidden">
      <RotatingBanner />
      <Image
        src="/images/space-bg.webp"
        alt="Space Background"
        width={1000}
        height={1000}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Global Navigation */}
      <Header />

      {/* Top Banner (Scrolling ticker) */}
      {/* <RotatingBanner reverse={false} /> */}

      {/* Main Hero Section */}
      <section className="relative w-full min-h-screen md:h-screen pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glowing background blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-brand-green/10 blur-[100px] pointer-events-none -z-10 animate-pulse-glow"></div>
        <div className="absolute top-1/3 left-1/3 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-brand-cyan/5 blur-[80px] pointer-events-none -z-10"></div>
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-xs font-semibold text-brand-green mb-6 animate-float">
          <Flame className="w-3.5 h-3.5 fill-brand-green" />
          The Social Trading Revolution
        </div>
        {/* Hero Title */}
        <h1 className="text-6xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-tight sm:leading-none">
          ChadWallet
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-foreground/60 max-w-2xl font-light">
          No seed phrases. No complexity. Sign in with Apple or Google, fund
          with one-click, share trading theses, and execute swaps instantly.
        </p>
        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md z-30">
          <div className="hidden md:block w-full sm:w-auto">
            <StartTradingBtn />
          </div>
          <DownloadAppBtn />
        </div>{" "}
        {/* Astronaut Image */}
        <div className="relative md:absolute -mt-16 md:mt-0 left-auto md:left-1/2 translate-x-0 md:-translate-x-1/2 top-0 md:top-[280px] lg:top-[260px] w-full max-w-[320px] sm:max-w-[380px] md:max-w-[500px] flex justify-center z-10">
          <Image
            src="/images/astronaut.webp"
            alt="Astronaut"
            width={500}
            height={500}
            className="animate-float w-full h-auto object-contain"
            priority
          />
        </div>
        <span className="relative md:absolute left-auto md:left-1/2 translate-x-0 md:-translate-x-1/2 bottom-0 md:bottom-90 lg:bottom-31 mt-12 md:mt-0 text-xs text-brand-green font-bold tracking-widest z-30 block">
          NOW AVAILABLE ON MOBILE
        </span>
      </section>

      {/* Network Stats Counter */}
      <section className="flex flex-col items-center gap-0 md:gap-8 w-full bg-dark-card/60 py-10 px-4">
        <div className="block md:hidden relative h-[380px] w-full overflow-hidden flex justify-center">
          <Image
            alt="Mobile UI"
            src="/images/mobile-back-lean.png"
            width={1000}
            height={500}
            className="object-contain h-full"
          />
          {/* Smooth gradient overlay to fade bottom of phone into background */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent pointer-events-none"></div>
        </div>
        <div className="flex flex-col items-center gap-1 w-full text-center relative -mt-28 md:mt-0 z-10 md:z-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-roboto leading-snug">
            Every <span className="text-brand-blue">chain</span>
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-roboto leading-snug">
            Hunt every <span className="text-brand-cyan">memecoin</span>
          </h2>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-roboto leading-snug">
            One <span className="text-brand-green">wallet</span>
          </h2>
        </div>
        {/* Interactive App Mockup Preview */}
        <div className="hidden md:flex justify-center w-full">
          <DummyTradingPanel />
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="w-full py-16 md:py-40 px-4 md:px-24 mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-5xl font-extrabold text-left tracking-tight mb-12">
          DeFi Simplified, <span className="text-gradient">Chad Style</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <FeatureCard
            title="Trending Tokens"
            description="Buy and Sell trending tokens"
            imageAlt="Trending tokens"
            imageSrc="/images/trending-tokens.png"
          />

          {/* Card 2 */}
          <FeatureCard
            title="KOL traders"
            description="Follow KOL traders."
            imageAlt="Social-First UX"
            imageSrc="/images/kol-traders.png"
          />

          {/* Card 3 */}
          <FeatureCard
            title="Launch Meme coins"
            description="Launch Meme coins from a tweet."
            imageAlt="Launch Meme coin"
            imageSrc="/images/launch-meme-coin.png"
          />

          {/* Card 4 */}
          <FeatureCard
            title="x trends"
            description="Catch early trends on X"
            imageAlt="X trends"
            imageSrc="/images/x-trends.png"
          />

          {/* Card 5 */}
          <FeatureCard
            title="Manage assets"
            description="Manage your assets with intuitive UI"
            imageAlt="Manage assets"
            imageSrc="/images/manage-assets.png"
          />

          {/* Card 6 */}
          <FeatureCard
            title="Relaunch memecoin"
            description="Easliy relaunch memecoin."
            imageAlt="Relaunch meme coin UI"
            imageSrc="/images/relaunch-coin.png"
          />
        </div>
      </section>

      {/* rotating banner (fomo.family feel) */}
      <section className="relative flex flex-col items-center justify-center w-full min-h-[80vh] md:h-[120vh] py-20 md:py-52 px-4 md:px-8 mx-auto overflow-hidden">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            alt="BG"
            src="/images/web3-bg.png"
            fill
            className="object-cover opacity-10 pointer-events-none"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          />
        </div>
        <div className="absolute top-60 left-1/2 -translate-x-1/2 bg-transparent rounded-full w-1/4 animate-spin [animation-duration:20s] [animation-direction:reverse] aspect-square pointer-events-none">
          <Image
            width={10000}
            height={10000}
            src="/images/inner-circle.png"
            alt="Rotating cirle"
            unoptimized
          />
        </div>
        <div className="absolute w-1/2 bg-transparent rounded-full animate-spin [animation-duration:30s] aspect-square pointer-events-none">
          <Image
            width={10000}
            height={10000}
            src="/images/rotating-outer.png"
            alt="Rotating cirle"
            unoptimized
          />
        </div>
        <div className="mb-20 md:mb-40 z-20">
          <h3 className="text-teal-50 text-3xl sm:text-4xl md:text-5xl text-center">
            a trading app <br /> for the chads
          </h3>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg text-center font-semibold mt-6">
            Snipe memecoins at lightning speed on every chain. <br /> Copy the
            wallets that are actually printing.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
            <div className="hidden md:block w-full sm:w-auto">
              <StartTradingBtn />
            </div>
            <DownloadAppBtn />
          </div>
        </div>
      </section>

      {/* App Downloads Section */}
      <section
        id="download-apps"
        className="w-full py-20 px-4 md:px-8 max-w-7xl mx-auto"
      ></section>

      {/* Bottom Banner (Scrolling ticker, opposite direction) */}
      <RotatingBanner reverse={true} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
