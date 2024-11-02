import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  // preset styles
  presets: ['@pandacss/preset-base', '@park-ui/panda-preset'],
  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Files to exclude
  exclude: [],
  // The output directory for your css system
  outdir: "styled-system",
  // this is needed for creating components with panda styles
  jsxFramework: "react"
});
