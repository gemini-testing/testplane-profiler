'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const defaultConfig = require('./webpack.config');

module.exports = merge(defaultConfig, {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    'drop_console': true,
                    unsafe: true
                }
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
});
