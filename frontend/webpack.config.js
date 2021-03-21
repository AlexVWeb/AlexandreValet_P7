let Encore = require('@symfony/webpack-encore');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
historyApiFallback = require('connect-history-api-fallback')

const Dotenv = require('dotenv-webpack');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .addEntry('app', './src/js/app.js')

    .setOutputPath('public/build/')
    .setPublicPath('/build')
    // .copyFiles({from: './src/images', to: './images'})

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    // .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // .enableVersioning(Encore.isProduction())

    // enables @babel/preset-env polyfills
    /*    .configureBabelPresetEnv((config) => {
            config.useBuiltIns = 'usage';
            config.corejs = 3;
        })*/

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    // .autoProvidejQuery()

    .enablePostCssLoader(function (option) {
        option.postcssOptions = {
            plugins: [
                require('autoprefixer')({
                    overrideBrowserslist: [
                        '> 1%',
                        'last 2 versions'
                    ],
                    grid: true
                })
            ]
        }
    })

    // uncomment if you use API Platform Admin (composer req api-admin)
    .enableReactPreset()
    //.addEntry('admin', './assets/js/admin.js')

    .addPlugin(
        new BrowserSyncPlugin({
            // proxy: 'https://groupomania.local',
            host: 'localhost',
            port: 3001,
            middleware: [historyApiFallback()],
            notify: false,
            open: false,
            ghostMode: {
                clicks: false,
                forms: false,
                scroll: false
            }
        })
    )
    .addPlugin(new Dotenv( { path: '../.env', systemvars: true } ))
;
const config = Encore.getWebpackConfig();
config.node = {fs: 'empty'};
module.exports = config;