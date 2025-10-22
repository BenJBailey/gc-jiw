import basicSsl from "@vitejs/plugin-basic-ssl";

export default {
  base: "/gc-jiw/",
  plugins: [
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: ["*.custom.com"],
      /** custom certification directory */
      certDir: "/Users/.../.devServer/cert",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        format: "es",
        manualChunks: (id) => {
          // Keep node_modules as separate chunks
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        assetFileNames: (assetInfo) => {
          // Don't hash the main CSS file
          if (assetInfo.name.endsWith(".css")) {
            return "assets/[name].css";
          }
          return "assets/[name]-[hash][extname]";
        },
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
};

