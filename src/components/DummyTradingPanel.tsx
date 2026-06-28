import { useRouter } from "next/navigation";
import { usePrivy } from "./PrivyProviderWrapper";
import { Zap } from "lucide-react";
import Image from "next/image";

export default function DummyTradingPanel() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();
  const handleLaunchApp = () => {
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
        className="relative aspect-video w-full bg-dark-bg flex items-center justify-center cursor-pointer p-6 md:p-8"
      >
        {/* Visual simulation of trading app */}
        <Image
          width={1000}
          height={1000}
          alt="Trading UI"
          src="/images/trading-ui.png"
        />

        <Image
          width={400}
          height={400}
          className="absolute -right-10 -bottom-30 animate-float"
          alt="Trading UI"
          src="/images/mobile-ui.png"
        />
      </div>
    </div>
  );
}
