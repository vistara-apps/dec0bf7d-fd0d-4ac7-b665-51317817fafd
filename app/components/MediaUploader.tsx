'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Video, 
  Mic, 
  FileText, 
  X, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MediaUploaderProps {
  onUpload: (file: File, type: 'video' | 'audio' | 'text' | 'obd2') => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

export function MediaUploader({ 
  onUpload, 
  acceptedTypes = ['video/*', 'audio/*', '.txt', '.json'], 
  maxSize = 50,
  className = '' 
}: MediaUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    type: string;
    size: number;
    status: 'success' | 'error';
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): 'video' | 'audio' | 'text' | 'obd2' => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.name.endsWith('.json') || file.name.toLowerCase().includes('obd')) return 'obd2';
    return 'text';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-primary" />;
    if (type.startsWith('audio/')) return <Mic className="h-8 w-8 text-accent" />;
    return <FileText className="h-8 w-8 text-success" />;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    
    for (const file of files) {
      try {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          setUploadedFiles(prev => [...prev, {
            name: file.name,
            type: file.type,
            size: file.size,
            status: 'error'
          }]);
          continue;
        }

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const fileType = getFileType(file);
        onUpload(file, fileType);
        
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'success'
        }]);
      } catch (error) {
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'error'
        }]);
      }
    }
    
    setUploading(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`upload-zone rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragOver ? 'dragover' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-text-secondary" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-fg">Upload Diagnostic Data</h3>
            <p className="text-sm text-text-secondary mt-1">
              Drag and drop files here, or click to select
            </p>
          </div>
          
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-primary" />
              <span className="text-sm text-text-secondary">Video</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-accent" />
              <span className="text-sm text-text-secondary">Audio</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-success" />
              <span className="text-sm text-text-secondary">OBD-II</span>
            </div>
          </div>
          
          <p className="text-xs text-text-secondary">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-fg">Uploaded Files</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium text-fg">{file.name}</p>
                  <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {file.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-error" />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded hover:bg-white/5"
                >
                  <X className="h-4 w-4 text-text-secondary" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center justify-center space-x-2 p-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
          <span className="text-sm text-text-secondary">Processing files...</span>
        </div>
      )}
    </div>
  );
}
