const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  configureWebpack: {
    // No need for splitting
    optimization: {
      splitChunks: false
    }
  }
})
