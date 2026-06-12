import path from "path";

/**
 * Explicit filesystem paths for Tesseract.js on Vercel/serverless.
 * Default workerBlobURL mode fails when worker/WASM files are not bundled.
 */
export function getTesseractNodeOptions() {
  const root = process.cwd();

  return {
    workerPath: path.join(
      root,
      "node_modules/tesseract.js/src/worker-script/node/index.js"
    ),
    corePath: path.join(
      root,
      "node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js"
    ),
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    workerBlobURL: false,
    logger: () => {},
  };
}

/** pdfjs-dist asset dirs required by pdf-to-img on serverless. */
export function getPdfJsAssetPaths() {
  const root = process.cwd();
  const pdfjsRoot = path.join(root, "node_modules/pdfjs-dist");

  return {
    standardFontDataUrl: path.join(pdfjsRoot, "standard_fonts"),
    cMapUrl: path.join(pdfjsRoot, "cmaps"),
  };
}
