const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const production = process.env.npm_lifecycle_event == 'build'

let pathsToClean = [
  'js'
]

let cleanOptions = {
  root: path.resolve(__dirname, './build/'),
  exclude: [],
  verbose: true,
  dry: false
}

let htmlTemplate = {
  production: production,
  title: 'Forum',
  inject: false,
  hash: true,
  filename: 'index.php',
  template: 'dynamic/index.php',
}

module.exports = {
  entry: {
    // only include the tests.js when it's needed
    bundel: './dynamic/js/index.js',
    tests: './dynamic/js/tests.js'
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
    new FriendlyErrorsWebpackPlugin(),
    new LiveReloadPlugin({}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': (production) ? '"production"' : '"development"'
    }),
    new HtmlWebpackPlugin(
      Object.assign({}, htmlTemplate, {
        filename: 'index.php'
      })
    ),
    new HtmlWebpackPlugin(
      Object.assign({}, htmlTemplate, {
        filename: 'message.php'
      })
    ),
    new HtmlWebpackPlugin(
      Object.assign({}, htmlTemplate, {
        filename: 'settings.php'
      })
    )
  ],
  stats: {
    colors: true
  },
  devtool: (production) ? 'none' : 'source-map',
  mode: (production) ? 'production' : 'development'
}