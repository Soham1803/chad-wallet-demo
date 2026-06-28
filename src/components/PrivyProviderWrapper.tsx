'use client';

import React, { createContext, useContext, useState } from 'react';
import { PrivyProvider, usePrivy as useRealPrivy, useLoginWithOAuth } from '@privy-io/react-auth';
import { ArrowRight, X } from 'lucide-react';

// Unified type signature matching usePrivy
interface PrivyContextType {
  ready: boolean;
  authenticated: boolean;
  user: {
    wallet?: { address: string };
    email?: { address: string };
  } | null;
  login: () => void;
  logout: () => void;
}

const CustomPrivyContext = createContext<PrivyContextType | null>(null);

interface CustomAuthModalProps {
  onClose: () => void;
  onLogin: (provider: 'google' | 'apple') => void;
}

// Sleek Custom Auth Modal matching fomo.family layout
function CustomAuthModal({ onClose, onLogin }: CustomAuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Click outside container to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-[380px] p-8 rounded-3xl bg-dark-panel border border-brand-cyan/20 shadow-2xl shadow-brand-cyan/5 flex flex-col items-center z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-dark-card border border-transparent hover:border-dark-border text-foreground/45 hover:text-foreground/80 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title Logo */}
        <div className="text-4xl font-extrabold tracking-wider text-center text-gradient uppercase font-mono mt-4 mb-1 select-none">
          ChadWallet
        </div>

        {/* Subtitle description */}
        <div className="text-xs text-foreground/60 text-center font-sans tracking-wide mb-8 select-none">
          Login or create an account to start trading.
        </div>

        {/* Interactive Buttons */}
        <div className="w-full space-y-3.5">
          {/* Apple Sign In */}
          <button 
            onClick={() => onLogin('apple')}
            className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-white/95 text-black font-bold text-sm flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md"
          >
            <svg className="w-4.5 h-4.5 mr-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.86-1.01 2.98 1.12.09 2.25-.56 2.94-1.41z"/>
            </svg>
            Continue with Apple
          </button>

          {/* Google Sign In */}
          <button 
            onClick={() => onLogin('google')}
            className="w-full py-3.5 px-5 rounded-xl bg-dark-card hover:bg-dark-panel text-white font-bold text-sm flex items-center justify-center border border-dark-border hover:border-foreground/20 transition-all duration-200 active:scale-[0.98] cursor-pointer relative shadow-md"
          >
            <svg className="w-4.5 h-4.5 mr-2.5 absolute left-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-3.3-4.53-6.16-4.53z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
            <ArrowRight className="w-4 h-4 absolute right-5 text-foreground/45" />
          </button>
        </div>

        {/* Footer Subtext */}
        <div className="text-[10px] text-foreground/35 text-center mt-8 leading-relaxed px-1 select-none">
          By signing up, you agree to our <a href="#" className="underline hover:text-foreground/50">Terms of Service</a> and <a href="#" className="underline hover:text-foreground/50">Privacy Policy</a>.
        </div>

      </div>
    </div>
  );
}

interface ConsumerProps {
  children: React.ReactNode;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

// Real Privy provider connector
function RealPrivyConsumer({ children, isOpen, setOpen }: ConsumerProps) {
  const realPrivy = useRealPrivy();
  const { initOAuth } = useLoginWithOAuth();
  
  const loginWithRedirect = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shouldRedirectToTrading', 'true');
    }
    setOpen(true); // Open our custom modal instead of Privy's default
  }, [setOpen]);

  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    initOAuth({ provider });
    setOpen(false);
  };

  const mappedValue: PrivyContextType = {
    ready: realPrivy.ready,
    authenticated: realPrivy.authenticated,
    user: realPrivy.user,
    login: loginWithRedirect,
    logout: realPrivy.logout,
  };

  return (
    <CustomPrivyContext.Provider value={mappedValue}>
      {children}
      {isOpen && (
        <CustomAuthModal 
          onClose={() => setOpen(false)} 
          onLogin={handleOAuthLogin}
        />
      )}
    </CustomPrivyContext.Provider>
  );
}

// Local mock provider for sandbox environments
function MockPrivyConsumer({ children, isOpen, setOpen }: ConsumerProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{ wallet?: { address: string }; email?: { address: string } } | null>(null);

  const loginWithRedirect = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shouldRedirectToTrading', 'true');
    }
    setOpen(true);
  }, [setOpen]);

  const handleMockLogin = (provider: 'google' | 'apple') => {
    if (provider === 'apple') {
      alert("Apple authentication requires Apple Developer Certificate configuration. Please use 'Continue with Google' for the live demo.");
      return;
    }
    
    const email = prompt('Sign in via Google (Mock Demo Mode):', 'chad_investor@chadwallet.xyz');
    if (email) {
      setAuthenticated(true);
      setUser({
        wallet: { address: 'Gv5hX1sJ4qPzMewCHADx1234567890abcdefghijkl' },
        email: { address: email },
      });
      setOpen(false);
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
  };

  const mockValue: PrivyContextType = {
    ready: true,
    authenticated,
    user,
    login: loginWithRedirect,
    logout,
  };

  return (
    <CustomPrivyContext.Provider value={mockValue}>
      {children}
      {isOpen && (
        <CustomAuthModal 
          onClose={() => setOpen(false)} 
          onLogin={handleMockLogin}
        />
      )}
    </CustomPrivyContext.Provider>
  );
}

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clpigg5p600e0la08hu7849cc';
  
  // Run mock mode if app id is the default sandbox one or empty
  const isMock = appId === 'clpigg5p600e0la08hu7849cc' || !appId || appId.includes('xxxx');

  if (isMock) {
    return (
      <MockPrivyConsumer isOpen={isModalOpen} setOpen={setIsModalOpen}>
        {children}
      </MockPrivyConsumer>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6', // Brand purple
          walletChainType: 'solana-only',
          showWalletLoginFirst: false,
        },
        loginMethods: ['email', 'google', 'wallet'],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <RealPrivyConsumer isOpen={isModalOpen} setOpen={setIsModalOpen}>
        {children}
      </RealPrivyConsumer>
    </PrivyProvider>
  );
}

// Unified client-side hook for all components
export function usePrivy() {
  const ctx = useContext(CustomPrivyContext);
  if (!ctx) {
    throw new Error('usePrivy must be used within PrivyProviderWrapper');
  }
  return ctx;
}
