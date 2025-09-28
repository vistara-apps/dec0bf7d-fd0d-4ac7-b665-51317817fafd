'use client';

import { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';
import { AppShell } from '../components/AppShell';
import { MetricCard } from '../components/MetricCard';
import { Car, Brain, FileText, DollarSign } from 'lucide-react';

const themes = [
  { id: 'default', name: 'Default (Automotive)', description: 'Dark teal with coral accents' },
  { id: 'celo', name: 'Celo', description: 'Black with yellow accents' },
  { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
  { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
  { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue accents' },
];

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  return (
    <AppShell currentPage="Theme Preview">
      <div className="space-y-6">
        <div className="glass-card rounded-xl p-6">
          <h1 className="text-2xl font-bold text-fg mb-4">Theme Preview</h1>
          <p className="text-text-secondary mb-6">
            Preview different themes for AutoDiagnostics AI. Changes are applied instantly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as any)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  theme === themeOption.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <h3 className="font-semibold text-fg">{themeOption.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{themeOption.description}</p>
                {theme === themeOption.id && (
                  <div className="mt-2">
                    <span className="text-xs bg-accent text-white px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Component Preview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Vehicles"
              value={25}
              subtitle="Under management"
              icon={Car}
              trend={{ value: 12, isPositive: true }}
            />
            <MetricCard
              title="Active Diagnostics"
              value={3}
              subtitle="In progress"
              icon={Brain}
              trend={{ value: 8, isPositive: true }}
            />
            <MetricCard
              title="Completed Reports"
              value="1,788"
              subtitle="All time"
              icon={FileText}
              trend={{ value: 15, isPositive: true }}
            />
            <MetricCard
              title="Revenue"
              value="$47,500"
              subtitle="This month"
              icon={DollarSign}
              trend={{ value: 23, isPositive: true }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Button Styles</h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary px-6 py-3 rounded-lg font-medium">
              Primary Button
            </button>
            <button className="btn-secondary px-6 py-3 rounded-lg font-medium">
              Secondary Button
            </button>
            <button className="diagnostic-status-completed px-4 py-2 rounded-full text-sm font-medium">
              Completed
            </button>
            <button className="diagnostic-status-pending px-4 py-2 rounded-full text-sm font-medium">
              Pending
            </button>
            <button className="diagnostic-status-failed px-4 py-2 rounded-full text-sm font-medium">
              Failed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-fg">Color Palette</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 bg-bg rounded-lg border border-border"></div>
              <p className="text-sm text-text-secondary">Background</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-surface rounded-lg border border-border"></div>
              <p className="text-sm text-text-secondary">Surface</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-accent rounded-lg"></div>
              <p className="text-sm text-text-secondary">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-primary rounded-lg"></div>
              <p className="text-sm text-text-secondary">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-success rounded-lg"></div>
              <p className="text-sm text-text-secondary">Success</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 bg-error rounded-lg"></div>
              <p className="text-sm text-text-secondary">Error</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
