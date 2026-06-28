'use client';

import React, { createContext, useContext, useState } from 'react';
import { PrivyProvider, usePrivy as useRealPrivy, useLoginWithOAuth, useLoginWithEmail } from '@privy-io/react-auth';
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
  isMock: boolean;
  onMockLogin: (email: string) => void;
}

// Custom Auth Modal with custom Email OTP and Google flows
function CustomAuthModal({ onClose, isMock, onMockLogin }: CustomAuthModalProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Privy hooks (always declared to respect Rules of Hooks)
  const { initOAuth } = useLoginWithOAuth();
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      if (isMock) {
        // Simulate code sending delay in mock mode
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStep('otp');
      } else {
        await sendCode({ email });
        setStep('otp');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to send verification code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError('');

    try {
      if (isMock) {
        // Simulate verification delay in mock mode
        await new Promise((resolve) => setTimeout(resolve, 800));
        onMockLogin(email);
      } else {
        await loginWithCode({ code });
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isMock) {
      onMockLogin('chad_trader@chadwallet.xyz');
    } else {
      initOAuth({ provider: 'google' });
      onClose();
    }
  };

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

        {/* Step 1: Email Form */}
        {step === 'email' ? (
          <div className="w-full space-y-4">
            <form onSubmit={handleEmailSubmit} className="w-full space-y-3">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-brand-cyan/50 text-white text-sm focus:outline-none placeholder:text-foreground/20 font-sans"
                disabled={loading}
              />
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-white hover:bg-white/95 text-black font-bold text-sm flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                ) : (
                  'Continue with Email'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full flex items-center justify-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-dark-border" />
              <span className="text-[10px] text-foreground/30 font-semibold uppercase">or</span>
              <div className="flex-1 h-[1px] bg-dark-border" />
            </div>

            {/* Google Sign In */}
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl bg-dark-card hover:bg-dark-panel text-white font-bold text-sm flex items-center justify-center border border-dark-border hover:border-foreground/20 transition-all duration-200 active:scale-[0.98] cursor-pointer relative shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleOtpSubmit} className="w-full space-y-4">
            <div className="text-center mb-1">
              <div className="text-[11px] text-foreground/50">
                We sent a verification code to
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {email}
              </div>
            </div>

            <input 
              type="text" 
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-brand-cyan/50 text-white text-center text-lg font-bold tracking-[0.5em] focus:outline-none font-mono"
              disabled={loading}
            />

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-brand-green to-brand-cyan text-white font-bold text-sm flex items-center justify-center transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                'Verify & Login'
              )}
            </button>

            <div className="flex justify-between items-center px-1 text-[11px]">
              <button 
                type="button" 
                onClick={() => setStep('email')}
                className="text-foreground/40 hover:text-foreground/70 transition-colors"
                disabled={loading}
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={handleEmailSubmit}
                className="text-brand-green hover:text-brand-green/80 transition-colors"
                disabled={loading}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Error display */}
        {error && (
          <div className="w-full p-2.5 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red text-center text-[10px] mt-4 font-semibold leading-relaxed animate-in fade-in duration-150">
            {error}
          </div>
        )}

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
  
  const loginWithRedirect = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shouldRedirectToTrading', 'true');
    }
    setOpen(true); // Open our custom modal instead of Privy's default
  }, [setOpen]);

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
          isMock={false}
          onMockLogin={() => {}}
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

  const handleMockLogin = (email: string) => {
    setAuthenticated(true);
    setUser({
      wallet: { address: 'Gv5hX1sJ4qPzMewCHADx1234567890abcdefghijkl' },
      email: { address: email },
    });
    setOpen(false);
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
          isMock={true}
          onMockLogin={handleMockLogin}
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
