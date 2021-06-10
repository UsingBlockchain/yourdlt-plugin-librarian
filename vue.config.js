/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

module.exports = {
    // Disables extract of CSS files
    css: {extract: false},
    // Disables module splitting
    configureWebpack: {
      optimization: {
        splitChunks: false
      }
    },
    // Enables templates in .vue files
    runtimeCompiler: true
};
