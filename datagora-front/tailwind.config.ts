import type { Config } from "tailwindcss";

import { heroui, HeroUIPluginConfig } from "@heroui/react";

const heroUIConfig: HeroUIPluginConfig = {
  themes: {
    myTheme: {
      extend: "dark",
      colors: {
        background: "black",
        foreground: "white",
        default: {
          DEFAULT: "gray",
        },
        primary: {
          DEFAULT: "#FFF540",
        },
        secondary: {
          DEFAULT: "white",
        },
      },
    },
  },
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [heroui(heroUIConfig)],
} satisfies Config;
