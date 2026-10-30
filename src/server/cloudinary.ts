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
      }
    }
  } catch {
    // ignore
  }

  return {
    cloudName: cloudName || 'e6rnpzii',
    apiKey: apiKey || '624812375866731',
    apiSecret: apiSecret || 'irXoLblOWNynTZ4Ti2bhD2aprtA',
  };
}

/**
 * Generates an authentication signature for Cloudinary upload requests
 */
export function generateCloudinarySignature(paramsToSign: Record<string, string | number>) {
  const { apiSecret } = getCloudinaryCredentials();

  // Sort parameter keys alphabetically
  const sortedKeys = Object.keys(paramsToSign).sort();
  const serialized = sortedKeys
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');

  const signature = crypto
    .createHash('sha1')
    .update(serialized + apiSecret)
    .digest('hex');

  return signature;
}

/**
 * Returns upload signature & credentials for direct client-to-Cloudinary upload
 */
export function getUploadSignature(folder = 'crystelle_studio/products') {
  const { cloudName, apiKey } = getCloudinaryCredentials();
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    folder,
    timestamp,
  };

  const signature = generateCloudinarySignature(paramsToSign);

  return {
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
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
}): Promise<{ status: number; data: any }> {
  const { file, folder = 'crystelle_studio/products', resourceType = 'auto' } = params;

  if (!file) {
    return {
      status: 400,
      data: { error: 'Missing required file data for Cloudinary upload' },
    };
  }

  const { cloudName, apiKey } = getCloudinaryCredentials();
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const signature = generateCloudinarySignature(paramsToSign);

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

    if (!res.ok) {
      console.error('Cloudinary API upload error:', json);
      return {
        status: res.status,
        data: { error: json.error?.message || 'Cloudinary upload failed' },
      };
    }

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
  } catch (error: any) {
    console.error('Server error uploading to Cloudinary:', error);
    return {
      status: 500,
      data: { error: error?.message || 'Internal server error uploading to Cloudinary' },
    };
  }
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
