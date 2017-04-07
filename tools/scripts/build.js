process.env.NODE_ENV = 'production';

var chalk = require('chalk');
var clearConsole = require('react-dev-utils/clearConsole');
var fs = require('fs-extra');
var path = require('path');
var filesize = require('filesize');
var gzipSize = require('gzip-size').sync;
var rimrafSync = require('rimraf').sync;
var stripAnsi = require('strip-ansi');
var webpack = require('webpack');

var config = require('../webpack.prod');
var paths = require('../paths');

// Helper functions
function printFileSizes(stats) {
  var assets = stats
    .toJson()
    .assets
    .filter(asset => /\.(js|css)$/.test(asset.name)) // only include js and css
    .filter(asset => /help/.test(path.dirname(asset.name)) === false) // exclude help files
    .map(asset => {
      var filePath = paths.appBuild + '/' + asset.name;
      var fileStats = fs.statSync(filePath);
      var fileContents = fs.readFileSync(filePath);
      var size = filesize(fileStats.size);
      var gSize = filesize(gzipSize(fileContents));
      // var previousSize = previousSizeMap[removeFileNameHash(asset.name)];
      // var difference = getDifferenceLabel(size, previousSize);
      return {
        folder: path.join(paths.appBuild + '/', path.dirname(asset.name)),
        name: path.basename(asset.name),
        sizeLabel: size + ' (' + gSize + ')',
      };
    });
  assets.sort((a, b) => b.size - a.size);
  var longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );
  assets.forEach(asset => {
    var sizeLabel = asset.sizeLabel;
    var sizeLength = stripAnsi(sizeLabel).length;
    if (sizeLength < longestSizeLabelLength) {
      var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }
    console.log(
      '  ' + sizeLabel +
      '  ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
    );
  });
}

clearConsole();

/**
 * Remove all content but keep the directory so that
 * if you're in it, you don't end up in Trash
 */
console.log('Clean build directory...');
rimrafSync(paths.appBuild + '/*');
console.log(chalk.green('Done.'));
console.log();

/**
 * Build it
 * NOTE: linting errors do not appear to return as a "err",
 * they are included in stats as plain text so kinda difficult
 * to find, so we need to run lint and tests prior to build
 */
console.log('Creating an optimized production build...');
webpack(config, (err, stats) => {
  if (err) {
    console.error('Failed to create a production build. Reason:');
    console.error(err.message || err);
    process.exit(1);
  }

  console.log(chalk.green('Done.'));
  console.log();

  console.log('File sizes (gzip):');
  console.log();
  printFileSizes(stats);
  console.log();

  console.log(chalk.yellow('To test in your browser, run "npm run start:prod"'));
  console.log();
});
