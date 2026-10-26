import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep links to the old Jekyll site (frankbinette.github.io) working.
  async redirects() {
    return [
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/notes.html", destination: "/notes", permanent: true },
      { source: "/writings.html", destination: "/", permanent: true },
      { source: "/:year/:month/:day/:slug.html", destination: "/:year/:month/:day/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
