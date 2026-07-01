"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronRight, Copy, Trash2, AlertTriangle, Check } from "lucide-react";

export default function ManageAccountModal({ isOpen, onClose }: TManageAccountModalProps) {
  const [view, setView] = useState<"main" | "delete" | "delete_confirm" | "export_confirm">("main");
  const [deleteConfirmChecked, setDeleteConfirmChecked] = useState(false);
  const [exportConfirmChecked, setExportConfirmChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in select-none">
      {/* Modal Container */}
      <div className="relative w-full max-w-[420px] bg-[#0c0d12] border border-[#1d2433] rounded-xl shadow-2xl p-5 font-mono text-gray-300 flex flex-col gap-4">
        
        {/* Close button in top-right */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#0d0e12] border border-[#1d2433] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Title with Back Arrow */}
        <div className="relative flex items-center justify-center py-1">
          {view !== "main" && (
            <button 
              onClick={() => {
                if (view === "delete_confirm") {
                  setView("delete");
                } else {
                  setView("main");
                }
              }}
              className="absolute left-0 p-1 text-gray-400 hover:text-white cursor-pointer transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="font-extrabold text-white text-base">
            Manage account
          </span>
        </div>

        {/* Conditionally render main list, delete list, or delete/export confirm screen */}
        {view === "main" ? (
          <>
            {/* Accounts List Container */}
            <div className="flex flex-col gap-2.5">
              
              {/* Login Email Card */}
              <div 
                onClick={() => setView("delete")}
                className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center hover:bg-[#161a24] transition-colors cursor-pointer group"
              >
                <div className="flex flex-col gap-1.5 text-xs text-gray-450 font-bold">
                  <span>Login email</span>
                  <div className="flex items-center gap-2 text-gray-250">
                    <span className="text-[9px] bg-[#1a1c24] border border-[#2d3748]/50 px-1.5 py-0.2 rounded text-gray-400 font-bold uppercase tracking-wider scale-95 origin-left">Google</span>
                    <span className="text-white select-all font-bold text-[11px]">hanagakitakemichy18@gmail.com</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors mr-1" />
              </div>

              {/* Solana Address Card */}
              <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center">
                <div className="flex flex-col gap-1.5 text-xs text-gray-450 font-bold min-w-0">
                  <span>Solana address</span>
                  <span className="text-white text-[11px] truncate select-all font-bold">B3u6D7X1w4pYWYQHDc7jmBm3Xs7MyydygkswvfDyQMzw</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("B3u6D7X1w4pYWYQHDc7jmBm3Xs7MyydygkswvfDyQMzw");
                    alert("Solana address copied!");
                  }}
                  className="p-1.5 text-gray-500 hover:text-white cursor-pointer transition-colors"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Base Address Card */}
              <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center">
                <div className="flex flex-col gap-1.5 text-xs text-gray-455 font-bold min-w-0">
                  <span>Base address</span>
                  <span className="text-white text-[11px] truncate select-all font-bold">0x68aB8972F46821dcCC6F1A66c9848D6582BA3464</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("0x68aB8972F46821dcCC6F1A66c9848D6582BA3464");
                    alert("Base address copied!");
                  }}
                  className="p-1.5 text-gray-500 hover:text-white cursor-pointer transition-colors"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Monad Address Card */}
              <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center">
                <div className="flex flex-col gap-1.5 text-xs text-gray-455 font-bold min-w-0">
                  <span>Monad address</span>
                  <span className="text-white text-[11px] truncate select-all font-bold">0x68aB8972F46821dcCC6F1A66c9848D6582BA3464</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("0x68aB8972F46821dcCC6F1A66c9848D6582BA3464");
                    alert("Monad address copied!");
                  }}
                  className="p-1.5 text-gray-500 hover:text-white cursor-pointer transition-colors"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* BNB Chain Address Card */}
              <div className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3 flex justify-between items-center">
                <div className="flex flex-col gap-1.5 text-xs text-gray-450 font-bold min-w-0">
                  <span>BNB Chain address</span>
                  <span className="text-white text-[11px] truncate select-all font-bold">0x68aB8972F46821dcCC6F1A66c9848D6582BA3464</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("0x68aB8972F46821dcCC6F1A66c9848D6582BA3464");
                    alert("BNB Chain address copied!");
                  }}
                  className="p-1.5 text-gray-500 hover:text-white cursor-pointer transition-colors"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Export Keys Button */}
            <button 
              onClick={() => setView("export_confirm")}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-extrabold py-2.5 mt-1 hover:underline cursor-pointer transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export keys
            </button>
          </>
        ) : view === "delete" ? (
          /* Delete Account Sub-view */
          <div className="flex flex-col gap-2.5 my-1">
            <button 
              onClick={() => setView("delete_confirm")}
              className="bg-[#12131a] hover:bg-rose-950/20 border border-rose-900/30 rounded-lg p-3.5 flex items-center gap-2.5 text-rose-500 hover:text-rose-400 transition-colors text-left cursor-pointer w-full font-extrabold text-xs"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Delete account</span>
            </button>
          </div>
        ) : view === "delete_confirm" ? (
          /* Delete Account Confirmation Screen */
          <div className="flex flex-col gap-4">
            {/* Warning Header */}
            <div className="flex flex-col items-center gap-3.5 mt-2 mb-1 select-none">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <span className="font-extrabold text-orange-500 text-xs text-center uppercase tracking-wide">
                Read carefully before deleting account
              </span>
            </div>

            {/* Bullet List Container */}
            <div className="bg-[#12131a]/60 border border-[#1d2433]/70 rounded-lg p-4 font-mono text-[10.5px] text-gray-400 leading-relaxed select-text">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="text-gray-300">This action is irreversible. Your data will be permanently deleted.</span>
                </li>
                <li>
                  <span className="text-gray-300">You must export your private keys to access your funds.</span>
                </li>
              </ul>
            </div>

            {/* Checkbox Card */}
            <div 
              onClick={() => setDeleteConfirmChecked(!deleteConfirmChecked)}
              className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3.5 flex items-start gap-3 cursor-pointer select-none transition-colors hover:bg-[#161a24]"
            >
              {/* Custom Checkbox */}
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${deleteConfirmChecked ? "bg-orange-500 border-orange-500" : "border-orange-500/60"}`}>
                {deleteConfirmChecked && (
                  <Check className="w-2.5 h-2.5 text-black stroke-[4px]" />
                )}
              </div>

              {/* Labels */}
              <div className="flex flex-col gap-1 leading-snug">
                <span className="text-[11px] font-extrabold text-orange-500">I have exported my private keys</span>
                <span className="text-[9.5px] text-gray-500">I understand that ChadWallet cannot help me recover my funds if I lose my private keys.</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button 
              disabled={!deleteConfirmChecked}
              onClick={() => {
                alert("Account permanently deleted.");
                onClose();
                setView("main");
                setDeleteConfirmChecked(false);
              }}
              className={`w-full text-center py-2.5 rounded-lg text-xs font-extrabold transition-all select-none ${
                deleteConfirmChecked 
                  ? "bg-rose-600 hover:bg-rose-500 text-white cursor-pointer hover:shadow-lg hover:shadow-rose-900/10" 
                  : "bg-[#1e1f29] text-gray-600 cursor-not-allowed"
              }`}
            >
              Delete account
            </button>
          </div>
        ) : (
          /* Export Keys Confirmation Screen */
          <div className="flex flex-col gap-4">
            {/* Warning Header */}
            <div className="flex flex-col items-center gap-3.5 mt-2 mb-1 select-none">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <span className="font-extrabold text-orange-500 text-xs text-center uppercase tracking-wide">
                Read carefully before exporting keys
              </span>
            </div>

            {/* Bullet List Container */}
            <div className="bg-[#12131a]/60 border border-[#1d2433]/70 rounded-lg p-4 font-mono text-[10.5px] text-gray-400 leading-relaxed select-text">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="text-gray-300">Your private key is an unchangeable password for your account. If someone gets access, they can steal all of your funds.</span>
                </li>
                <li>
                  <span className="text-gray-300">The ChadWallet team will never ask you for your private key.</span>
                </li>
                <li>
                  <span className="text-gray-300">ChadWallet does not support tracking your activity on other platforms. Your trades and portfolio may become inaccurate and you may be removed from the leaderboard.</span>
                </li>
              </ul>
            </div>

            {/* Checkbox Card */}
            <div 
              onClick={() => setExportConfirmChecked(!exportConfirmChecked)}
              className="bg-[#12131a] border border-[#1d2433]/70 rounded-lg p-3.5 flex items-start gap-3 cursor-pointer select-none transition-colors hover:bg-[#161a24]"
            >
              {/* Custom Checkbox */}
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${exportConfirmChecked ? "bg-orange-500 border-orange-500" : "border-orange-500/60"}`}>
                {exportConfirmChecked && (
                  <Check className="w-2.5 h-2.5 text-black stroke-[4px]" />
                )}
              </div>

              {/* Labels */}
              <div className="flex flex-col gap-1 leading-snug">
                <span className="text-[11px] font-extrabold text-orange-500">I acknowledge the risks</span>
                <span className="text-[9.5px] text-gray-500">I understand that sharing my private key could result in a permanent loss of funds.</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button 
              disabled={!exportConfirmChecked}
              onClick={() => {
                alert("Your Private Key: B3u6D7X1w4pYWYQHDc7jmBm3Xs7MyydygkswvfDyQMzw_SECRET_KEY (copied to clipboard)");
                navigator.clipboard.writeText("B3u6D7X1w4pYWYQHDc7jmBm3Xs7MyydygkswvfDyQMzw_SECRET_KEY");
                onClose();
                setView("main");
                setExportConfirmChecked(false);
              }}
              className={`w-full text-center py-2.5 rounded-lg text-xs font-extrabold transition-all select-none ${
                exportConfirmChecked 
                  ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer hover:shadow-lg hover:shadow-blue-900/10" 
                  : "bg-[#1e1f29] text-gray-600 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Types placed at the bottom of the file
// ============================================================================

type TManageAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
