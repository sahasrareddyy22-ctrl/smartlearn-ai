/**
 * Multi-page PDF OCR using pdf-to-img + Tesseract.js.
 * Configured for Vercel/serverless (explicit worker + pdfjs asset paths).
 */

import { getPdfJsAssetPaths, getTesseractNodeOptions } from "@/lib/serverless-assets";
import type { Worker } from "tesseract.js";

export interface PdfOcrResult {
  text: string;
  pageCount: number;
  pagesProcessed: number;
}

const MAX_OCR_PAGES = 40;
const OCR_SCALE = 2;

async function recognizePage(image: Buffer, worker: Worker): Promise<string> {
  const {
    data: { text },
  } = await worker.recognize(image);
  return text?.trim() ?? "";
}

async function withTesseractWorker<T>(
  fn: (worker: Worker) => Promise<T>
): Promise<T> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, getTesseractNodeOptions());
  try {
    return await fn(worker);
  } finally {
    await worker.terminate();
  }
}

export async function ocrPdfBuffer(buffer: Buffer): Promise<PdfOcrResult> {
  const { pdf } = await import("pdf-to-img");
  const pdfJsAssets = getPdfJsAssetPaths();

  const document = await pdf(buffer, {
    scale: OCR_SCALE,
    docInitParams: {
      standardFontDataUrl: pdfJsAssets.standardFontDataUrl,
      cMapUrl: pdfJsAssets.cMapUrl,
      cMapPacked: true,
      isEvalSupported: false,
    },
  });

  return withTesseractWorker(async (worker) => {
    const pageTexts: string[] = [];
    let pagesProcessed = 0;

    for await (const pageImage of document) {
      if (pagesProcessed >= MAX_OCR_PAGES) break;

      const pageText = await recognizePage(Buffer.from(pageImage), worker);
      if (pageText) {
        pageTexts.push(pageText);
      }
      pagesProcessed++;
    }

    return {
      text: pageTexts.join("\n\n"),
      pageCount: pagesProcessed,
      pagesProcessed,
    };
  });
}

export async function ocrImageBuffer(buffer: Buffer): Promise<string> {
  return withTesseractWorker(async (worker) => recognizePage(buffer, worker));
}
