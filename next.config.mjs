/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/uploads/:path*",
        destination: "http://15.252.146.207:5000/uploads/:path*",
      },
      {
        source: "/backend-api/:path*",
        destination: "http://15.252.146.207:5000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
