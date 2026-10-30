import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { uploadMediaToCloudinary, CldImage, extractPublicId } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';

export interface CloudinaryUploaderProps {
  label: string;
  mediaType?: 'image' | 'video';
  value: string;
  publicId?: string;
  onChange: (url: string, publicId?: string, meta?: any) => void;
  onRemove?: () => void;
  folder?: string;
  helperText?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  label,
  mediaType = 'image',
  value,
  publicId,
  onChange,
  onRemove,
  folder = 'crystelle_studio/products',
  helperText,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || '');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate type
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      setUploadError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadMediaToCloudinary(file, {
        folder,
        resourceType: mediaType,
        onProgress: (p) => setUploadProgress(p),
      });

      onChange(res.secure_url, res.public_id, res);
      setManualUrl(res.secure_url);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setUploadError(err.message || 'Failed to upload media to Cloudinary');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSave = () => {
    if (!manualUrl.trim()) return;
    const { publicId: extractedId } = extractPublicId(manualUrl.trim());
    onChange(manualUrl.trim(), extractedId);
    setShowUrlInput(false);
  };

  const hasValue = Boolean(value && value.trim() && value !== '/hero-candle.jpg');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#44403C] flex items-center gap-1.5">
          {mediaType === 'video' ? (
            <Film className="w-3.5 h-3.5 text-amber-700" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
          )}
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#A67C2E] hover:underline cursor-pointer"
        >
          {showUrlInput ? 'Back to upload' : 'Enter URL manually'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={
              mediaType === 'video'
                ? 'https://res.cloudinary.com/e6rnpzii/video/upload/...'
                : 'https://res.cloudinary.com/e6rnpzii/image/upload/...'
            }
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 h-9 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleManualUrlSave}
            className="bg-[#C59A44] hover:bg-[#B58934] text-white text-xs h-9 px-3 rounded-xl"
          >
            Apply
          </Button>
        </div>
      ) : hasValue ? (
        /* Preview Card */
        <div className="relative rounded-2xl border border-amber-200/80 bg-amber-50/30 p-3 flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#EAE4DC] shrink-0 relative flex items-center justify-center">
            {mediaType === 'video' ? (
              <video
                src={value}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                autoPlay
              />
            ) : (
              <CldImage
                src={value}
                alt={label}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-3 h-3" />
                Cloudinary CDN
              </span>
              <span className="text-[10px] text-[#78716C]">cloud: e6rnpzii</span>
            </div>
            <p className="text-xs text-[#1C1917] font-mono truncate" title={value}>
              {value}
            </p>
            {helperText && <p className="text-[10px] text-[#78716C] mt-0.5">{helperText}</p>}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-amber-100/60 transition-colors cursor-pointer text-xs font-medium"
              title="Replace file"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Remove media"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Upload Dropzone */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#C59A44] bg-amber-50/50'
              : 'border-[#EAE4DC] bg-[#FAF8F5] hover:border-amber-400 hover:bg-amber-50/20'
          }`}
        >
          {isUploading ? (
            <div className="py-2 space-y-2">
              <Loader2 className="w-6 h-6 text-[#C59A44] animate-spin mx-auto" />
              <p className="text-xs font-medium text-[#1C1917]">
                Uploading to Cloudinary... {uploadProgress}%
              </p>
              <div className="w-48 max-w-full h-1.5 bg-[#EAE4DC] rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-[#C59A44] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-[#78716C]">Optimizing media on Cloudinary cloud: e6rnpzii</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-1.5">
                <UploadCloud className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-[#1C1917]">
                Click or drag & drop to upload {mediaType === 'video' ? 'Candle Video' : 'Candle Photo'}
              </p>
              <p className="text-[10px] text-[#78716C]">
                {mediaType === 'video'
                  ? 'MP4, WebM, MOV (Stored in Cloudinary, metadata in Firebase)'
                  : 'JPEG, PNG, WebP (Optimized via Cloudinary @auto format & quality)'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={mediaType === 'video' ? 'video/*' : 'image/*'}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {uploadError && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
