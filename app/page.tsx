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
  Filter,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { AppShell } from './components/AppShell';
import { MetricCard } from './components/MetricCard';
import { DiagnosticCard } from './components/DiagnosticCard';
import { FileUploader } from './components/FileUploader';
import { BaseFrame } from './components/BaseFrame';
import { formatCurrency } from '@/lib/utils';
import { Diagnostic, Vehicle } from '@/lib/types';
import { CacheService } from '@/lib/cache';

export default function Dashboard() {
  const [showNewDiagnostic, setShowNewDiagnostic] = useState(false);
  const [recentDiagnostics, setRecentDiagnostics] = useState<Diagnostic[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load cached data first
      const cachedMetrics = CacheService.get(CacheService.getDashboardMetricsCacheKey());
      const cachedDiagnostics = CacheService.get(CacheService.getDiagnosticsCacheKey());
      const cachedVehicles = CacheService.get(CacheService.getVehicleCacheKey());

      if (cachedMetrics) setDashboardMetrics(cachedMetrics);
      if (cachedDiagnostics) setRecentDiagnostics(cachedDiagnostics);
      if (cachedVehicles) setVehicles(cachedVehicles);

      // Fetch fresh data
      const [metricsRes, diagnosticsRes, vehiclesRes] = await Promise.all([
        fetch('/api/dashboard/metrics'),
        fetch('/api/diagnostics'),
        fetch('/api/vehicles')
      ]);

      if (metricsRes.ok) {
        const metrics = await metricsRes.json();
        setDashboardMetrics(metrics);
        CacheService.set(CacheService.getDashboardMetricsCacheKey(), metrics, 10);
      }

      if (diagnosticsRes.ok) {
        const diagnostics = await diagnosticsRes.json();
        setRecentDiagnostics(diagnostics);
        CacheService.set(CacheService.getDiagnosticsCacheKey(), diagnostics, 5);
      }

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData);
        CacheService.set(CacheService.getVehicleCacheKey(), vehiclesData, 15);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDiagnostic = async (files: File[], type: 'video' | 'audio' | 'text' | 'obd2') => {
    if (files.length === 0 || vehicles.length === 0) return;

    try {
      // Create diagnostic record
      const diagnosticData = {
        vehicleId: vehicles[0].vehicleId,
        dataType: type,
        dataUrl: '', // Will be set after upload
        status: 'pending'
      };

      const createRes = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diagnosticData)
      });

      if (!createRes.ok) throw new Error('Failed to create diagnostic');

      const diagnostic = await createRes.json();

      // Upload file
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('type', 'diagnostic');
      formData.append('vehicleId', vehicles[0].vehicleId);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();

        // Update diagnostic with file URL
        await fetch(`/api/diagnostics/${diagnostic.diagnosticId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: uploadData.url })
        });

        // Trigger AI analysis
        await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            diagnosticId: diagnostic.diagnosticId,
            dataType: type,
            data: 'Sample diagnostic data', // In real app, extract from file
            vehicleId: vehicles[0].vehicleId
          })
        });
      }

      setShowNewDiagnostic(false);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating diagnostic:', error);
    }
  };

  const filteredDiagnostics = recentDiagnostics.filter(diagnostic => {
    const vehicle = vehicles.find(v => v.vehicleId === diagnostic.vehicleId);
    const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : '';
    return vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           diagnostic.detectedFaults.some(fault =>
             fault.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  if (loading) {
    return (
      <AppShell currentPage="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <BaseFrame>
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
          {dashboardMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Vehicles"
                value={dashboardMetrics.totalVehicles}
                subtitle="Under management"
                icon={Car}
                trend={{ value: 12, isPositive: true }}
              />
              <MetricCard
                title="Active Diagnostics"
                value={dashboardMetrics.activeDiagnostics}
                subtitle="In progress"
                icon={Brain}
                trend={{ value: 8, isPositive: true }}
              />
              <MetricCard
                title="Completed Reports"
                value={dashboardMetrics.completedDiagnostics.toLocaleString()}
                subtitle="All time"
                icon={FileText}
                trend={{ value: 15, isPositive: true }}
              />
              <MetricCard
                title="Revenue"
                value={formatCurrency(dashboardMetrics.totalRevenue)}
                subtitle="This month"
                icon={DollarSign}
                trend={{ value: 23, isPositive: true }}
              />
            </div>
          )}

          {/* Performance Metrics */}
          {dashboardMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricCard
                title="Avg Diagnostic Time"
                value={`${dashboardMetrics.avgDiagnosticTime} min`}
                subtitle="Per diagnostic"
                icon={Clock}
                trend={{ value: 5, isPositive: false }}
              />
              <MetricCard
                title="Customer Satisfaction"
                value={`${dashboardMetrics.customerSatisfaction}/5.0`}
                subtitle="Average rating"
                icon={TrendingUp}
                trend={{ value: 2, isPositive: true }}
              />
            </div>
          )}

          {/* Predictive Insights Preview */}
          {vehicles.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-fg">Predictive Maintenance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-surface/50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Engine Health</p>
                  <p className="text-lg font-semibold text-success">Good</p>
                </div>
                <div className="text-center p-4 bg-surface/50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Brake Pads</p>
                  <p className="text-lg font-semibold text-warning">Monitor</p>
                </div>
                <div className="text-center p-4 bg-surface/50 rounded-lg">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Next Service</p>
                  <p className="text-lg font-semibold text-primary">2 weeks</p>
                </div>
              </div>
            </div>
          )}

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
              const vehicle = vehicles.find(v => v.vehicleId === diagnostic.vehicleId);
              return (
                <DiagnosticCard
                  key={diagnostic.diagnosticId}
                  diagnostic={diagnostic}
                  vehicle={vehicle}
                  onView={(diag) => console.log('View diagnostic:', diag)}
                  onShare={async (diag) => {
                    try {
                      const response = await fetch('/api/share/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          diagnosticId: diag.diagnosticId,
                          maxAccessCount: 10,
                          expiresInDays: 30
                        })
                      });

                      if (response.ok) {
                        const result = await response.json();
                        navigator.clipboard.writeText(result.shareUrl);
                        alert('Share link copied to clipboard!');
                      }
                    } catch (error) {
                      console.error('Error creating share:', error);
                    }
                  }}
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

              <FileUploader
                onUpload={handleNewDiagnostic}
                maxFiles={1}
                maxSize={100}
                acceptedTypes={['video/*', 'audio/*', 'image/*', 'text/*', '.json']}
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
    </BaseFrame>
  );
}
