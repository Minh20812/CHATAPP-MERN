/*
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // "/api/": "https://todolist-app-d0wu.onrender.com",
      // "/uploads/": "https://todolist-app-d0wu.onrender.com",
      "/api/": "http://localhost:5000/",
      "/uploads/": "http://localhost:5000/",
    },
  },
});
*/

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://chatapp-mern-vhhz.onrender.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
      "/socket.io": {
        target: "https://chatapp-mern-vhhz.onrender.com",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
      },
    },
  },
});
