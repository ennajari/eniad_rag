/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration moderne (Next.js 15+)
  serverExternalPackages: ["@google/generative-ai", "pdf-parse", "docx"],
  // Supprimez complètement la section experimental si elle cause des problèmes
}

module.exports = nextConfig