import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonAmoy } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, polygon, polygonAmoy],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
})

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_MAINNET || '',
  [sepolia.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA || '',
  [polygon.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON || '',
  [polygonAmoy.id]: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_AMOY || '',
} as const

// Course Payment Contract ABI (only the functions we need)
export const COURSE_PAYMENT_ABI = [
  {
    inputs: [{ name: 'courseId', type: 'string' }],
    name: 'purchaseCourse',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'courseId', type: 'string' }],
    name: 'coursePrices',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'courseId', type: 'string' },
    ],
    name: 'hasPurchased',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'purchaseId', type: 'bytes32' }],
    name: 'getPurchase',
    outputs: [
      { name: 'buyer', type: 'address' },
      { name: 'courseId', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'refunded', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'buyer', type: 'address' },
      { indexed: true, name: 'courseId', type: 'string' },
      { indexed: false, name: 'amount', type: 'uint256' },
      { indexed: true, name: 'purchaseId', type: 'bytes32' },
      { indexed: false, name: 'timestamp', type: 'uint256' },
    ],
    name: 'CoursePurchased',
    type: 'event',
  },
] as const
