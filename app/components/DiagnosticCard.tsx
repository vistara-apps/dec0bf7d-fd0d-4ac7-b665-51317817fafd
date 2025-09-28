'use client';

import { useState } from 'react';
import { 
  Car, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Share2,
  MoreVertical
} from 'lucide-react';
import { Diagnostic, Vehicle } from '@/lib/types';
import { formatDateTime, formatCurrency, getStatusColor } from '@/lib/utils';

interface DiagnosticCardProps {
  diagnostic: Diagnostic;
  vehicle?: Vehicle;
  onView?: (diagnostic: Diagnostic) => void;
  onShare?: (diagnostic: Diagnostic) => void;
}

export function DiagnosticCard({ 
  diagnostic, 
  vehicle, 
  onView, 
  onShare 
}: DiagnosticCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusIcon = () => {
    switch (diagnostic.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-error" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-warning" />;
    }
  };

  const getDataTypeLabel = () => {
    switch (diagnostic.dataType) {
      case 'obd2':
        return 'OBD-II Scan';
      case 'video':
        return 'Video Analysis';
      case 'audio':
        return 'Audio Analysis';
      case 'text':
        return 'Text Notes';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="metric-card rounded-lg p-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-fg">
              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
            </h3>
            <p className="text-sm text-text-secondary">
              {getDataTypeLabel()} • {formatDateTime(diagnostic.timestamp)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-white/5"
            >
              <MoreVertical className="h-4 w-4 text-text-secondary" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-surface border border-border rounded-lg shadow-modal z-10">
                <button
                  onClick={() => {
                    onView?.(diagnostic);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-white/5 rounded-t-lg"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => {
                    onShare?.(diagnostic);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm hover:bg-white/5 rounded-b-lg"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(diagnostic.status)}`}>
          {diagnostic.status.charAt(0).toUpperCase() + diagnostic.status.slice(1)}
        </span>
      </div>

      {/* Detected Faults */}
      {diagnostic.detectedFaults.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-fg mb-2">Detected Issues</h4>
          <div className="space-y-1">
            {diagnostic.detectedFaults.slice(0, 2).map((fault, index) => (
              <div key={index} className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                <span className="text-sm text-text-secondary">{fault}</span>
              </div>
            ))}
            {diagnostic.detectedFaults.length > 2 && (
              <p className="text-xs text-text-secondary ml-6">
                +{diagnostic.detectedFaults.length - 2} more issues
              </p>
            )}
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {diagnostic.aiAnalysis && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-fg mb-2">AI Analysis</h4>
          <p className="text-sm text-text-secondary line-clamp-2">
            {diagnostic.aiAnalysis}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          {diagnostic.confidence && diagnostic.confidence > 0 && (
            <div className="text-sm">
              <span className="text-text-secondary">Confidence: </span>
              <span className="font-medium text-fg">
                {Math.round(diagnostic.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
        
        {diagnostic.estimatedCost > 0 && (
          <div className="text-right">
            <p className="text-sm text-text-secondary">Est. Cost</p>
            <p className="font-semibold text-accent">
              {formatCurrency(diagnostic.estimatedCost)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
