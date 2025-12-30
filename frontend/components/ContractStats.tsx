'use client';

import { useCureToken } from '@/lib/hooks/useCureToken';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';

export function ContractStats() {
  const {
    isConfigured,
    totalSupply,
    totalFeesReceived,
    contractBalance,
    charityWallet,
    userBalance,
  } = useCureToken();

  if (!isConfigured) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <Stat
              label="Total Supply"
              value="Coming soon"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <Stat
              label="Total Fees Received"
              value="Coming soon"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <Stat
              label="Pending Processing"
              value="Coming soon"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Supply</CardTitle>
        </CardHeader>
        <CardContent>
          <Stat
            label="Total Supply"
            value={totalSupply ? `${parseFloat(totalSupply).toLocaleString()} CURE` : 'Loading...'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <Stat
            label="Total Fees Received"
            value={totalFeesReceived ? `${parseFloat(totalFeesReceived).toFixed(4)} ETH` : 'Loading...'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <Stat
            label="Pending Processing"
            value={contractBalance ? `${parseFloat(contractBalance).toFixed(4)} ETH` : 'Loading...'}
          />
        </CardContent>
      </Card>

      {userBalance && (
        <Card>
          <CardHeader>
            <CardTitle>Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <Stat
              label="CURE Tokens"
              value={`${parseFloat(userBalance).toLocaleString()} CURE`}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Charity Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-text-muted break-all">
            {charityWallet ? `${charityWallet}` : 'Loading...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
