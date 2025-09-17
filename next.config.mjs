/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // No remotePatterns needed as all images are now served locally
  // via the prebuild script.
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
