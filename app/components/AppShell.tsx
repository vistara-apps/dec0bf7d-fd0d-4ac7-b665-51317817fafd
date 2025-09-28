'use client';

import { useState } from 'react';
import { 
  Car, 
  BarChart3, 
  FileText, 
  Settings2, 
  Menu, 
  X,
  Wrench,
  Brain
} from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

interface AppShellProps {
  children: React.ReactNode;
  currentPage?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Diagnostics', href: '/diagnostics', icon: Brain },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings2 },
];

export function AppShell({ children, currentPage = 'Dashboard' }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-gradient">AutoDiagnostics AI</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.name
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'text-text-secondary hover:text-fg hover:bg-white/5'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-surface lg:border-r lg:border-border">
        <div className="flex items-center space-x-2 p-6 border-b border-border">
          <Wrench className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold text-gradient">AutoDiagnostics AI</span>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                currentPage === item.name
                  ? 'bg-accent/20 text-accent border border-accent/30'
                  : 'text-text-secondary hover:text-fg hover:bg-white/5'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-white/5"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-fg">{currentPage}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Avatar className="h-6 w-6" />
                    <Name className="text-sm font-medium" />
                  </div>
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
