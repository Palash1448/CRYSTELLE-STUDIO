import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto, fill, scale } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

export const CLOUDINARY_CLOUD_NAME =
  (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_CLOUDINARY_CLOUD_NAME']) ||
  'e6rnpzii';

/**
 * Cloudinary instance configured for Crystelle Studio
 */
export const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

/**
 * Extracts Cloudinary public_id from a full Cloudinary URL, or returns the string if already a public_id
 */
export function extractPublicId(urlOrId: string): { publicId: string; isCloudinary: boolean } {
  if (!urlOrId) return { publicId: '', isCloudinary: false };

  // Check if string contains cloudinary domain
  if (urlOrId.includes('res.cloudinary.com')) {
    try {
      // e.g. https://res.cloudinary.com/e6rnpzii/image/upload/v1234567/crystelle_studio/products/sample.jpg
      const match = urlOrId.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (match && match[1]) {
        return { publicId: match[1], isCloudinary: true };
      }
    } catch {
      // ignore
    }
    return { publicId: urlOrId, isCloudinary: true };
  }

  // If it's a relative path, external http/https, or inline data URI
  if (
    urlOrId.startsWith('http://') ||
    urlOrId.startsWith('https://') ||
    urlOrId.startsWith('/') ||
    urlOrId.startsWith('data:')
  ) {
    return { publicId: urlOrId, isCloudinary: false };
  }

  // Otherwise it's a raw public_id (e.g. 'cld-sample-5' or 'crystelle_studio/products/candle1')
  return { publicId: urlOrId, isCloudinary: true };
}

/**
 * Build an optimized Cloudinary Image object
 */
export function createCldImage(
  publicIdOrUrl: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'auto' | 'fill' | 'scale';
  }
) {
  const { publicId } = extractPublicId(publicIdOrUrl);
  if (!publicId) return null;

  const img = cld.image(publicId);
  img.format('auto'); // Optimize delivery by automatic WebP / AVIF
  img.quality('auto'); // Optimize visual quality vs file size

  if (options?.width || options?.height) {
    const w = options.width || options.height || 500;
    const h = options.height || options.width || 500;

    if (options.crop === 'scale') {
      img.resize(scale().width(w).height(h));
    } else if (options.crop === 'fill') {
      img.resize(fill().width(w).height(h));
    } else {
      // Default: auto crop with smart subject gravity
      img.resize(auto().gravity(autoGravity()).width(w).height(h));
    }
  }

  return img;
}

/**
 * Returns a transformed, CDN-optimized delivery URL for an image
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options?: { width?: number; height?: number; crop?: 'auto' | 'fill' | 'scale' }
): string {
  if (!publicIdOrUrl) return '/hero-candle.jpg';

  const { publicId, isCloudinary } = extractPublicId(publicIdOrUrl);
  if (!isCloudinary) {
    return publicIdOrUrl;
  }

  try {
    const cldImg = createCldImage(publicId, options);
    if (cldImg) {
      return cldImg.toURL();
    }
  } catch (err) {
    console.warn('Failed to generate Cloudinary URL:', err);
  }

  return publicIdOrUrl;
}

/**
 * Returns an optimized delivery URL for a video stored on Cloudinary
 */
export function getOptimizedVideoUrl(publicIdOrUrl: string): string {
  if (!publicIdOrUrl) return '';

  const { publicId, isCloudinary } = extractPublicId(publicIdOrUrl);
  if (!isCloudinary) return publicIdOrUrl;

  try {
    const vid = cld.video(publicId);
    vid.format('auto');
    vid.quality('auto');
    return vid.toURL();
  } catch {
    return publicIdOrUrl;
  }
}

export interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
}

function performXhrUpload(
  uploadUrl: string,
  formData: FormData,
  targetType: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            url: res.url,
            secure_url: res.secure_url,
            public_id: res.public_id,
            resource_type: res.resource_type || (targetType as any),
            format: res.format,
            width: res.width,
            height: res.height,
            duration: res.duration,
            bytes: res.bytes,
          });
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        let errorMsg = 'Upload failed';
        try {
          const errObj = JSON.parse(xhr.responseText);
          errorMsg = errObj.error?.message || errorMsg;
        } catch {}
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload to Cloudinary'));
    xhr.send(formData);
  });
}

/**
 * Direct signed/unsigned upload of Photos or Videos to Cloudinary with real-time upload progress
 */
