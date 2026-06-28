"use client";

import { useEffect } from "react";

export default function DownloadsPage() {
  useEffect(() => {
    const userAgent = (navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "") as string;

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream) {
      window.location.href = "https://apps.apple.com/us/app/chadwallet/id6757367474";
    } else if (/android/i.test(userAgent)) {
      window.location.href = "https://play.google.com/store/apps/details?id=xyz.chadwallet.www";
    } else {
      // Fallback for desktop or unrecognized OS
      window.location.href = "https://apps.apple.com/us/app/chadwallet/id6757367474";
    }
  }, []);

  return null;
}
