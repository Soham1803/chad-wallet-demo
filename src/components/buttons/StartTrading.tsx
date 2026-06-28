import { usePrivy } from "@/components/PrivyProviderWrapper";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StartTradingBtn() {
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
    <button
      onClick={handleLaunchApp}
      className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl backdrop-blur-md hover:backdrop-blur-none bg-[#68ffc063] hover:bg-[#079057] text-white font-bold text-md hover:shadow-xl  transition-all duration-300 cursor-pointer"
    >
      <span className="relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-3">
        Start Trading
        <ArrowRight className="absolute -right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-4 h-4" />
      </span>
    </button>
  );
}
