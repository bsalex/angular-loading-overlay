// Karma configuration
// Generated on Tue Sep 22 2015 23:49:19 GMT+0300 (EEST)
var path = require('path');
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/ng-describe/dist/ng-describe.js',
            'source/**/*spec.ts'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'source/**/*spec.ts': ['webpack', 'sourcemap']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        webpack: {
            cache: true,
            devtool: 'inline-source-map',
            stats: {
                colors: true,
                reasons: true
            },
            module: {
                preLoaders: [{
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    loader: 'tslint-loader'
                }],
                loaders: [{
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                }]
            },
            resolve: {
                extensions: ['', '.ts', '.js']
            }
        },

        webpackMiddleware: {
            noInfo: true,
            stats: {
                colors: true
            }
        },

        coverageReporter: {
            reporters: [{
                type: 'lcovonly',
                subdir: '.',
                file: 'lcov.info'
            }],
            dir: 'coverage/'
        }
    });
};
