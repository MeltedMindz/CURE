'use client';

import { useCureToken } from '@/lib/hooks/useCureToken';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export function ProcessFeesButton() {
  const { isConfigured, processFees, isPending, isConfirming, isConfirmed, error, contractBalance } = useCureToken();

  const handleProcessFees = () => {
    if (!isConfigured) return;
    if (window.confirm('This will process accumulated fees. Continue?')) {
      processFees();
    }
  };

  const isLoading = isPending || isConfirming;

  if (!isConfigured) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <CardTitle>Process Fees</CardTitle>
          <CardDescription>
            Process accumulated ETH fees. 1% reward goes to caller, 49.5% to charity, 49.5% for buyback and burn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-text-muted">
              Contract not yet deployed. This feature will be available once the contract is live.
            </div>
            <Button
              disabled={true}
              size="lg"
              className="w-full"
            >
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Fees</CardTitle>
        <CardDescription>
          Process accumulated ETH fees. 1% reward goes to caller, 49.5% to charity, 49.5% for buyback and burn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contractBalance && parseFloat(contractBalance) > 0 && (
            <div className="text-sm text-text-muted">
              Available to process: {parseFloat(contractBalance).toFixed(4)} ETH
            </div>
          )}
          
          <Button
            onClick={handleProcessFees}
            isLoading={isLoading}
            disabled={isLoading || !contractBalance || parseFloat(contractBalance) === 0}
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Process Fees'}
          </Button>

          {error && (
            <div className="text-sm text-red-400">
              Error: {error.message}
            </div>
          )}

          {isConfirmed && (
            <div className="text-sm text-[var(--primary)]">
              Fees processed successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
