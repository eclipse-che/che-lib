const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const merge = require('merge-stream');
const source = require('vinyl-source-stream');
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');

const buildDir = process.env.BUILD_DIR || 'build';
const tsProject = ts.createProject('tsconfig.json');
const srcDir = tsProject.config.compilerOptions.rootDir;
let outDir = tsProject.config.compilerOptions.outDir;

const addons = fs.readdirSync(`${__dirname}/src/addons`);

// Under some environments like TravisCI, this comes out at absolute which can
// break the build. This ensures that the outDir is absolute.
if (path.normalize(outDir).indexOf(__dirname) !== 0) {
  outDir = `${__dirname}/${path.normalize(outDir)}`;
}

/**
 * Compile TypeScript sources to JavaScript files and create a source map file for each TypeScript
 * file compiled.
 */
gulp.task('tsc', function () {
  // Remove the ${outDir}/ directory to prevent confusion if files were deleted in ${srcDir}/
  fs.emptyDirSync(`${outDir}`);

  // Build all TypeScript files (including tests) to ${outDir}/, based on the configuration defined in
  // `tsconfig.json`.
  const tsResult = tsProject.src().pipe(tsProject());
  const tsc = merge(
    tsResult.js.pipe(gulp.dest(outDir)),
    tsResult.dts.pipe(gulp.dest(outDir))
  );

  const addonStreams = addons.map(function(addon) {
    fs.emptyDirSync(`${outDir}/addons/${addon}`);

    const tsProjectAddon = ts.createProject(`./src/addons/${addon}/tsconfig.json`);
    const tsResultAddon = tsProjectAddon.src().pipe(tsProjectAddon());
    return merge(
      tsResultAddon.js
        .pipe(gulp.dest(`${outDir}/addons/${addon}`)),
      tsResultAddon.dts
        .pipe(gulp.dest(`${outDir}/addons/${addon}`))
    )
  });

  // Copy all addons from ${srcDir}/ to ${outDir}/
  const copyAddons = gulp.src([
    `${srcDir}/addons/**/**`
  ]).pipe(gulp.dest(`${outDir}/addons`));

  // Join all streams into a single array
  const streams = [tsc].concat(addonStreams).concat(copyAddons);

  return merge.apply(this, streams);
});

/**
 * Bundle JavaScript files produced by the `tsc` task, into a single file named `xterm.js` with
 * Browserify.
 */
gulp.task('browserify', ['tsc'], function() {
  // Ensure that the build directory exists
  fs.ensureDirSync(buildDir);

  const browserifyOptions = {
    basedir: buildDir,
    debug: true,
    entries: [`${outDir}/xterm.js`],
    standalone: 'Terminal',
    cache: {},
    packageCache: {}
  };
  return browserify(browserifyOptions)
        .bundle()
        .pipe(source('xterm.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(buildDir));
});

gulp.task('browserify-addons', ['tsc'], function() {
  const bundles = addons.map((addon) => {
    const addonOptions = {
      basedir: `${buildDir}/addons/${addon}`,
      debug: true,
      entries: [`${outDir}/addons/${addon}/${addon}.js`],
      standalone: addon,
      cache: {},
      packageCache: {}
    };

    return browserify(addonOptions)
      .external(`${outDir}/Terminal.js`)
      .bundle()
      .pipe(source(`./addons/${addon}/${addon}.js`))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(buildDir));
  });

  return merge(...bundles);
});

gulp.task('build', ['browserify', 'browserify-addons']);
gulp.task('default', ['build']);
