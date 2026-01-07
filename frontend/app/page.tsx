import Link from 'next/link';
import { CUREConnectButton } from '@/components/ConnectButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { CredibilityStrip } from '@/components/CredibilityStrip';
import { DonationRow } from '@/components/DonationRow';
import { Logo } from '@/components/Logo';
import { GeometricLogo } from '@/components/GeometricLogo';
import { AnimatedCounter } from '@/components/AnimatedCounter';
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
            {/* Use new geometric logo */}
            <GeometricLogo size={32} className="hidden sm:flex" />
            <GeometricLogo size={28} showText={false} className="sm:hidden" />
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
      <section className="bg-surface-1 py-24 md:py-32 relative overflow-hidden">
        {/* Enhanced floating geometric background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 opacity-10 floating-element" style={{animationDelay: '0s'}}>
            <GeometricLogo size={64} showText={false} />
          </div>
          <div className="absolute top-40 right-20 w-12 h-12 opacity-5 floating-element" style={{animationDelay: '2s'}}>
            <GeometricLogo size={48} showText={false} />
          </div>
          <div className="absolute bottom-20 left-1/4 w-10 h-10 opacity-10 floating-element" style={{animationDelay: '4s'}}>
            <GeometricLogo size={40} showText={false} />
          </div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 opacity-5 floating-element" style={{animationDelay: '1s'}}>
            <GeometricLogo size={32} showText={false} />
          </div>
          
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 shimmer-effect pointer-events-none"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Large geometric logo with pulse effect */}
            <div className="mb-8 flex justify-center">
              <div className="pulse-on-hover">
                <GeometricLogo size={120} showText={false} className="opacity-80" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-6 leading-tight animate-on-scroll">
              {landingContent.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-3xl mx-auto leading-relaxed animate-on-scroll" style={{animationDelay: '0.2s'}}>
              {landingContent.hero.subtitle}
            </p>
            <div className="flex gap-4 justify-center flex-wrap animate-on-scroll" style={{animationDelay: '0.4s'}}>
              <Link href="/app">
                <Button size="lg" className="micro-bounce">Launch App</Button>
              </Link>
              <Link href="/learn">
                <Button variant="outline" size="lg" className="micro-bounce">Learn More</Button>
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
            <div className="interactive-card">
              <StatCard
                label={landingContent.stats.donationSplit.label}
                value={landingContent.stats.donationSplit.value}
                description={landingContent.stats.donationSplit.description}
              />
            </div>
            <div className="interactive-card">
              <StatCard
                label={landingContent.stats.buybackBurn.label}
                value={landingContent.stats.buybackBurn.value}
                description={landingContent.stats.buybackBurn.description}
              />
            </div>
            <div className="interactive-card">
              <StatCard
                label={landingContent.stats.feeRange.label}
                value={landingContent.stats.feeRange.value}
                description={landingContent.stats.feeRange.description}
              />
            </div>
            <div className="interactive-card">
              <StatCard
                label={landingContent.stats.callerReward.label}
                value={landingContent.stats.callerReward.value}
                description={landingContent.stats.callerReward.description}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-surface-2">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title={landingContent.howItWorks.title} />
            <div className="space-y-8 mb-10">
              {landingContent.howItWorks.steps.map((step, index) => (
                <div key={step.number} className="interactive-card">
                  <Card variant="elevated" className="border-l-4 border-l-[var(--primary)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--primary)] font-bold text-sm pulse-on-hover">
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
                </div>
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
      <section className="py-24 bg-surface-1 relative overflow-hidden">
        {/* Background geometric patterns */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 floating-element" style={{animationDelay: '0s'}}>
            <GeometricLogo size={384} showText={false} />
          </div>
          <div className="absolute bottom-0 left-0 w-64 h-64 floating-element" style={{animationDelay: '3s'}}>
            <GeometricLogo size={256} showText={false} />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title={landingContent.impact.title} align="left" />
            
            {/* Stunning impact visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                {landingContent.impact.content.map((paragraph, index) => (
                  <p key={index} className="text-text-muted text-lg leading-relaxed animate-on-scroll" style={{animationDelay: `${index * 0.1}s`}}>
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Interactive impact counter */}
              <div className="interactive-card">
                <Card variant="elevated" className="bg-gradient-to-br from-surface-2 to-surface-3 border-[var(--primary)]/20">
                  <CardContent className="p-8 text-center">
                    <div className="mb-4">
                      <div className="pulse-on-hover inline-block">
                        <GeometricLogo size={60} showText={false} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-3xl font-bold text-[var(--primary)]">
                          <AnimatedCounter targetValue="50%" className="block" />
                        </div>
                        <div className="text-sm text-text-muted">To cancer research funding</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-[var(--primary)]">
                          <AnimatedCounter targetValue="50%" className="block" />
                        </div>
                        <div className="text-sm text-text-muted">To token buyback & burn</div>
                      </div>
                      <div className="text-xs text-text-muted italic mt-4">
                        *Impact scales directly with trading volume
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {hasCharityAddress && (
              <div className="mt-8 p-6 geometric-card shimmer-effect">
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
