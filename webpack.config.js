const path = require('path');
const rules = require('./webpack.config.rules')();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const Handlebars = require("handlebars");
const ImageminPlugin = require("imagemin-webpack");
const regeneratorRuntime = require("regenerator-runtime");
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;


const filename = (ext) => isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`;

const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
      configObj.minimizer = [
        new CssMinimizerPlugin(),
        new TerserPlugin()
      ]
  }
  return configObj;
}

const plugins = () => {
  const basePlugins = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.hbs'),
      filename: 'index.html',
      minify:  {
        collapseWhitespace: isProd
      }
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`,
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {from: path.resolve(__dirname, './src/images') , to: path.resolve(__dirname, './dist/images')  }
      ]
    }),
 
  ]

  if (isProd) {
    basePlugins.push(
      new ImageminPlugin({
        bail: false, // Ignore errors on corrupted images
        cache: true,
        imageminOptions: {
          // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them
   
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 5 }],
            [
              "svgo",
              {
                plugins: [
                  {
                    removeViewBox: false
                  }
                ]
              }
            ]
          ]
        }
      })
    )
  }

  return basePlugins;
}

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, './src/index.js')
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    proxy: {
      ws: true,
    }
  },
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
  },
  optimization: optimization(),
  plugins: plugins(),
  devtool: isProd ? false : 'source-map',
  module: {rules}
}