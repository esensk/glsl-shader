module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        use: ["raw-loader", "glslify-loader"],
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  devServer: {
    contentBase: "dist",
    open: true,
    inline: true,
  },
};
