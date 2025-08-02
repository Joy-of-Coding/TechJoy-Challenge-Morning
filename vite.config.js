import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/TechJoy-Challenge-Morning/",
  plugins: [react()],
  test: {
    environment: "jsdom", // Back to jsdom for proper testing
    globals: true,
    setupFiles: ["./src/test/setup.js"],
  },
});
