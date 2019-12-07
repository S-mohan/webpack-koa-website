class Controller {
  static async index (ctx, next) {
    
    await ctx.render('index', {})
  }
}

module.exports = Controller