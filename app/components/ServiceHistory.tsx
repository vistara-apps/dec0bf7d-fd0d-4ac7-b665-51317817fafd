'use client';

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Wrench, Plus, Search, Filter } from 'lucide-react';
import { ServiceRecord, Vehicle } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ServiceHistoryProps {
  vehicle: Vehicle;
  onAddService?: () => void;
}

export function ServiceHistory({ vehicle, onAddService }: ServiceHistoryProps) {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchServiceRecords();
  }, [vehicle.vehicleId]);

  const fetchServiceRecords = async () => {
    try {
      const response = await fetch(`/api/service-records?vehicleId=${vehicle.vehicleId}`);
      if (response.ok) {
        const records = await response.json();
        setServiceRecords(records);
      }
    } catch (error) {
      console.error('Error fetching service records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = serviceRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.partsUsed.some(part => part.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalSpent = serviceRecords.reduce((sum, record) => sum + record.totalCost, 0);
  const averageCost = serviceRecords.length > 0 ? totalSpent / serviceRecords.length : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-fg">Service History</h2>
          <p className="text-text-secondary">
            {vehicle.year} {vehicle.make} {vehicle.model} • {serviceRecords.length} services
          </p>
        </div>
        {onAddService && (
          <button
            onClick={onAddService}
            className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Total Spent</p>
              <p className="text-xl font-semibold text-fg">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Services Completed</p>
              <p className="text-xl font-semibold text-fg">{serviceRecords.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Average Cost</p>
              <p className="text-xl font-semibold text-fg">{formatCurrency(averageCost)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Service Records */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fg mb-2">
              {searchTerm ? 'No services found' : 'No service history'}
            </h3>
            <p className="text-text-secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Service records will appear here once added'}
            </p>
          </div>
        ) : (
          filteredRecords
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((record) => (
              <div key={record.recordId} className="glass-card rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-fg">{record.description}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'completed' ? 'bg-success/10 text-success' :
                        record.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {record.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(record.totalCost)}</span>
                      </div>
                    </div>

                    {record.partsUsed.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-fg mb-2">Parts Used:</p>
                        <div className="flex flex-wrap gap-2">
                          {record.partsUsed.map((part, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-surface/50 rounded text-xs text-text-secondary"
                            >
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>Mechanic: {record.mechanicName}</span>
                      {record.laborCost > 0 && (
                        <span>Labor: {formatCurrency(record.laborCost)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

