/**
 * @todo Consolidate use of hard-coded path strings in this file into './gulpfileConfig.json'.
 */
import * as path from 'path';
import * as packageJson from './package';

import gulp from 'gulp';
import * as eslint from 'gulp-eslint';
import jsdoc from 'gulp-jsdoc3';
import gulpBabel from 'gulp-babel';

/** Rollup plugins **/
import * as rollup from 'rollup';
import rollupBabel from 'rollup-plugin-babel';
import rollupResolve from 'rollup-plugin-node-resolve';

/** Util Modules **/
import del from 'del';

const

    /** System and config includes **/
    {buildConfig, buildConfig: {srcsGlob}} = packageJson,

    /** Gulp Modules (or modules used by gulp) **/

    getReadStreamFinish = (resolve, reject) => err => err ? reject(err) : resolve(),

    /** Paths **/
    {docs: docsBuildPath, dist: buildPathRoot} = buildConfig.paths,

    buildPath = (...tails) => path.join(buildPathRoot, ...tails),

    log = console.log.bind(console),

    // Build paths
    cjsBuildPath = buildPath(buildConfig.folderNames.cjs),
    es6BuildPath  = buildPath(buildConfig.folderNames.es6Module),

    // Module names
    {outputFileName, outputFileNameMjs, inputModuleName} = buildConfig,

    {series, dest, src, parallel} = gulp,

    deleteFilePaths = pathsToDelete =>
        del(pathsToDelete)
            .then(deletedPaths => {
                if (deletedPaths.length) {
                    log('\nThe following paths have been deleted: \n - ' + deletedPaths.join('\n -'));
                    return;
                }
                log(' - No paths to clean.\n', '--mandatory');
            })
            .catch(log),

    cleanTask = () => {
        let pathsToDelete = [cjsBuildPath, es6BuildPath]
            .map(partialPath => path.join(partialPath, '**', '*.js'));
        return deleteFilePaths(pathsToDelete);
    },

    eslintTask = () =>
        src([srcsGlob, '!node_modules/**'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failOnError()),

    cjsTask = () =>
        src(srcsGlob)
            .pipe(gulpBabel(buildConfig.buildCjsOptions.babel))
            .pipe(dest(cjsBuildPath)),

    es6ModuleTask = () =>
        rollup.rollup({
            input: `src/${inputModuleName}.js`,
            external: buildConfig.es6ModuleRollup.config.external,
            plugins: [
                rollupResolve(),
                rollupBabel({
                    babelrc: false,
                    presets: [],
                    exclude: ['node_modules/**'],
                })
            ]
        })
            .then(bundle => bundle.write({
                file: path.join(es6BuildPath, outputFileNameMjs),
                format: 'es',
                name: inputModuleName,
                sourcemap: true
            })
                .then(() => bundle)
            )
            .then(bundle => bundle.write({
                file: path.join(es6BuildPath, outputFileName),
                format: 'es',
                name: inputModuleName,
                sourcemap: true
            })),

    buildJsTask = parallel(cjsTask, es6ModuleTask),

    buildTask = series(cleanTask, buildJsTask),
    //
    // readmeTask = () => {
    //     const moduleMemberListOutputPath = './markdown-fragments-generated/module-and-member-list.md';
    //
    //     return deleteFilePaths([
    //         './markdown-fragments-generated/*.md',
    //         './README.md'
    //     ])
    //         .then(() => new Promise((resolve, reject) => moduleMemberListsReadStream(innerModulesMap)
    //             .pipe(fs.createWriteStream(moduleMemberListOutputPath))
    //             .on('finish', getReadStreamFinish(resolve, reject))
    //         ))
    //         .then(() => new Promise((resolve, reject) => gulp.src(buildConfig.readme.files)
    //             .pipe(concat('./README.md'))
    //             .pipe(gulp.dest('./'))
    //             .on('finish', getReadStreamFinish(resolve, reject))
    //         ));
    // },

    docTask = () => deleteFilePaths([`${docsBuildPath}/**/*`])
            .then(() => new Promise((resolve, reject) =>
                src(['README.md', srcsGlob])
                    .on('finish', getReadStreamFinish(resolve, reject))
                    .pipe(jsdoc(buildConfig.jsdoc))
            )),

    watchTask = series(buildTask, function watchTask () {
            return gulp.watch([srcsGlob, './node_modules/**'], buildJsTask);
        }
    );

    gulp.task('eslint', eslintTask);

    gulp.task('build', buildTask);

    // gulp.task('readme', readmeTask);

    gulp.task('docs', docTask);

    gulp.task('watch', watchTask);

    gulp.task('default', watchTask);
