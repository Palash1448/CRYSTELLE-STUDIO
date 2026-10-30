import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { handleWebRazorpayRequest } from "./server/razorpay";
import { handleWebShipPrimeRequest } from "./server/shipprime";
import { handleWebCloudinaryRequest } from "./server/cloudinary";
import { generateSitemapXml, generateRobotsTxt } from "./server/sitemap";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      if (pathname === '/sitemap.xml' || pathname === '/sitemap') {
        const host =
          request.headers.get('x-forwarded-host') ||
          request.headers.get('host') ||
          url.host;
        const proto =
          request.headers.get('x-forwarded-proto') ||
          (url.protocol ? url.protocol.replace(':', '') : 'https') ||
          'https';
        const siteUrl = (
          (env as Record<string, string>)?.VITE_SITE_URL ||
          (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) ||
          `${proto}://${host}`
        ).replace(/\/$/, '');

        return new Response(generateSitemapXml(siteUrl), {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        });
      }

      if (pathname === '/robots.txt') {
        const host =
          request.headers.get('x-forwarded-host') ||
          request.headers.get('host') ||
          url.host;
        const proto =
          request.headers.get('x-forwarded-proto') ||
          (url.protocol ? url.protocol.replace(':', '') : 'https') ||
          'https';
        const siteUrl = (
          (env as Record<string, string>)?.VITE_SITE_URL ||
          (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) ||
          `${proto}://${host}`
        ).replace(/\/$/, '');

        return new Response(generateRobotsTxt(siteUrl), {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        });
      }

      const razorpayResponse = await handleWebRazorpayRequest(request);
      if (razorpayResponse) {
        return razorpayResponse;
      }

      const shipprimeResponse = await handleWebShipPrimeRequest(request);
      if (shipprimeResponse) {
        return shipprimeResponse;
      }

      const cloudinaryResponse = await handleWebCloudinaryRequest(request);
      if (cloudinaryResponse) {
        return cloudinaryResponse;
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
