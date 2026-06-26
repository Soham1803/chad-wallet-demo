'use client';

import React, { createContext, useContext, useState } from 'react';
import { PrivyProvider, usePrivy as useRealPrivy } from '@privy-io/react-auth';

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

// Real Privy provider connector
function RealPrivyConsumer({ children }: { children: React.ReactNode }) {
  const realPrivy = useRealPrivy();
  
  const loginWithRedirect = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shouldRedirectToTrading', 'true');
    }
    realPrivy.login();
  }, [realPrivy]);

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
    </CustomPrivyContext.Provider>
  );
}

// Local mock provider for sandbox environments
function MockPrivyConsumer({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{ wallet?: { address: string }; email?: { address: string } } | null>(null);

  const login = () => {
    // Show a sleek local prompt mimicking social login
    const email = prompt('Sign in via Google (Mock Demo Mode):', 'chad_investor@chadwallet.xyz');
    if (email) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('shouldRedirectToTrading', 'true');
      }
      setAuthenticated(true);
      setUser({
        wallet: { address: 'Gv5hX1sJ4qPzMewCHADx1234567890abcdefghijkl' },
        email: { address: email },
      });
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
    login,
    logout,
  };

  return (
    <CustomPrivyContext.Provider value={mockValue}>
      {children}
    </CustomPrivyContext.Provider>
  );
}

export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clpigg5p600e0la08hu7849cc';
  
  // Run mock mode if app id is the default sandbox one or empty
  const isMock = appId === 'clpigg5p600e0la08hu7849cc' || !appId || appId.includes('xxxx');

  if (isMock) {
    return (
      <MockPrivyConsumer>
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
      <RealPrivyConsumer>
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
