const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    main: './docs&#x2F;sidebar/index.js'
  },
  output: {
    path: path.resolve(__dirname, '..', 'docs'),
    filename: '[name].[chunkhash].js'
  },
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\//, to: '/index.html' }
      ]
    }
  },
  optimization: {
    minimize: true, 
    minimizer: [ new TerserPlugin({extractComments: false}) ]
  },
  resolve: {
    fallback: {
      fs: false,
      path: false
    }
  },
  performance: {
    hints: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: 'docs&#x2F;sidebar/index.html', chunks: ['main'], filename: 'index.html' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './docs&#x2F;sidebar/assets', to: 'assets' },
        { from: './docs&#x2F;sidebar/pages', to: 'pages' },
        { from: './docs&#x2F;sidebar/!(index).html', to: '[name][ext]' },
        { from: './docs&#x2F;sidebar/*.txt', to: '[name][ext]' }
      ]
    })
  ],
  module: {
    rules: [
      { // load as string
        test: [/.html$/],
        exclude: [/index.html/],
        type: 'asset/source'
      },
      { // load as string
        test: [/.css$/],
        exclude: [/style.css$/, /app.css$/, /app.mobile.css$/],
        type: 'asset/source'
      },
      { // output as a file
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name]-[hash][ext][query]'
        }
      }
    ]
  }
};
