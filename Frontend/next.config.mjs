import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Local dev backend
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      // Supabase storage (any project)
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_BACKEND_URL || ""}; connect-src 'self' ${process.env.NEXT_PUBLIC_BACKEND_URL || ""} http://localhost:* ws://localhost:*;`,
          },
        ],
      },
    ];
  },
  async rewrites() {
    const target = process.env.INTERNAL_BACKEND_URL;

    if (!target && process.env.NODE_ENV === "development") {
      // Allow startup but log a warning if in development
      console.warn("\x1b[33m%s\x1b[0m", "⚠️  WARNING: INTERNAL_BACKEND_URL is not set in .env. API proxying will be disabled.");
    } else if (!target) {
      throw new Error("\n\n❌ [SSOT Error]: INTERNAL_BACKEND_URL is missing. \n Please add it to your .env file to enable API proxying. \n Example: INTERNAL_BACKEND_URL=http://localhost:8000\n\n");
    }

    return [
      {
        source: "/api/:path*",
        destination: `${target}/:path*`,
      },
      {
        source: "/files/:path*",
        destination: `${target}/files/:path*`,
      },

    ];
  },
};

export default nextConfig
