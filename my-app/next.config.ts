/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@google/generative-ai",
    "pdf-parse",
    "docx",
    "mammoth"
  ],
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig