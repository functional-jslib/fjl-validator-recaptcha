/**
 * Created by elyde on 12/13/2016.
 */

'use strict';

const path = require('path'),
    packageJson = require('./package'),
    gulpConfig = packageJson.buildConfig,

    /** Gulp Modules (or modules used by gulp) **/
    gulp =          require('gulp'),
    eslint =        require('gulp-eslint'),
    jsdoc =         require('gulp-jsdoc3'),
    lazyPipe =      require('lazypipe'),
    gulpBabel =     require('gulp-babel'),

    /** Util Modules **/
    chalk = require('chalk'),
    del = require('del'),

    {dist, docs} = gulpConfig.paths,
    {cjs} = gulpConfig.folderNames,
    {srcsGlob} = gulpConfig,

    buildPath = (...tails) => path.join.apply(path, [dist].concat(tails)),
    yargs = require('yargs'),

    argv = yargs()
        .default('dev', false)
        .default('skipLint', false)
        .alias('skip-lint', 'skipLint')
        .argv,

    {skipLint} = argv,

    eslintPipe = lazyPipe()
        .pipe(eslint)
        .pipe(eslint.format)
        .pipe(eslint.failOnError),

    log = console.log.bind(console),

    deleteFilePaths = pathsToDelete => {
        return del(pathsToDelete)
            .then(deletedPaths => {
                if (deletedPaths.length) {
                    log(chalk.dim('\nThe following paths have been deleted: \n - ' + deletedPaths.join('\n - ') + '\n'));
                    return;
                }
                log(chalk.dim(' - No paths to clean.') + '\n', '--mandatory');
            })
            .catch(log);
    };

gulp.task('clean', () => {
    let pathsToDelete = [cjs]
        .map(partialPath => buildPath(partialPath, '**', '*.js'));
    return deleteFilePaths(pathsToDelete);
});

gulp.task('eslint', () => gulp.src([
    srcsGlob,
    './tests/**/*-test.js',
    '!node_modules/**'
]).pipe(eslintPipe()));

gulp.task('cjs', ['eslint'], () =>
    gulp.src(srcsGlob)
        .pipe(gulpBabel(gulpConfig.cjsRollup.babel))
        .pipe(gulp.dest(buildPath(cjs))));

gulp.task('build-js', ['cjs']);

gulp.task('jsdoc', () =>
    deleteFilePaths(['./docs/**/*'])
        .then(_ =>
            gulp.src(['README.md', srcsGlob], {read: false})
                .pipe(jsdoc({
                    opts: {
                        'template': 'templates/default',  // same as -t templates/default
                        'encoding': 'utf8',               // same as -e utf8
                        'destination': docs,       // same as -d ./out/
                        'recurse': true
                    }
                }))
        )
);

gulp.task('build-docs', ['jsdoc']);

gulp.task('build', ['build-js']);

gulp.task('watch', ['build'], () =>
    gulp.watch([
        srcsGlob,
        './node_modules/**'
    ], [
        'build-js'
    ]));

gulp.task('default', ['build', 'watch']);
