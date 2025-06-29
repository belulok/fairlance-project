import { MasChainDashboard } from '@/app/components/MasChainDashboard';

export default function MasChainPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MasChainDashboard />
    </div>
  );
}

export const metadata = {
  title: 'MasChain Integration - FairLance',
  description: 'Manage your blockchain wallet, KYC verification, and smart contracts on MasChain',
};
