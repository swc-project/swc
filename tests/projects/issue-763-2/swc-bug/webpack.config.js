const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const HappyPack = require("happypack");
const yargs = require("yargs");

const common = require("./webpack.common");

const smp = new SpeedMeasurePlugin();
const SRC_DIR = __dirname + "/src";
const PUBLIC_DIR = __dirname + "/public";

module.exports = smp.wrap(
  merge(common, {
    mode: "development",
    // devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["swc-loader"],
        },
      ],
    },
    plugins: [
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require("./public/library/library-manifest.json"),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: SRC_DIR + "/index.ejs",
      }),
      new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
      contentBase: PUBLIC_DIR,
      hot: true,
      port: 9000,
    },
  })
);
