'use strict';

const path = require('path');
const webpack = require('webpack');

const staticPath = path.resolve(__dirname, 'lib', 'static');

module.exports = {
    entry: './main.js',
    context: staticPath,
    output: {
        path: staticPath,
        filename: 'bundle.min.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'env', 'stage-2']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    'drop_console': true,
                    unsafe: true
                }
            }
        })
    ]
};
