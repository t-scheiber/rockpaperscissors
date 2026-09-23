import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Retained upstream bundle is scanned for security, but is not authored application source.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**", "AI/teachablemachine-image.min.js"]),
]);
