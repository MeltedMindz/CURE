'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { CUREConnectButton } from '@/components/ConnectButton';
import { Button } from '@/components/ui/Button';
import { ContractStats } from '@/components/ContractStats';
import { ProcessFeesButton } from '@/components/ProcessFeesButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/Logo';
import { config } from '@/lib/config';
import { getCureTokenAddress, isContractConfigured } from '@/lib/contracts';

export default function AppPage() {
  const { isConnected, address } = useAccount();
  const tokenAddress = getCureTokenAddress();
  const isConfigured = isContractConfigured();

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border-dark bg-surface-1 sticky top-0 z-10 backdrop-blur-sm bg-surface-1/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded"
              aria-label="CURE Onchain Home"
            >
              {/* Responsive: mark on small screens, lockup on larger */}
              <Logo variant="lockup" size={28} className="hidden sm:inline-flex" />
              <Logo variant="mark" size={24} className="sm:hidden" />
            </Link>
            <Badge variant="info">App</Badge>
          </div>
          <CUREConnectButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">CURE Token Dashboard</h1>
          <p className="text-text-muted">
            Interact with the CURE token contract. View stats, process fees, and manage your tokens.
          </p>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <Card className="mb-8 border-l-4 border-l-[var(--primary)] bg-surface-3">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Please connect your wallet to interact with the CURE token contract.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CUREConnectButton />
            </CardContent>
          </Card>
        )}

        {isConnected && (
          <Card className="mb-8 border-l-4 border-l-[var(--primary)] bg-surface-3">
            <CardHeader>
              <CardTitle>Wallet Connected</CardTitle>
              <CardDescription>
                Connected as: <span className="font-mono text-sm text-text">{address}</span>
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Contract Address */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-text-muted">CURE Token:</span>
                <div className="font-mono text-sm break-all mt-1">
                  {isConfigured && tokenAddress ? (
                    <span className="text-text">{tokenAddress}</span>
                  ) : (
                    <span className="text-text-muted">Coming soon</span>
                  )}
                </div>
              </div>
              {isConfigured && tokenAddress && (
                <div className="pt-2">
                  <a
                    href={`https://etherscan.io/address/${tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded"
                  >
                    View on Etherscan →
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contract Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-4">Contract Statistics</h2>
          <ContractStats />
        </div>

        {/* Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProcessFeesButton />
            
            <Card>
              <CardHeader>
                <CardTitle>Trade CURE</CardTitle>
              </CardHeader>
              <CardContent>
                {config.uniswapPoolLink ? (
                  <a href={config.uniswapPoolLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="w-full">
                      Open Uniswap Pool
                    </Button>
                  </a>
                ) : (
                  <Stat
                    label="Swap CURE tokens on Uniswap"
                    value="Coming soon"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Fee Processing Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-text-muted">
              <div>
                <h3 className="font-semibold mb-2 text-text">1. Fee Collection</h3>
                <p className="text-sm">
                  Every swap in the CURE/ETH pool generates fees that accumulate in the contract.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-text">2. Processing</h3>
                <p className="text-sm">
                  Anyone can call `processFees()` to process accumulated ETH. The processing uses a block-based
                  drip mechanism to prevent manipulation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-text">3. Distribution</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>1% reward goes to the caller</li>
                  <li>49.5% swapped to USDC and sent to {config.app.charity.name}</li>
                  <li>49.5% swapped to CURE and permanently burned</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charity Info */}
        <Card>
          <CardHeader>
            <CardTitle>Charity Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-text-muted">Organization:</span>
                <div className="text-lg font-semibold text-text">{config.app.charity.name}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-text-muted">Address:</span>
                <div className="font-mono text-sm break-all text-text">{config.app.charity.address}</div>
              </div>
              <div className="pt-2">
                <a
                  href={`https://etherscan.io/address/${config.app.charity.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded"
                >
                  View on Etherscan →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark bg-surface-1 py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <p className="text-text-muted text-sm text-center md:text-left">
                CURE Onchain - Where every trade creates impact. Where every swap funds research.
              </p>
              <nav className="flex gap-6 text-sm">
                <Link href="/learn" className="text-text-muted hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded">
                  Learn More
                </Link>
                <Link href="/legal" className="text-text-muted hover:text-text transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded">
                  Legal
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
