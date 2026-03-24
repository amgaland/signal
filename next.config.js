/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/proxy/coverage",
        destination: "https://z-osa.mobicom.mn/signal/api/coverage",
      },
    ];
  },
};

module.exports = nextConfig;
