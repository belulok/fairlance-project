'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Briefcase,
  User,
  FileText,
  Menu,
  X,
  Shield,
  Award,
  Link as LinkIcon
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { ClientOnlyConnectButton } from './ClientOnlyConnectButton';
import { SafeConnectButton } from './SafeConnectButton';
import { MetaMaskConnectButton } from './MetaMaskConnectButton';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Features', href: '/features', icon: Award },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'MasChain', href: '/maschain', icon: LinkIcon },
  { name: 'Dashboard', href: '/dashboard', icon: User, requiresAuth: true },
  { name: 'My Proposals', href: '/my-proposals', icon: FileText, requiresAuth: true },
];

export function Navigation() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Simplified for demo - no wagmi/RainbowKit
  const isConnected = false;
  const address: string | undefined = undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">FL</span>
                </div>
                <span className="font-bold text-xl">FairLance</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-32 bg-primary/10 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FairLance</span>
            <Badge variant="outline" className="text-xs">Beta</Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const canAccess = !item.requiresAuth || isConnected;

              if (!canAccess) return null;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isConnected && address && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Badge>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
            <SafeConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const canAccess = !item.requiresAuth || isConnected;

                if (!canAccess) return null;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-border">
                {isConnected && address && (
                  <div className="flex items-center gap-2 px-3 py-2 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </Badge>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
                <div className="px-3">
                  <SafeConnectButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
