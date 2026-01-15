/** @type {import('next').NextConfig} */

// Only enable basePath/assetPrefix for GitHub Pages builds.
// Local dev should NOT have a basePath.
const isGithubPages = process.env.GITHUB_PAGES === 'true';

// Change this to your GitHub repo name (the part after github.com/<user>/)
const repoName = 'guidelines-site';

const nextConfig = {
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}` : '',

  // Static export for GitHub Pages
  output: 'export',

  // Next/Image optimization is not available in static export.
  images: {
    unoptimized: true,
  },

  // Optional: keep trailing slash off (GitHub Pages works either way)
  // trailingSlash: true,
};

export default nextConfig;