export async function uploadMediaToCloudinary(
  file: File | Blob | string,
  options?: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'auto';
    uploadPreset?: string;
    onProgress?: (percent: number) => void;
  }
): Promise<UploadResult> {
  const folder = options?.folder || 'crystelle_studio/products';
  const resourceType = options?.resourceType || 'auto';
  const envPreset =
    (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_CLOUDINARY_UPLOAD_PRESET']) || '';
  const uploadPreset = options?.uploadPreset || envPreset;

  // Determine resourceType based on file MIME if auto
  let targetType = resourceType;
  if (targetType === 'auto' && file instanceof File) {
    targetType = file.type.startsWith('video/') ? 'video' : 'image';
  }

  // 1. Try unsigned upload directly if upload preset is configured
  if (uploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      if (folder) formData.append('folder', folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${targetType}/upload`;
      return await performXhrUpload(uploadUrl, formData, targetType, options?.onProgress);
    } catch (presetErr) {
      console.warn('Unsigned preset upload attempt failed, falling back:', presetErr);
    }
  }

  // 2. Try direct browser upload using Cloudinary signature endpoint
  try {
    const signRes = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    });

    if (signRes.ok) {
      const signData = await signRes.json();
      const {
        apiKey,
        timestamp,
        signature,
        signatureSha256,
        cloudName,
        uploadPreset: returnedPreset,
      } = signData;

      // If server returned an upload preset, try that first
      if (returnedPreset && !uploadPreset) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', returnedPreset);
          if (folder) formData.append('folder', folder);

          const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${targetType}/upload`;
          return await performXhrUpload(uploadUrl, formData, targetType, options?.onProgress);
        } catch (presetErr) {
          console.warn('Preset upload attempt failed, falling back to signature:', presetErr);
        }
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${targetType}/upload`;

      // Try signed upload with primary signature
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('folder', folder);
        formData.append('signature', signature);

        return await performXhrUpload(uploadUrl, formData, targetType, options?.onProgress);
      } catch (firstSignErr: any) {
        // If invalid signature error and sha256 signature is available, retry with sha256
        if (
          signatureSha256 &&
          signatureSha256 !== signature &&
          firstSignErr.message?.toLowerCase().includes('invalid signature')
        ) {
          const formData256 = new FormData();
          formData256.append('file', file);
          formData256.append('api_key', apiKey);
          formData256.append('timestamp', String(timestamp));
          formData256.append('folder', folder);
          formData256.append('signature', signatureSha256);

          return await performXhrUpload(uploadUrl, formData256, targetType, options?.onProgress);
        }
        throw firstSignErr;
      }
    }
  } catch (directErr) {
    console.warn('Direct upload attempt failed, falling back to server upload proxy:', directErr);
  }

  // 3. Fallback to server upload proxy
  let fileData: string;
  if (typeof file === 'string') {
    fileData = file;
  } else {
    fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: fileData,
      folder,
      resourceType,
      uploadPreset,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.secure_url) {
    throw new Error(data.error || 'Server upload to Cloudinary failed');
  }

  return {
    url: data.url,
    secure_url: data.secure_url,
    public_id: data.public_id,
    resource_type: data.resource_type,
    format: data.format,
    width: data.width,
    height: data.height,
    duration: data.duration,
    bytes: data.bytes,
  };
}

export interface CldImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: 'auto' | 'fill' | 'scale';
  className?: string;
  fallbackSrc?: string;
}

/**
 * Universal Image Component:
 * - Uses @cloudinary/react AdvancedImage with auto gravity & auto format for Cloudinary media
 * - Gracefully falls back to standard <img> for local / external media
 */
export const CldImage: React.FC<CldImageProps> = ({
  src,
  alt,
  width = 500,
  height = 500,
  crop = 'auto',
  className = '',
  fallbackSrc = '/hero-candle.jpg',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const { publicId, isCloudinary } = extractPublicId(src);

  if (hasError) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...rest}
      />
    );
  }

  if (isCloudinary && publicId) {
    try {
      const cldImg = createCldImage(publicId, { width, height, crop });
      if (cldImg) {
        return (
          <AdvancedImage
            cldImg={cldImg}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
            {...(rest as any)}
          />
        );
      }
    } catch {
      // Fallback below
    }
  }

  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
};
