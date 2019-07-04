const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssNano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
  entry: ['./src/app/index.js', './src/styles/index.css'],
  externals: {
    SuperParticles: 'SuperParticles'
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: CssNano,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    ],
  },
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: 'styles/',
            },
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/src/public/index.html",
      inject: 'body',
      collapseWhitespace: true,
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
      filename: '[path].gz',
      minRatio: 1
    }),
    new BrotliPlugin({
      test: /\.js$|\.css$|\.html$/,
      asset: '[path].br',
      minRatio: 1
    }),
    new CopyWebpackPlugin([{
      from: __dirname + '/src/public'
    }])
  ]
};
