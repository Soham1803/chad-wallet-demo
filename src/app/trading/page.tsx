"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import TradingHeader from "@/components/TradingHeader";
import { usePrivy } from "@/components/PrivyProviderWrapper";
import useResponsive from "@/hooks/useResponsive";

// Subcomponents
import DesktopOnlyWarning from "./components/DesktopOnlyWarning";
import AccessDenied from "./components/AccessDenied";
import TradingContent from "./components/TradingContent";
import ManageAccountModal from "./components/ManageAccountModal";
import ReferralsModal from "./components/ReferralsModal";
import DepositModal from "./components/DepositModal";
import WithdrawModal from "./components/WithdrawModal";

export default function TradingPage() {
  const { authenticated, ready, login } = usePrivy();
  const router = useRouter();
  const wasAuthenticatedRef = useRef(false);
  const { isMobile } = useResponsive();

  const [showManageAccount, setShowManageAccount] = useState(false);
  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [cashBalance, setCashBalance] = useState(() => {
    if (typeof window !== "undefined") {
      const val = sessionStorage.getItem("cash_balance");
      return val ? parseFloat(val) : 0.00;
    }
    return 0.00;
  });

  const updateCashBalance = (newVal: number) => {
    setCashBalance(newVal);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cash_balance", newVal.toFixed(2));
      window.dispatchEvent(new Event("cashbalancechange"));
    }
  };

  useEffect(() => {
    const handleOpenManageAccount = () => {
      setShowManageAccount(true);
    };
    window.addEventListener("openmanageaccount", handleOpenManageAccount);
    return () => window.removeEventListener("openmanageaccount", handleOpenManageAccount);
  }, []);

  useEffect(() => {
    const handleOpenReferrals = () => {
      setShowReferralsModal(true);
    };
    window.addEventListener("openreferrals", handleOpenReferrals);
    return () => window.removeEventListener("openreferrals", handleOpenReferrals);
  }, []);

  useEffect(() => {
    const handleOpenDeposit = () => {
      setShowDepositModal(true);
    };
    const handleOpenWithdraw = () => {
      setShowWithdrawModal(true);
    };
    const syncCash = () => {
      if (typeof window !== "undefined") {
        const val = sessionStorage.getItem("cash_balance");
        setCashBalance(val ? parseFloat(val) : 0.00);
      }
    };

    window.addEventListener("opendeposit", handleOpenDeposit);
    window.addEventListener("openwithdraw", handleOpenWithdraw);
    window.addEventListener("cashbalancechange", syncCash);

    return () => {
      window.removeEventListener("opendeposit", handleOpenDeposit);
      window.removeEventListener("openwithdraw", handleOpenWithdraw);
      window.removeEventListener("cashbalancechange", syncCash);
    };
  }, []);

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        wasAuthenticatedRef.current = true;
      } else if (wasAuthenticatedRef.current) {
        router.push("/");
      }
    }
  }, [ready, authenticated, router]);

  // If mobile, show desktop-only warning
  if (isMobile) {
    return <DesktopOnlyWarning />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#06070a] text-foreground overflow-hidden font-mono">
      {/* Navigation Header specifically for trading - stays mounted across all ready/auth states */}
      <TradingHeader />

      {/* Main Container - transitions content inside without unmounting root header/footer */}
      <div className="flex-1 min-h-0 w-full flex flex-col">
        {!ready ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[11px] text-gray-500 gap-3 bg-[#06070a]">
            <div className="w-6 h-6 rounded-full border-2 border-[#0df294] border-t-transparent animate-spin"></div>
            Loading session...
          </div>
        ) : !authenticated ? (
          <AccessDenied onLogin={login} />
        ) : (
          <TradingContent />
        )}
      </div>

      {/* Modals */}
      <ManageAccountModal
        isOpen={showManageAccount}
        onClose={() => setShowManageAccount(false)}
      />

      <ReferralsModal
        isOpen={showReferralsModal}
        onClose={() => setShowReferralsModal(false)}
      />

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        cashBalance={cashBalance}
        onUpdateCashBalance={updateCashBalance}
      />

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        cashBalance={cashBalance}
        onUpdateCashBalance={updateCashBalance}
      />
    </div>
  );
}
