'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Video, Audio, Image, Loader } from 'lucide-react';
import { StorageService } from '@/lib/storage';

interface FileUploaderProps {
  onUpload: (files: File[], type: 'video' | 'audio' | 'text' | 'obd2') => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export function FileUploader({
  onUpload,
  maxFiles = 5,
  maxSize = 100,
  acceptedTypes = ['video/*', 'audio/*', 'image/*', 'text/*', '.json'],
  className = ''
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const validation = StorageService.validateFile(file, {
        maxSize: maxSize * 1024 * 1024,
        allowedTypes: acceptedTypes
      });
      return validation.valid;
    });

    setFiles(prev => {
      const combined = [...prev, ...validFiles];
      return combined.slice(0, maxFiles);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Determine file type category
      const fileType = files[0] ? StorageService.getFileTypeCategory(files[0].type) : 'text';

      // Convert to diagnostic data type
      let dataType: 'video' | 'audio' | 'text' | 'obd2' = 'text';
      if (fileType === 'video') dataType = 'video';
      else if (fileType === 'audio') dataType = 'audio';
      else if (files[0]?.type === 'application/json') dataType = 'obd2';

      onUpload(files, dataType);
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    const type = StorageService.getFileTypeCategory(file.type);
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Audio className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
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
        className={`upload-zone border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragOver ? 'dragover' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-fg mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-text-secondary text-sm">
          Support for video, audio, images, and text files (max {maxSize}MB each)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-fg">Selected Files ({files.length}/{maxFiles})</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium text-fg text-sm">{file.name}</p>
                  <p className="text-text-secondary text-xs">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 rounded-lg hover:bg-white/5"
              >
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Upload {files.length} file{files.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

