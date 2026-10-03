import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        relay: {
          orange: "#FF6B00",
          ink: "#111111",
          soft: "#F7F7F5",
          line: "#E9E9E6",
          muted: "#73736D"
        }
      },
      boxShadow: {
        card: "0 12px 40px rgba(17,17,17,0.06)"
      }
    }
  },
  plugins: []
};

export default config;
