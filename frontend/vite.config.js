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
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Remove double slash
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
      "/socket.io": {
        target: "https://chatapp-mern-vhhz.onrender.com",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/socket\.io/, "/socket.io"),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
  },
});
