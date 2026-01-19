const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
