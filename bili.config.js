module.exports = {
  banner: true,
  runtimeHelpers: true,
  bundleNodeModules:false,
  output: {
    extractCSS: false,
  },
  plugins: {
    vue: {
      css: true
    }
  }
};
