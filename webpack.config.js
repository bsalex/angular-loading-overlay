/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

'use strict';
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

module.exports = {

    output: {
        filename: './dist/angular-loading-overlay.js',
        publicPath: './dist/'
    },

    devServer: {
        hot: true,
        port: 8000,
        publicPath: '/assets/',
        contentBase: './source/'
    },

    entry: './source/BsLoadingOverlayModule.ts',
    stats: {
        colors: true,
        reasons: true
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        preLoaders: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'tslint-loader'
        }],
        loaders: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        }]
    }
};
