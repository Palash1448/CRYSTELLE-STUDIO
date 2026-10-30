import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Helper to load Cloudinary credentials from process.env or fallback to .env file
function getCloudinaryCredentials() {
  let cloudName =
    process.env['CLOUDINARY_CLOUD_NAME'] ||
    process.env['VITE_CLOUDINARY_CLOUD_NAME'] ||
    'e6rnpzii';
  let apiKey =
    process.env['CLOUDINARY_API_KEY'] ||
    process.env['VITE_CLOUDINARY_API_KEY'] ||
    '624812375866731';
  let apiSecret =
    process.env['CLOUDINARY_API_SECRET'] ||
    'irXoLblOWNynTZ4Ti2bhD2aprtA';
  let uploadPreset =
    process.env['CLOUDINARY_UPLOAD_PRESET'] ||
    process.env['VITE_CLOUDINARY_UPLOAD_PRESET'] ||
    '';
  let signatureAlgorithm =
    (process.env['CLOUDINARY_SIGNATURE_ALGORITHM'] || 'sha1').toLowerCase();

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
        const [k, ...rest] = trimmed.split('=');
        const key = k?.trim();
        const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
        if ((key === 'CLOUDINARY_CLOUD_NAME' || key === 'VITE_CLOUDINARY_CLOUD_NAME') && val) {
          cloudName = val;
        }
        if ((key === 'CLOUDINARY_API_KEY' || key === 'VITE_CLOUDINARY_API_KEY') && val) {
          apiKey = val;
        }
        if (key === 'CLOUDINARY_API_SECRET' && val) {
          apiSecret = val;
        }
        if ((key === 'CLOUDINARY_UPLOAD_PRESET' || key === 'VITE_CLOUDINARY_UPLOAD_PRESET') && val) {
          uploadPreset = val;
        }
        if (key === 'CLOUDINARY_SIGNATURE_ALGORITHM' && val) {
          signatureAlgorithm = val.toLowerCase();
        }
      }
    }
  } catch {
    // ignore
  }

  return {
    cloudName: cloudName || 'e6rnpzii',
    apiKey: apiKey || '624812375866731',
    apiSecret: apiSecret || 'irXoLblOWNynTZ4Ti2bhD2aprtA',
    uploadPreset: uploadPreset || '',
    signatureAlgorithm: signatureAlgorithm === 'sha256' ? 'sha256' : 'sha1',
  };
}

/**
 * Generates an authentication signature for Cloudinary upload requests (supports sha1 & sha256)
 */
export function generateCloudinarySignature(
  paramsToSign: Record<string, string | number>,
  algorithm: 'sha1' | 'sha256' = 'sha1'
) {
  const { apiSecret } = getCloudinaryCredentials();

  // Sort parameter keys alphabetically
  const sortedKeys = Object.keys(paramsToSign).sort();
  const serialized = sortedKeys
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');

  const signature = crypto
    .createHash(algorithm)
    .update(serialized + apiSecret)
    .digest('hex');

  return signature;
}

/**
 * Returns upload signature & credentials for direct client-to-Cloudinary upload
 */
export function getUploadSignature(folder = 'crystelle_studio/products') {
  const { cloudName, apiKey, uploadPreset, signatureAlgorithm } = getCloudinaryCredentials();
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    folder,
    timestamp,
  };

  const signatureSha1 = generateCloudinarySignature(paramsToSign, 'sha1');
  const signatureSha256 = generateCloudinarySignature(paramsToSign, 'sha256');

  return {
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature: signatureAlgorithm === 'sha256' ? signatureSha256 : signatureSha1,
    signatureSha1,
    signatureSha256,
    uploadPreset,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
  };
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  created_at: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
  url: string;
  secure_url: string;
}

/**
 * Upload a media file (base64 data URI or remote URL) to Cloudinary via server
 */
