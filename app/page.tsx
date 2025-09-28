'use client';

import { useState, useEffect } from 'react';
import { 
  Car, 
  Brain, 
  FileText, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { AppShell } from './components/AppShell';
import { MetricCard } from './components/MetricCard';
import { DiagnosticCard } from './components/DiagnosticCard';
import { MediaUploader } from './components/MediaUploader';
import { mockDashboardMetrics, mockDiagnostics, mockVehicles } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { Diagnostic } from '@/lib/types';

export default function Dashboard() {
  const [showNewDiagnostic, setShowNewDiagnostic] = useState(false);
  const [recentDiagnostics, setRecentDiagnostics] = useState(mockDiagnostics);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewDiagnostic = (file: File, type: 'video' | 'audio' | 'text' | 'obd2') => {
    const newDiagnostic: Diagnostic = {
      diagnosticId: `diag-${Date.now()}`,
      vehicleId: mockVehicles[0].vehicleId,
      timestamp: new Date().toISOString(),
      dataType: type,
      dataUrl: URL.createObjectURL(file),
      aiAnalysis: 'Processing diagnostic data...',
      detectedFaults: [],
      estimatedCost: 0,
      status: 'pending',
      confidence: 0,
      recommendations: []
    };

    setRecentDiagnostics(prev => [newDiagnostic, ...prev]);
    setShowNewDiagnostic(false);

    // Simulate AI processing
    setTimeout(() => {
      setRecentDiagnostics(prev => 
        prev.map(diag => 
          diag.diagnosticId === newDiagnostic.diagnosticId
            ? {
                ...diag,
                status: 'completed' as const,
                aiAnalysis: 'AI analysis completed. Potential issues detected.',
                detectedFaults: ['Engine Performance Issue', 'Sensor Malfunction'],
                estimatedCost: Math.floor(Math.random() * 500) + 100,
                confidence: 0.85 + Math.random() * 0.1,
                recommendations: ['Schedule inspection', 'Replace faulty component']
              }
            : diag
        )
      );
    }, 3000);
  };

  const filteredDiagnostics = recentDiagnostics.filter(diagnostic => {
    const vehicle = mockVehicles.find(v => v.vehicleId === diagnostic.vehicleId);
    const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : '';
    return vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           diagnostic.detectedFaults.some(fault => 
             fault.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  return (
    <AppShell currentPage="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card rounded-xl p-6 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-fg mb-2">
                Welcome to AutoDiagnostics AI
              </h1>
              <p className="text-text-secondary">
                AI-powered vehicle diagnostics and service management
              </p>
            </div>
            <button
              onClick={() => setShowNewDiagnostic(true)}
              className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Diagnostic</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Vehicles"
            value={mockDashboardMetrics.totalVehicles}
            subtitle="Under management"
            icon={Car}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Active Diagnostics"
            value={mockDashboardMetrics.activeDiagnostics}
            subtitle="In progress"
            icon={Brain}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Completed Reports"
            value={mockDashboardMetrics.completedDiagnostics.toLocaleString()}
            subtitle="All time"
            icon={FileText}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Revenue"
            value={formatCurrency(mockDashboardMetrics.totalRevenue)}
            subtitle="This month"
            icon={DollarSign}
            trend={{ value: 23, isPositive: true }}
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MetricCard
            title="Avg Diagnostic Time"
            value={`${mockDashboardMetrics.avgDiagnosticTime} min`}
            subtitle="Per diagnostic"
            icon={Clock}
            trend={{ value: 5, isPositive: false }}
          />
          <MetricCard
            title="Customer Satisfaction"
            value={`${mockDashboardMetrics.customerSatisfaction}/5.0`}
            subtitle="Average rating"
            icon={TrendingUp}
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Recent Diagnostics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-fg">Recent Diagnostics</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search diagnostics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <button className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDiagnostics.slice(0, 6).map((diagnostic) => {
              const vehicle = mockVehicles.find(v => v.vehicleId === diagnostic.vehicleId);
              return (
                <DiagnosticCard
                  key={diagnostic.diagnosticId}
                  diagnostic={diagnostic}
                  vehicle={vehicle}
                  onView={(diag) => console.log('View diagnostic:', diag)}
                  onShare={(diag) => console.log('Share diagnostic:', diag)}
                />
              );
            })}
          </div>

          {filteredDiagnostics.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-fg mb-2">No diagnostics found</h3>
              <p className="text-text-secondary">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first diagnostic'}
              </p>
            </div>
          )}
        </div>

        {/* New Diagnostic Modal */}
        {showNewDiagnostic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-surface rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-fg">New Diagnostic Session</h2>
                <button
                  onClick={() => setShowNewDiagnostic(false)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <MediaUploader
                onUpload={handleNewDiagnostic}
                maxSize={100}
                className="mb-6"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewDiagnostic(false)}
                  className="btn-secondary px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
