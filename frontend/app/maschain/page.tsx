import { MasChainWalletManager } from '@/app/components/MasChainWalletManager';

export default function MasChainPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">MasChain Integration</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blockchain wallet and tokens on MasChain (no MetaMask required)
          </p>
        </div>

        <MasChainWalletManager />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'MasChain Integration - FairLance',
  description: 'Manage your blockchain wallet, KYC verification, and smart contracts on MasChain',
};
