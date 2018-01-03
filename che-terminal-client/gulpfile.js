const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const fs = require('fs-extra');
const gulp = require('gulp');
const merge = require('merge-stream');
const sorcery = require('sorcery');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
var uglify = require('gulp-uglify');


var buildDir = process.env.BUILD_DIR || 'build';
var browserifyOptions = {
  basedir: buildDir,
  debug: true,
  entries: ['../lib/xterm.js', '../lib/addons/fit/fit.js'],
  standalone: 'Terminal',
  cache: {},
  packageCache: {}
};

/**
 * Compile TypeScript sources to JavaScript files and create a source map file for each TypeScript
 * file compiled.
 */
gulp.task('tsc', function () {
  // Remove the lib/ directory to prevent confusion if files were deleted in src/
  fs.emptyDirSync('lib');
  fs.emptyDirSync('build');

  // Build all TypeScript files (including tests) to lib/, based on the configuration defined in
  // `tsconfig.json`.
  var tsProject = ts.createProject('tsconfig.json');
  var tsResult = tsProject.src().pipe(sourcemaps.init()).pipe(tsProject());
  var tsc = tsResult.js.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: ''})).pipe(gulp.dest('lib'));

  // Copy all addons from src/ to lib/
  var copyAddons = gulp.src('src/addons/**/*').pipe(gulp.dest('lib/addons'));

  return merge(tsc, copyAddons);
});

/**
 * Bundle JavaScript files produced by the `tsc` task, into a single file named `xterm.js` with
 * Browserify.
 */
gulp.task('browserify', ['tsc'], function() {
  // Ensure that the build directory exists
  fs.ensureDirSync(buildDir);

  return bundleStream = browserify(browserifyOptions)
    .bundle()
    .pipe(source('xterm.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(buildDir));
});

/**
 * Bundle JavaScript files produced by the `tsc` task, into a single file named `xterm.js` with
 * Browserify.
 */
gulp.task('browserify-with-source-map', ['tsc'], function() {
  // Ensure that the build directory exists
  fs.ensureDirSync(buildDir);

  return bundleStream = browserify(browserifyOptions)
    .bundle()
    .pipe(source('xterm.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true, sourceRoot: '..'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildDir));
});

/**
 * Use `sorcery` to resolve the source map chain and point back to the TypeScript files.
 * (Without this task the source maps produced for the JavaScript bundle points into the
 * compiled JavaScript files in lib/).
 */
gulp.task('sorcery', ['browserify-with-source-map'], function () {
  var chain = sorcery.loadSync(`${buildDir}/xterm.js`);
  chain.apply();
  chain.writeSync();
});

gulp.task('build', ['browserify']);

gulp.task('default', ['build']);

gulp.task('dev', ['sorcery']);
