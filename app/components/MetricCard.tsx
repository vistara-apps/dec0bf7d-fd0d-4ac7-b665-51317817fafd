'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className = '' 
}: MetricCardProps) {
  return (
    <div className={`metric-card rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-fg mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-success' : 'text-error'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-text-secondary ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="p-3 rounded-lg bg-accent/20">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
