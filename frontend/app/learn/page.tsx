import type { Metadata } from 'next';
import Link from 'next/link';
import { CUREConnectButton } from '@/components/ConnectButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Learn | CURE Onchain',
  description: 'Learn how CURE Onchain transforms trading activity into measurable impact through transparent onchain fee routing.',
};

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border-dark bg-surface-1 sticky top-0 z-50 backdrop-blur-sm bg-surface-1/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded"
            aria-label="CURE Onchain Home"
          >
            <Logo variant="lockup" size={28} className="hidden sm:inline-flex" />
            <Logo variant="mark" size={24} className="sm:hidden" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-text-muted hover:text-text font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded">
              Home
            </Link>
            <Link href="/app" className="text-text-muted hover:text-text font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded">
              App
            </Link>
            <CUREConnectButton />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-surface-1 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
                CURE Onchain Overview
              </h1>
              <p className="text-xl md:text-2xl text-text-muted">
                Where trading activity becomes measurable impact
              </p>
            </div>
          </div>
        </section>

        {/* Mission and Intent */}
        <section className="bg-surface-2 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader title="Mission and Intent" align="left" />
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  CURE Onchain transforms routine trading activity into predictable, measurable funding for pediatric cancer research at St. Jude Children&apos;s Research Hospital. Every swap in the CURE/ETH pool generates fees that flow directly to charitable impact and token supply reduction.
                </p>
                <p>
                  The protocol operates with complete transparency and enforceability through onchain smart contracts. All economics are visible, verifiable, and executed without discretionary control. This creates a public good where trading volume directly correlates with charitable donations and holder-aligned supply reduction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-surface-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader title="How the Mechanism Works" align="left" />
              <div className="space-y-6">
                <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                  <p>
                    CURE Onchain collects fees in ETH, not in the token itself. When users swap tokens in the CURE/ETH pool, a fee is generated and accumulates in the contract. The fee percentage starts high at launch and gradually decays over time, creating a predictable transition from launch dynamics to steady state operations.
                  </p>
                  <p>
                    Anyone can call the <code className="px-2 py-1 bg-surface-3 rounded text-[var(--primary)] font-mono text-sm">processFees()</code> function to process accumulated ETH. The caller receives a fixed percentage reward for providing this service. The remaining ETH is split equally: half is swapped to USDC and sent to the configured St. Jude recipient address, and half is swapped to CURE tokens and permanently burned.
                  </p>
                  <p>
                    This permissionless design ensures the system continues operating without relying on a single operator. Anyone motivated by the caller reward can process fees and enable the charitable and supply reduction flows.
                  </p>
                </div>

                <Card variant="elevated" className="bg-surface-3 border-l-4 border-l-[var(--primary)]">
                  <CardHeader>
                    <CardTitle>Fee Flow Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-text-muted">
                      <div className="flex items-start gap-3">
                        <span className="text-[var(--primary)] font-bold">1.</span>
                        <span>ETH fees accumulate from swaps</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[var(--primary)] font-bold">2.</span>
                        <span>Anyone calls processFees() to process accumulated ETH</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[var(--primary)] font-bold">3.</span>
                        <span>Caller receives a fixed percentage reward</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[var(--primary)] font-bold">4.</span>
                        <span>Remaining ETH splits: 50% to charity (USDC), 50% to buyback and burn</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why ETH Based Fees Matter */}
        <section className="bg-surface-2 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader title="Why ETH Based Fees Matter" align="left" />
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  By collecting fees in ETH rather than the CURE token itself, the protocol creates zero sell pressure from fee conversion. Token holders do not experience dilution or selling from the protocol&apos;s fee collection mechanism. This design protects holder value while enabling direct charitable impact.
                </p>
                <p>
                  ETH based fees also provide clear accounting and predictable settlement behavior. The fee amount is always visible as ETH in the contract, and the conversion to USDC for charity and CURE for buyback happens through established onchain swap mechanisms. This transparency makes it easy to verify that funds are routed correctly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Alignment and Incentives */}
        <section className="bg-surface-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader title="Alignment and Incentives" align="left" />
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  The 50/50 split between charitable donation and token supply reduction creates perfect alignment between holder incentives and social impact. Every dollar that benefits token holders through supply reduction is matched by a dollar sent to St. Jude. This means impact and value scale together as trading volume increases.
                </p>
                <p>
                  Permissionless fee processing keeps the system operating without relying on a trusted operator. The caller reward creates a market incentive for anyone to process fees regularly. This removes single points of failure and ensures the protocol continues functioning even if the original builder is unavailable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency */}
        <section className="bg-surface-2 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader title="Transparency" align="left" />
              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  All protocol economics are enforced onchain by smart contracts. Fee collection, processing logic, split percentages, and recipient addresses are visible in the contract code and verifiable through onchain transactions. There is no discretionary control over fee routing or recipient selection.
                </p>
                <p>
                  Users can verify the charity recipient address, fee split percentages, caller reward percentage, and all other protocol parameters directly from the deployed contracts. This transparency builds trust and allows for independent verification that the protocol operates as designed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risks and Limitations */}
        <section className="bg-surface-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SectionHeader title="Risks and Limitations" align="left" />
              <div className="space-y-6">
                <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                  <p>
                    Smart contract risk: The protocol depends on smart contract code. Bugs or vulnerabilities in the contracts could result in loss of funds. Users should understand that smart contracts are experimental technology and use the protocol at their own risk.
                  </p>
                  <p>
                    Market volatility: Token prices, ETH prices, and trading volume are subject to market conditions. The amount of fees collected and the impact of buyback and burn depend on market activity, which cannot be predicted or guaranteed.
                  </p>
                  <p>
                    Network conditions: Fee processing and swap execution depend on Ethereum network conditions. High gas prices or network congestion can affect when and how fees are processed. The caller reward may not always cover gas costs during periods of high network activity.
                  </p>
                  <p>
                    Charity address verification: Users should independently verify the charity recipient address before making any decisions. The protocol routes funds to a configured address, but users are responsible for verifying that this address is correct and authorized.
                  </p>
                  <p className="font-medium text-text">
                    This information is for educational purposes only and does not constitute investment, tax, or legal advice. Users should conduct their own research and consult with qualified professionals before making any decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark bg-surface-1 py-10">
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
