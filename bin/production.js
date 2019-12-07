const path = require('path')
const app = require('../server/app')
app.proxy = true
app.use(require('koa-static')(path.resolve(__dirname, './static/')))
app.listen(3000)