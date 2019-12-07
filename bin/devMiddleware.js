const WebpackDevMiddleware = require('webpack-dev-middleware')

const devMiddleware = (compiler, opts) => {
  const middleware = WebpackDevMiddleware(compiler, opts)
  return async (ctx, next) => {
    await middleware(ctx.req, {
      end: (content) => ctx.body = content,
      setHeader: (name, value) => ctx.set(name, value)
    }, next)
  }
}

module.exports = devMiddleware