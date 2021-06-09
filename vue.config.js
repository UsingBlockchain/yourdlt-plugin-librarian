
module.exports = {
    // Disables extract of CSS files
    css: {extract: false},
    // Disables module splitting
    configureWebpack: {
      optimization: {
        splitChunks: false
      }
    }
};
