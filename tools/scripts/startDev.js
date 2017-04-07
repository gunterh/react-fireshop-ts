process.env.NODE_ENV = 'development';

var WebpackDevServer = require('webpack-dev-server');
var chalk = require('chalk');
var clearConsole = require('react-dev-utils/clearConsole');
var webpack = require('webpack');

var config = require('../webpack.dev');

var compiler = webpack(config);

var host = 'localhost';
var port = 9005;
var devServer = new WebpackDevServer(compiler, {
  contentBase: config.output.path,
  hot: true,

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: true,

  // Set this if you want to enable gzip compression for assets
  compress: true,

  // Control the console log messages shown in the browser when using inline mode.
  // Can be `error`, `warning`, `info` or `none`.
  clientLogLevel: 'info',

  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },

  // It's a required option.
  publicPath: config.output.publicPath,
  stats: { colors: true }
});

// Launch WebpackDevServer.
devServer.listen(port, host, function (err) {
  if (err) {
    return console.log(err);
  }

  clearConsole();
  console.log(chalk.cyan('Starting the development server...'));
  console.log();
  return undefined;
});
