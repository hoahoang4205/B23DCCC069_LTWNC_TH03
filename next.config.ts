import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'antd',
    '@ant-design/nextjs-registry',
    'rc-util',
    'rc-pagination',
    'rc-picker',
  ],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
