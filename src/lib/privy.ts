// Privy configuration
export const privyConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'clp_demo_app_id',
  config: {
    loginMethods: ['email', 'wallet'],
    appearance: {
      theme: 'light',
      accentColor: '#676FFF',
      logo: '/logo.png', // Add your logo later
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets', // Auto-create wallets for email users
    },
    supportedChains: [
      {
        id: 8453, // Base
        name: 'Base',
        network: 'base',
        nativeCurrency: {
          decimals: 18,
          name: 'Ethereum',
          symbol: 'ETH',
        },
        rpcUrls: {
          default: {
            http: ['https://mainnet.base.org'],
          },
          public: {
            http: ['https://mainnet.base.org'],
          },
        },
      },
      {
        id: 101, // Solana Mainnet
        name: 'Solana',
        network: 'solana',
      },
    ],
  },
};