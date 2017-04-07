var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

var paths = require('./paths');

// Grab script arguments.
var args = process.argv.slice(2);
var useMockApi = args.find((arg) => arg.match(/--mockapi/));
var useTestTranslation = args.find((arg) => arg.match(/--testtranslations?|--tt/));

module.exports = {
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    paths.appIndexJs,
  ],
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: 'scripts/bundle.js',
    sourceMapFilename: 'scripts/bundle.map',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  devtool: 'eval-source-map',
  devServer: {
    inline: true
  },
  plugins: [
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:9005' })
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
