import { useRouter } from "next/navigation";
import { usePrivy } from "./PrivyProviderWrapper";
import { Zap } from "lucide-react";

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
    <div className="mt-16 w-full max-w-5xl rounded-2xl glass-panel glow-green overflow-hidden border border-dark-border/80 group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border/80 bg-dark-card/90">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green/80"></span>
        </div>
        <div className="text-[10px] font-mono text-foreground/40 bg-dark-bg px-4 py-1 rounded border border-dark-border/40 select-none">
          app.chadwallet.xyz/trading
        </div>
        <div className="w-8"></div>
      </div>

      {/* Dashboard Preview Graphic */}
      <div
        onClick={handleLaunchApp}
        className="relative aspect-video w-full bg-dark-bg flex items-center justify-center cursor-pointer overflow-hidden p-6 md:p-8"
      >
        {/* Visual simulation of trading app */}
        <div className="w-full h-full rounded-lg bg-dark-panel border border-dark-border/60 flex flex-col text-left overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-dark-border/40 bg-dark-card/40">
            <span className="text-xs font-bold text-gradient">
              ChadWallet Web Terminal
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded">
              ● LIVE CONNECTIVITY
            </span>
          </div>

          <div className="flex-1 grid grid-cols-4 gap-2.5 p-3">
            {/* Visual panel left */}
            <div className="col-span-1 border border-dark-border/40 rounded p-2 flex flex-col gap-1.5 bg-dark-card/20">
              <div className="h-3 w-16 bg-foreground/20 rounded mb-1"></div>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex justify-between items-center py-1 border-b border-dark-border/20"
                >
                  <div className="w-6 h-3 bg-brand-green/20 rounded"></div>
                  <div className="w-8 h-2 bg-foreground/10 rounded"></div>
                </div>
              ))}
            </div>

            {/* Visual panel middle */}
            <div className="col-span-2 border border-dark-border/40 rounded p-2.5 flex flex-col justify-between bg-dark-card/40 relative">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="w-20 h-4 bg-foreground/20 rounded"></div>
                  <div className="w-12 h-3 bg-brand-green/20 rounded"></div>
                </div>
                {/* Simulated Chart Wave */}
                <svg
                  className="w-full h-24 text-brand-green"
                  viewBox="0 0 100 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 25L10 22L20 27L30 18L40 22L50 12L60 16L70 8L80 14L90 4L100 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0 25L10 22L20 27L30 18L40 22L50 12L60 16L70 8L80 14L90 4L100 2V30H0V25Z"
                    fill="url(#chart-grad)"
                    opacity="0.05"
                  />
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-[9px] text-foreground/30 font-mono text-center">
                Interactive dashboard loaded with real-time Solana order books
              </div>
            </div>

            {/* Visual panel right */}
            <div className="col-span-1 border border-dark-border/40 rounded p-2 flex flex-col justify-between bg-dark-card/20">
              <div className="flex justify-between items-center border-b border-dark-border/40 pb-1">
                <span className="text-[10px] text-brand-green font-bold">
                  BUY
                </span>
                <span className="text-[10px] text-foreground/40">SELL</span>
              </div>
              <div className="space-y-1.5 my-2">
                <div className="h-6 bg-dark-bg rounded border border-dark-border/40"></div>
                <div className="h-6 bg-dark-bg rounded border border-dark-border/40"></div>
              </div>
              <div className="h-6 bg-brand-green rounded flex items-center justify-center text-[10px] font-bold text-white uppercase">
                Connect Privy
              </div>
            </div>
          </div>
        </div>

        {/* Overlay effect */}
        <div className="absolute inset-0 bg-dark-panel opacity-80"></div>
        <div className="absolute bottom-6 flex justify-center w-full">
          <span className="px-5 py-2.5 rounded-xl bg-dark-card hover:bg-dark-panel border border-brand-green/40 text-xs font-semibold flex items-center gap-1.5 shadow-2xl transition-all duration-150 transform hover:scale-105">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
            Launch Live Demo Trading Terminal
          </span>
        </div>
      </div>
    </div>
  );
}
