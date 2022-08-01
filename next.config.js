/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "akamai",
    path: "",
  },
  assetPrefix: './'
  // basePath: "/",
  // assetPrefix: "/nextjs-pages",
}

module.exports = nextConfig
