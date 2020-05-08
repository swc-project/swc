const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBar = require("webpackbar");
const CopyPlugin = require("copy-webpack-plugin");
const yargs = require("yargs");

const SRC_DIR = __dirname + "/src";
const PUBLIC_DIR = __dirname + "/public";

let platform =
  typeof yargs.argv.platform !== "undefined"
    ? yargs.argv.platform
    : "sportnect";

module.exports = {
  entry: {
    [`app-${platform}`]: [SRC_DIR + `/app-${platform}.js`],
  },
  output: {
    path: PUBLIC_DIR,
    publicPath: "/",
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  plugins: [
    new WebpackBar({
      profile: true,
    }),
    new CopyPlugin([{ from: "prefetch-scripts", to: "js" }]),
  ],
};
