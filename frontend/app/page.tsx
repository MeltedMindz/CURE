import Link from 'next/link';
import { CUREConnectButton } from '@/components/ConnectButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { CredibilityStrip } from '@/components/CredibilityStrip';
import { DonationRow } from '@/components/DonationRow';
import { Logo } from '@/components/Logo';
import { landingContent } from '@/lib/content/landing';
import { config } from '@/lib/config';

export default function Home() {
  const charityAddress = config.contracts.charityWallet;
  const hasCharityAddress = charityAddress && charityAddress !== '';

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
            {/* Responsive: mark on small screens, lockup on larger */}
            <Logo variant="lockup" size={28} className="hidden sm:inline-flex" />
            <Logo variant="mark" size={24} className="sm:hidden" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/app" className="text-text-muted hover:text-text font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:ring-offset-2 focus:ring-offset-surface-1 rounded">
              App
            </Link>
            <CUREConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-surface-1 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 leading-tight">
              {landingContent.hero.title}
          </h1>
            <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              {landingContent.hero.subtitle}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/app">
                <Button size="lg">Launch App</Button>
              </Link>
              <Link href="/learn">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <CredibilityStrip bullets={landingContent.credibility.bullets} />

      {/* Key Stats */}
      <section className="py-20 bg-surface-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StatCard
              label={landingContent.stats.donationSplit.label}
              value={landingContent.stats.donationSplit.value}
              description={landingContent.stats.donationSplit.description}
            />
            <StatCard
              label={landingContent.stats.buybackBurn.label}
              value={landingContent.stats.buybackBurn.value}
              description={landingContent.stats.buybackBurn.description}
            />
            <StatCard
              label={landingContent.stats.feeRange.label}
              value={landingContent.stats.feeRange.value}
              description={landingContent.stats.feeRange.description}
            />
            <StatCard
              label={landingContent.stats.callerReward.label}
              value={landingContent.stats.callerReward.value}
              description={landingContent.stats.callerReward.description}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-surface-2">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title={landingContent.howItWorks.title} />
            <div className="space-y-8 mb-10">
              {landingContent.howItWorks.steps.map((step) => (
                <Card key={step.number} variant="elevated" className="border-l-4 border-l-[var(--primary)]">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--primary)] font-bold text-sm">
                        {step.number}
                      </div>
                      <CardTitle className="text-xl">
                        {step.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted leading-relaxed text-base">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card variant="outlined" className="bg-surface-3/50">
              <CardContent className="pt-6 pb-6">
                <div className="text-center">
                  <p className="font-mono text-sm text-[var(--primary)] font-medium">
                    {landingContent.howItWorks.formula}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact and Alignment */}
      <section className="py-24 bg-surface-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title={landingContent.impact.title} align="left" />
            <div className="space-y-6">
              {landingContent.impact.content.map((paragraph, index) => (
                <p key={index} className="text-text-muted text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            {hasCharityAddress && (
              <div className="mt-8 p-4 bg-surface-3 rounded-lg border border-border-dark">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">St. Jude Recipient Address</p>
                <p className="font-mono text-sm text-text break-all">{charityAddress}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Builder Disclosure and Support - De-emphasized */}
      <section className="py-16 bg-surface-2">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card variant="default" className="border border-border-dark">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-text-muted">
                  {landingContent.builderDisclosureAndSupport.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Support the Builder */}
                  <div>
                    <h3 className="text-base font-semibold text-text mb-3">
                      {landingContent.builderDisclosureAndSupport.supportSection.title}
                    </h3>
                    <div className="space-y-2 text-text-muted text-sm mb-4">
                      {landingContent.builderDisclosureAndSupport.supportSection.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <DonationRow
                        label={landingContent.builderDisclosureAndSupport.supportSection.addresses.ens.label}
                        value={landingContent.builderDisclosureAndSupport.supportSection.addresses.ens.value}
                        showCopy={true}
                      />
                      <DonationRow
                        label={landingContent.builderDisclosureAndSupport.supportSection.addresses.eth.label}
                        value={landingContent.builderDisclosureAndSupport.supportSection.addresses.eth.value}
                        showCopy={true}
                      />
                      <DonationRow
                        label={landingContent.builderDisclosureAndSupport.supportSection.addresses.btc.label}
                        value={landingContent.builderDisclosureAndSupport.supportSection.addresses.btc.value}
                        showCopy={true}
                      />
                    </div>

                    <div className="mt-4 pt-4 border-t border-border-dark">
                      <p className="text-xs text-text-muted italic">
                        {landingContent.builderDisclosureAndSupport.supportSection.contributionNote}
                      </p>
                    </div>
                  </div>

                  {/* Builder Disclosure */}
                  <div className="pt-4 border-t border-border-dark">
                    <h3 className="text-base font-semibold text-text mb-3">
                      {landingContent.builderDisclosureAndSupport.disclosureSection.title}
                    </h3>
                    <div className="space-y-2 text-text-muted text-sm">
                      {landingContent.builderDisclosureAndSupport.disclosureSection.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-dark bg-surface-1 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <p className="text-text-muted text-sm text-center md:text-left">{landingContent.footer.text}</p>
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
