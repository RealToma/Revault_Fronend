const path = require("path");
module.exports = {
  webpack: {
    alias: {
      "@src": path.resolve(__dirname, "src/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@assets": path.resolve(__dirname, "src/assets/"),
    },
  },
  babel: {
    plugins:
      process.env.NODE_ENV === "production"
        ? ["transform-remove-console", "babel-plugin-styled-components"]
        : ["babel-plugin-styled-components"],
  },
};
