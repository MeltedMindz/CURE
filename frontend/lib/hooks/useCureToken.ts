'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { getCureTokenAddress, CURE_TOKEN_ABI } from '@/lib/contracts';
import { formatEther, parseEther } from 'viem';

export function useCureToken() {
  const { address } = useAccount();
  const tokenAddress = getCureTokenAddress();
  const isConfigured = tokenAddress !== null;

  // Read functions - only enabled if contract is configured
  const { data: name } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'name',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'symbol',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: charityWallet } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'charityWallet',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: hook } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'hook',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: totalFeesReceived } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'totalFeesReceived',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: lastProcessBlock } = useReadContract({
    address: tokenAddress || undefined,
    abi: CURE_TOKEN_ABI,
    functionName: 'lastProcessBlock',
    query: {
      enabled: isConfigured,
    },
  });

  const { data: userBalance } = useBalance({
    address: address,
    token: tokenAddress || undefined,
    query: {
      enabled: isConfigured && !!address,
    },
  });

  const { data: contractBalance } = useBalance({
    address: tokenAddress || undefined,
    query: {
      enabled: isConfigured,
    },
  });

  // Write functions
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const processFees = () => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: CURE_TOKEN_ABI,
      functionName: 'processFees',
    });
  };

  const burn = (amount: string) => {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: CURE_TOKEN_ABI,
      functionName: 'burn',
      args: [parseEther(amount)],
    });
  };

  return {
    // Contract configuration
    isConfigured,
    
    // Read state
    name,
    symbol,
    totalSupply: totalSupply ? formatEther(totalSupply as bigint) : undefined,
    charityWallet,
    hook,
    totalFeesReceived: totalFeesReceived ? formatEther(totalFeesReceived as bigint) : undefined,
    lastProcessBlock,
    userBalance: userBalance ? formatEther(userBalance.value) : undefined,
    contractBalance: contractBalance ? formatEther(contractBalance.value) : undefined,
    
    // Write functions
    processFees,
    burn,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}
