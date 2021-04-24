const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'gloo.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'src/index.html'
  })],
  devServer: {
    contentBase: __dirname + '/dist',
    port: 3000,
    hot: true,
  }
}