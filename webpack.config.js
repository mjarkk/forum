const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var htmlMinifier = require('html-minifier').minify

const production = false


let pathsToClean = [
  'js'
]

let cleanOptions = {
  root:     path.resolve(__dirname, './build/'),
  exclude:  [],
  verbose:  true,
  dry:      false
}

module.exports = {
  entry: {
    bundel: './dynamic/js/index.js'
  },
  output: {
    filename: 'js/[hash].[name].js',
    path: path.resolve(__dirname, './build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          presets: ['es2015']
        }
      },
      {
        test: /\.styl$/, 
        loader: 'style-loader!css-loader!stylus-loader' 
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new HtmlWebpackPlugin({
      title: 'Forum',
      minify: htmlMinifier,
      inject: 'body',
      hash: true,
      filename: 'index.html',
      template: 'dynamic/index.html'
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map',
  mode: (production) ? 'production' : 'development'
}