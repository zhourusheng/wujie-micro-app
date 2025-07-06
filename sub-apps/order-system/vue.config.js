module.exports = {
  devServer: {
    port: 8003,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      // 微前端环境下确保子应用资源正确加载
      libraryTarget: 'umd',
      chunkLoadingGlobal: 'webpackJsonp_order_system',
    }
  }
} 