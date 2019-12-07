const Koa = require('koa')
const path = require('path')
const app = new Koa()


const outputConfig = Object.create(null)
// config.outputKeys.map(key => outputConfig[key] = config[key])

app
  .use(require('koa-bodyparser')())
  .use((ctx, next) => {
    ctx.state = ctx.state || Object.create(null)
    // ctx.state.config = outputConfig
    return next()
  })

require('koa-ejs')(app, {
  root: path.resolve(__dirname, '../dist/views'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false,
  delimiter: '?',
})
require('./config/router')(app)

module.exports = app