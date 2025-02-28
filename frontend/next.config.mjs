/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['scontent.fhyd11-3.fna.fbcdn.net', 'fna.fbcdn.net','imgs.search.brave.com','lh3.googleusercontent.com'],  // Add allowed domains here
  },
};

export default nextConfig;
