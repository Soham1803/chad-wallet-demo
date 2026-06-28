import { useRouter } from "next/navigation";
import { usePrivy } from "./PrivyProviderWrapper";
import { Zap } from "lucide-react";
import Image from "next/image";

export default function DummyTradingPanel() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();
  const handleLaunchApp = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return; // Do nothing on mobile
    }
    if (ready && !authenticated) {
      sessionStorage.setItem("shouldRedirectToTrading", "true");
      login();
    } else {
      router.push("/trading");
    }
  };
  return (
    <div className="mt-16 w-full max-w-6xl rounded-2xl glass-panel glow-green border border-dark-border/80 group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border/80 bg-dark-card/90">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green/80"></span>
        </div>
        <div className="text-[10px] font-mono text-foreground/40 bg-dark-bg px-4 py-1 rounded border border-dark-border/40 select-none">
          chadwallet.xyz/trading
        </div>
        <div className="w-8"></div>
      </div>

      {/* Dashboard Preview Graphic */}
      <div
        onClick={handleLaunchApp}
        className="relative w-full bg-dark-bg flex items-center justify-center p-6 md:p-8 min-h-[300px] md:min-h-0 md:aspect-video cursor-default md:cursor-pointer overflow-visible"
      >
        {/* Visual simulation of trading app (Desktop) */}
        <Image
          width={1000}
          height={1000}
          alt="Trading UI"
          src="/images/trading-ui.png"
          className="hidden md:block w-full h-auto object-contain"
        />

        {/* Mobile mockup phone */}
        <div className="relative md:absolute md:-right-6 md:-bottom-16 lg:-right-10 lg:-bottom-24 w-[240px] md:w-[220px] lg:w-[320px] flex justify-center z-10">
          <Image
            width={400}
            height={400}
            className="animate-float object-contain"
            alt="Mobile UI"
            src="/images/mobile-ui.png"
          />
        </div>
      </div>
    </div>
  );
}
