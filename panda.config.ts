import { defineConfig } from "@pandacss/dev";
import {createPreset} from "@park-ui/panda-preset";
import {informationRowRecipe} from "./src/config/styles/information-row.recipe";

export default defineConfig({
  globalCss: {
    html: {
      '--global-font-body': "'Clash Grotesk', sans-serif"
    },
    '*': {
      scrollbarColor: "token(colors.accent.6) token(colors.bg.canvas)"
    }
  },
  staticCss: {
    themes: ['light', 'dark']
  },
  // Whether to use css reset
  preflight: true,
  // preset styles
  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: "iris",
      grayColor: "slate",
      borderRadius: '2xl'
    })
  ],
  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Files to exclude
  exclude: [],
  // The output directory for your css system
  outdir: "styled-system",
  // this is needed for creating components with panda styles
  jsxFramework: "react",
  theme: {
    containerNames: ['shoppingListCard'],
    containerSizes: {
      xs: '320px',
      sm: '480px',
      md: '640px',
      lg: '800px'
    },
    extend: {
      slotRecipes: {
        informationRow: informationRowRecipe
      }
    }
  }
});
