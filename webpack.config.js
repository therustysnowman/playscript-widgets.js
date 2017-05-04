var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'playscript-editor': './app/app.js'
  },
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'html-loader'
        ]
      }
    ]
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/
      })
  ],
  devServer: {
    contentBase: 'demo',
    watchOptions: {
      poll: 1000
    }
  }
};
