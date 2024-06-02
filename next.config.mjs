/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    images: {
        remotePatterns: [
         { hostname: 'uploadthing.com'},
         { hostname: 'utfs.io'},
         { hostname: 'img.clerk.com'},
         { hostname: 'subdomain'},
         { hostname: 'files.stripe.com'},
        
        ],
      },
};

export default nextConfig;

