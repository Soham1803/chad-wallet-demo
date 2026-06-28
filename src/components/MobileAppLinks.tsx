import AppleLogo from "./svgs/AppleLogo";
import GooglePlayLogo from "./svgs/GooglePlayLogo";

export function AppleAppLink() {
  return (
    <a
      href="https://apps.apple.com/us/app/chadwallet/id6757367474"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-light-panel/40 backdrop-blur-md hover:backdrop-blur-sm border border-transparent hover:border-[#c0c0c0] rounded-xl px-3 py-2 transition-all duration-200 group"
    >
      {/* SVG Apple Logo */}
      <AppleLogo />

      <div className="text-left">
        <div className="text-[10px] text-foreground/40 leading-none">
          Download on the
        </div>
        <div className="text-sm font-semibold leading-tight mt-0.5">
          App Store
        </div>
      </div>
    </a>
  );
}
export function GooglePlayAppLink() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-light-panel/40 backdrop-blur-md hover:backdrop-blur-sm border border-transparent hover:border-[#c0c0c0] rounded-xl px-3 py-2 transition-all duration-200 group"
    >
      {/* SVG Google Play Logo */}
      <GooglePlayLogo />

      <div className="text-left">
        <div className="text-[10px] text-foreground/40 leading-none">
          Get it on
        </div>
        <div className="text-sm font-semibold leading-tight mt-0.5">
          Google Play
        </div>
      </div>
    </a>
  );
}
