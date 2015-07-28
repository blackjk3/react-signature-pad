module.exports = {
  //context: __dirname + "/src",
  entry: ["webpack/hot/dev-server", "./app.js"],

  output: {
    filename: "app.js",
    path: __dirname + "/build",
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"]
      }
    ],
  }
}