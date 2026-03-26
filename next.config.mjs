/** @type {import('next').NextConfig} */
const nextConfig = {
  // Treat these as server-only — they won't be bundled into the Edge Runtime
  // or client bundle, preventing size/compatibility issues on Vercel.
  serverExternalPackages: ['@react-pdf/renderer'],

  images: {
    // Allow user-uploaded logos stored in Supabase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig;
