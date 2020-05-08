const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  context: process.cwd(),
  resolve: {
    extensions: [".jsx", ".js", ".json", ".less", ".css"],
    modules: [__dirname, "node_modules"],
  },
  entry: {
    library: ["react", "react-router"],
  },
  output: {
    filename: "[name].dll.js",
    path: path.join(__dirname, "public/library"),
    library: "[name]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.join(__dirname, "public", "library", "[name]-manifest.json"),
    }),
  ],
};
