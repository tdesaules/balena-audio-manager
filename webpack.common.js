const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte', '.ts', '.css', '.scss'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  module: {
    rules: [
    {
      test: /\.html$/i,
      use: 'html-loader',
      exclude: '/node_modules/',
    },
    {
      test: /\.js$/i,
      use: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.svelte$/i,
      use: {
        loader: 'svelte-loader',
        options: {
          preprocess: require('svelte-preprocess')({})
        },
      },
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/main.html',
      filename: './index.html',
    }),
  ],
}