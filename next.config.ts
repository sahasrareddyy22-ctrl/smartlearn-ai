import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  devIndicators: false,
  serverExternalPackages: [
    "pdf-parse",
    "pdf-to-img",
    "pdfjs-dist",
    "tesseract.js",
    "tesseract.js-core",
    "mammoth",
    "@napi-rs/canvas",
    "wink-eng-lite-web-model",
  ],
  outputFileTracingIncludes: {
    "/api/upload": [
      "./node_modules/pdfjs-dist/standard_fonts/**/*",
      "./node_modules/pdfjs-dist/cmaps/**/*",
      "./node_modules/pdfjs-dist/wasm/**/*",
      "./node_modules/tesseract.js/src/**/*",
      "./node_modules/tesseract.js-core/**/*",
      "./node_modules/@napi-rs/canvas/**/*",
      "./node_modules/wink-eng-lite-web-model/**/*",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
