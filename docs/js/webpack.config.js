const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname),
        filename: 'demo.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'demo.css'
        })
    ],
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production'
}
