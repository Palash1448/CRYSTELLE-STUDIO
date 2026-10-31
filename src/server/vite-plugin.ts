import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { createOrder, verifyPaymentSignature } from './razorpay';
import {
  forwardOrderToShipPrime,
  cancelShipPrimeShipment,
  trackShipPrimeShipment,
} from './shipprime';
import {
  getUploadSignature,
  uploadToCloudinaryServer,
} from './cloudinary';
import { generateSitemapXml, generateRobotsTxt } from './sitemap';

export function razorpayApiPlugin(): Plugin {
  return {
    name: 'razorpay-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const fullUrl = req.url || '';
        const url = fullUrl.split('?')[0];

        // Serve dynamically uploaded local assets
        if (url && url.startsWith('/uploads/')) {
          const relativePath = url.replace(/^\//, '');
          const localPath = path.resolve(process.cwd(), 'public', relativePath);
          if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
            const ext = path.extname(localPath).toLowerCase();
            const mimeMap: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.mp4': 'video/mp4',
              '.webm': 'video/webm',
            };
            res.statusCode = 200;
            res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            fs.createReadStream(localPath).pipe(res);
            return;
          }
        }

        if (url === '/sitemap.xml' || url === '/sitemap') {
          const host = req.headers['host'] || 'localhost:3000';
          const proto = req.headers['x-forwarded-proto'] || 'http';
          const baseUrl = process.env['VITE_SITE_URL'] || `${proto}://${host}`;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(generateSitemapXml(baseUrl));
          return;
        }

        if (url === '/robots.txt') {
          const host = req.headers['host'] || 'localhost:3000';
          const proto = req.headers['x-forwarded-proto'] || 'http';
          const baseUrl = process.env['VITE_SITE_URL'] || `${proto}://${host}`;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(generateRobotsTxt(baseUrl));
          return;
        }

        if (url === '/api/create-order' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const result = await createOrder(body);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.data));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        if (url === '/api/verify-payment' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const result = verifyPaymentSignature(body);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.data));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        // --- ShipPrime Logistics Endpoints ---
        if (url === '/api/shipprime/forward' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const result = await forwardOrderToShipPrime(body);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.data));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'FAILED', message: err?.message || 'Invalid JSON payload' }));
            }
          });
          return;
        }

        if (url === '/api/shipprime/cancel' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              if (!body.awb) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'FAILED', message: 'Missing awb parameter' }));
                return;
              }
              const result = await cancelShipPrimeShipment(body.awb);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.data));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'FAILED', message: err?.message || 'Invalid JSON payload' }));
            }
          });
          return;
        }

        if (url === '/api/shipprime/track' && req.method === 'GET') {
          try {
            const queryIndex = fullUrl.indexOf('?');
            const searchParams = new URLSearchParams(queryIndex >= 0 ? fullUrl.slice(queryIndex) : '');
            const awb = searchParams.get('awb');
            if (!awb) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'FAILED', message: 'Missing awb parameter' }));
              return;
            }
            const result = await trackShipPrimeShipment(awb);
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.data));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'FAILED', message: err?.message || 'Failed to track shipment' }));
          }
          return;
        }

        // --- Cloudinary Media Upload Endpoints ---
        if (url === '/api/cloudinary/sign' && (req.method === 'GET' || req.method === 'POST')) {
          try {
            let folder = 'crystelle_studio/products';
            if (req.method === 'POST') {
              let bodyStr = '';
              req.on('data', (chunk) => {
                bodyStr += chunk;
              });
              req.on('end', () => {
                try {
                  const body = JSON.parse(bodyStr || '{}');
                  if (body.folder) folder = body.folder;
                  const signData = getUploadSignature(folder);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(signData));
                } catch {
                  const signData = getUploadSignature(folder);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(signData));
                }
              });
              return;
            } else {
              const queryIndex = fullUrl.indexOf('?');
              const searchParams = new URLSearchParams(queryIndex >= 0 ? fullUrl.slice(queryIndex) : '');
              const f = searchParams.get('folder');
              if (f) folder = f;
              const signData = getUploadSignature(folder);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(signData));
              return;
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Failed to sign request' }));
            return;
          }
        }

        if (url === '/api/cloudinary/upload' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const result = await uploadToCloudinaryServer(body);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.data));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}
