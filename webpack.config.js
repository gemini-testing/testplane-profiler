'use strict';

const path = require('path');
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
    }
};
