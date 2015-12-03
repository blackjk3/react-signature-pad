module.exports = {
  entry: {
    app: ["./src/index.js"]
  },

  // output: {
  //   filename: "app.js",
  //   path: __dirname + "/lib",
  // },

  output: {
    path: __dirname + "/lib",
    filename: "app.js",
    library: 'SignaturePad',
    libraryTarget: 'umd',
  },

  externals: {
    //don't bundle the 'react' npm package with our bundle.js
    //but get it from a global 'React' variable
    'react': 'react',
    'react-dom': 'react-dom'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ],
  }
}
