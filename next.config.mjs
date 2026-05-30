/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Three.js for optimal bundling
  transpilePackages: ['three'],
}

export default nextConfig
