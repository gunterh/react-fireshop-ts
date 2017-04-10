var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

var paths = require('./paths');

// We should wrap the config in webpack-validator like in dev, but
// unfortunately it does not work well with the sassLoader options
module.exports = {
  entry: paths.appIndexJs,
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: 'scripts/bundle.[hash:8].js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: 'source-map',
  target: 'web',
  plugins: [
    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        keepClosingSlash: true,
      },
      inject: true,
    }),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
};
