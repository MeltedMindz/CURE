import type { Metadata } from 'next';
import Link from 'next/link';
import { CUREConnectButton } from '@/components/ConnectButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Logo } from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Legal | CURE Onchain',
  description: 'Legal disclaimers and terms for CURE Onchain protocol usage.',
};

export default function LegalPage() {
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
                Legal Disclaimer
              </h1>
              <p className="text-lg text-text-muted">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Legal Content */}
        <section className="bg-surface-1 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* No Financial Advice */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>No Financial Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      The information on this website is provided for informational purposes only. Nothing on this site constitutes investment, tax, legal, or financial advice. You should not construe any information or other material on this site as investment, tax, legal, or financial advice.
                    </p>
                    <p>
                      Before making any decisions regarding the CURE token or the CURE Onchain protocol, you should consult with qualified financial, tax, and legal advisors to understand the risks and implications for your specific situation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* No Guarantee of Outcomes */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>No Guarantee of Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      The CURE Onchain protocol makes no guarantees regarding any outcomes, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>The amount or frequency of charitable donations</li>
                      <li>Token price, liquidity, or market performance</li>
                      <li>Protocol uptime or availability</li>
                      <li>Fee processing frequency or caller rewards</li>
                      <li>Network conditions or transaction execution</li>
                    </ul>
                    <p>
                      All protocol operations depend on market conditions, network conditions, and user behavior, which cannot be predicted or guaranteed.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Contract and Technical Risk */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>Smart Contract and Technical Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      Smart contracts are experimental technology. The CURE Onchain protocol is implemented through smart contracts that may contain bugs, vulnerabilities, or errors that could result in loss of funds or protocol malfunction.
                    </p>
                    <p>
                      The protocol interacts with external systems including Uniswap, token contracts, and the Ethereum network. Failures in these external systems, network congestion, or other technical issues could prevent the protocol from functioning as designed.
                    </p>
                    <p>
                      You use the CURE Onchain protocol at your own risk. There is no guarantee that the protocol will function correctly, securely, or at all.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Third Party Services */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>Third Party Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      The CURE Onchain protocol depends on third party services and protocols, including but not limited to Uniswap, the Ethereum network, and various token contracts. The protocol has no control over the availability, functionality, or behavior of these third party services.
                    </p>
                    <p>
                      Third party services may experience downtime, security issues, or changes that affect the CURE Onchain protocol&apos;s ability to function. The protocol is not responsible for failures or issues arising from third party services.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Charity Related Disclaimer */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>Charity Related Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      The CURE Onchain protocol routes funds to a configured charity recipient address. Users should independently verify that this address is correct and authorized before making any decisions regarding protocol usage.
                    </p>
                    <p>
                      The protocol does not guarantee that funds will be received by the intended recipient, that the recipient address is correct, or that donations will be used as intended. Users are responsible for verifying recipient details and making their own determinations about the legitimacy and effectiveness of charitable routing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      To the maximum extent permitted by applicable law, the CURE Onchain protocol, its builders, contributors, and operators disclaim all liability for any damages, losses, or harms arising from use of the protocol, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Loss of funds due to smart contract bugs or vulnerabilities</li>
                      <li>Loss of funds due to user error</li>
                      <li>Loss of funds due to third party service failures</li>
                      <li>Loss of funds due to market conditions or token price changes</li>
                      <li>Loss of funds due to network conditions or transaction failures</li>
                      <li>Any indirect, incidental, or consequential damages</li>
                    </ul>
                    <p>
                      By using the CURE Onchain protocol, you acknowledge that you assume all risks and agree to use the protocol at your own risk.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Jurisdiction and Changes */}
              <Card variant="elevated" className="bg-surface-3">
                <CardHeader>
                  <CardTitle>Jurisdiction and Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-text-muted leading-relaxed">
                    <p>
                      These terms and disclaimers may be updated at any time without notice. It is your responsibility to review this page periodically for changes. Continued use of the protocol after changes constitutes acceptance of the updated terms.
                    </p>
                    <p>
                      These terms are governed by applicable law. If any provision is found to be unenforceable, the remaining provisions will continue in full force and effect.
                    </p>
                  </div>
                </CardContent>
              </Card>
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
