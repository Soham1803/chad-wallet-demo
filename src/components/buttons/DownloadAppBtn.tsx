import { Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DownloadAppBtn() {
  const [showQrCode, setShowQrCode] = useState(false);
  return (
    <div className="relative flex flex-col items-center w-full sm:w-auto">
      <button
        onClick={() => setShowQrCode(!showQrCode)}
        className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl backdrop-blur-md hover:backdrop-blur-sm bg-dark-panel/50 hover:bg-dark-border/30 text-md font-semibold transition-all duration-200 cursor-pointer"
      >
        <span className="relative flex items-center justify-center transition-transform duration-300 group-hover:translate-x-3">
          <Download className="absolute -left-6 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-4 h-4" />
          Download App
        </span>
      </button>

      {/* QR Code Dropdown Card (visible on click) */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 transition-all duration-300 z-50 w-64 p-5 rounded-2xl border backdrop-blur-md border-dark-border/80 bg-dark-panel/65  flex flex-col items-center gap-4 shadow-2xl shadow-black/50 ${
          showQrCode
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center w-55 h-55">
          <Image
            height={300}
            width={300}
            src="/images/qr-code.png"
            alt="QR code download"
            unoptimized
          />
        </div>
        <p className="text-xs text-foreground/50 text-center leading-relaxed">
          Scan the QR code to download <br />
          the app on your phone
        </p>
      </div>
    </div>
  );
}