export async function uploadToCloudinaryServer(params: {
  file: string;
  folder?: string;
  resourceType?: 'image' | 'video' | 'auto';
  uploadPreset?: string;
}): Promise<{ status: number; data: any }> {
  const { file, folder = 'crystelle_studio/products', resourceType = 'auto' } = params;

  if (!file) {
    return {
      status: 400,
      data: { error: 'Missing required file data for Cloudinary upload' },
    };
  }

  const {
    cloudName,
    apiKey,
    uploadPreset: envPreset,
    signatureAlgorithm,
  } = getCloudinaryCredentials();
  const activePreset = params.uploadPreset || envPreset;

  // 1. If an unsigned upload preset is configured, prefer preset upload (avoids signature verification)
  if (activePreset) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', activePreset);
      if (folder) formData.append('folder', folder);

      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        return {
          status: 200,
          data: {
            success: true,
            asset_id: json.asset_id,
            public_id: json.public_id,
            resource_type: json.resource_type,
            format: json.format,
            width: json.width,
            height: json.height,
            duration: json.duration,
            bytes: json.bytes,
            url: json.url,
            secure_url: json.secure_url,
          },
        };
      }
      console.warn('Upload with unsigned preset failed, falling back to signed upload:', json);
    } catch (presetErr) {
      console.warn('Preset upload attempt encountered error:', presetErr);
    }
  }

  // 2. Signed upload: Try primary algorithm, and fallback to sha256 if sha1 rejected (or vice versa)
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const algorithms: Array<'sha1' | 'sha256'> =
    signatureAlgorithm === 'sha256' ? ['sha256', 'sha1'] : ['sha1', 'sha256'];

  let lastError = 'Cloudinary upload failed';
  let lastStatus = 500;

  for (const algo of algorithms) {
    const signature = generateCloudinarySignature(paramsToSign, algo);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('folder', folder);
      formData.append('signature', signature);

      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        return {
          status: 200,
          data: {
            success: true,
            asset_id: json.asset_id,
            public_id: json.public_id,
            resource_type: json.resource_type,
            format: json.format,
            width: json.width,
            height: json.height,
            duration: json.duration,
            bytes: json.bytes,
            url: json.url,
            secure_url: json.secure_url,
          },
        };
      }

      lastStatus = res.status;
      lastError = json.error?.message || lastError;

      // If the error was NOT an invalid signature error, retrying another algorithm won't help
      if (!lastError.toLowerCase().includes('invalid signature')) {
        break;
      }
    } catch (err: any) {
      lastStatus = 500;
      lastError = err?.message || 'Network error during Cloudinary upload';
      break;
    }
  }

  const isInvalidSignature = lastError.toLowerCase().includes('invalid signature');
  const helpfulMessage = isInvalidSignature
    ? `Cloudinary Invalid Signature. Please verify that CLOUDINARY_API_SECRET in your .env matches the API Secret for API Key ${apiKey} in your Cloudinary Dashboard (Settings > Access Keys), or configure CLOUDINARY_UPLOAD_PRESET to enable unsigned uploads.`
    : lastError;

  return {
    status: lastStatus,
    data: {
      error: helpfulMessage,
      rawError: lastError,
    },
  };
}

/**
 * Web request handler for Cloudinary routes
 */
export async function handleWebCloudinaryRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  // 1. Get Signature for direct client uploads
  if (url.pathname === '/api/cloudinary/sign' && (request.method === 'GET' || request.method === 'POST')) {
    try {
      let folder = 'crystelle_studio/products';
      if (request.method === 'POST') {
        const body = await request.json().catch(() => ({}));
        if (body.folder) folder = body.folder;
      } else {
        const fParam = url.searchParams.get('folder');
        if (fParam) folder = fParam;
      }

      const signData = getUploadSignature(folder);
      return new Response(JSON.stringify(signData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err?.message || 'Failed to sign request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 2. Server upload proxy
  if (url.pathname === '/api/cloudinary/upload' && request.method === 'POST') {
    try {
      const body = await request.json();
      const result = await uploadToCloudinaryServer(body);
      return new Response(JSON.stringify(result.data), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return null;
}
