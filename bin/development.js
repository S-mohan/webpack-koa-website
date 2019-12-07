const webpack = require('webpack')
const app = require('../server/app')
const webpackConfig = require('../webpack.config')
const devMiddleware = require('./devMiddleware')
const compiler = webpack(webpackConfig)


app
  .use(devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  }))
  .listen(3000)
