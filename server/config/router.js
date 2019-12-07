const Router = require('koa-router')
const RenderController = require('../controller')


module.exports = app => {
  const router = new Router()
  router
    .get('/', RenderController.index)

  app
    .use(router.routes())
    .use(router.allowedMethods())

}
