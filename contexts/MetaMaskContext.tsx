import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { MetaMaskSDK } from '@metamask/sdk';
import { ethers, BrowserProvider } from 'ethers';
import { useAuth } from './AuthContext';

interface MetaMaskContextType {
  sdk: MetaMaskSDK | null;
  walletAddress: string | null;
  ethBalance: string | null;
  isConnected: boolean;
  isLoadingWeb3: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  getEthBalance: (address: string) => Promise<string>;
}

const MetaMaskContext = createContext<MetaMaskContextType | undefined>(undefined);

export function MetaMaskProvider({ children }: { children: ReactNode }) {
  const [sdk, setSdk] = useState<MetaMaskSDK | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingWeb3, setIsLoadingWeb3] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const MMSDK = new MetaMaskSDK({
          dappMetadata: {
            name: 'Mokido Financial Education',
            url: 'https://mokido.app',
            iconUrl: 'https://mokido.app/icon.png',
          },
          // Enable deep linking for mobile
          useDeeplink: true,
          // Configure for embedded wallets
          preferDesktop: false,
          openDeeplink: (link: string) => {
            if (Platform.OS !== 'web' && link) {
              // Handle deep linking on mobile
              console.log('Opening deep link:', link);
              // You can use Linking.openURL(link) here if needed
            }
          },
          // Additional options for embedded wallet support
          extensionOnly: false,
          checkInstallationImmediately: false,
          checkInstallationOnAllCalls: true,
        });

        setSdk(MMSDK);
      } catch (error) {
        console.error('Failed to initialize MetaMask SDK:', error);
      }
    };

    initializeSDK();
  }, []);

  const getEthBalance = async (address: string): Promise<string> => {
    try {
      const provider = sdk?.getProvider();
      if (!provider) {
        throw new Error('MetaMask provider not available');
      }

      const ethersProvider = new BrowserProvider(provider);
      const balance = await ethersProvider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return '0.0';
    }
  };

  const connectWallet = async () => {
    if (!sdk) {
      console.error('MetaMask SDK not initialized');
      return;
    }

    setIsLoadingWeb3(true);
    
    try {
      // Request account access
      const ethereum = sdk.getProvider();
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);

        // Fetch ETH balance
        const balance = await getEthBalance(address);
        setEthBalance(balance);

        // Update user context with wallet info
        updateUser({
          walletAddress: address,
          ethBalance: balance,
        });

        console.log('Wallet connected:', address);
        console.log('ETH Balance:', balance);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnected(false);
      setWalletAddress(null);
      setEthBalance(null);
    } finally {
      setIsLoadingWeb3(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (sdk?.isConnected()) {
        sdk.disconnect();
      }
      
      setWalletAddress(null);
      setEthBalance(null);
      setIsConnected(false);

      // Clear wallet info from user context
      updateUser({
        walletAddress: null,
        ethBalance: null,
      });

      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (sdk?.getProvider() && isConnected) {
      const provider = sdk.getProvider();
      
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          await disconnectWallet();
        } else if (accounts[0] !== walletAddress) {
          // Account changed
          const newAddress = accounts[0];
          setWalletAddress(newAddress);
          
          const balance = await getEthBalance(newAddress);
          setEthBalance(balance);
          
          updateUser({
            walletAddress: newAddress,
            ethBalance: balance,
          });
        }
      };

      provider.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [sdk, walletAddress, updateUser, isConnected]);

  return (
    <MetaMaskContext.Provider value={{
      sdk,
      walletAddress,
      ethBalance,
      isConnected,
      isLoadingWeb3,
      connectWallet,
      disconnectWallet,
      getEthBalance,
    }}>
      {children}
    </MetaMaskContext.Provider>
  );
}

export function useMetaMask() {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
}