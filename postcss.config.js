const plugins = [
  require('autoprefixer')({ 
    // browsers: ['> 1%', 'last 2 versions', 'not ie <= 11'] 
    grid: "autoplace",
    flexbox: true
  }),
  require('cssnano')({
    preset: [
      'default', {
        discardComments: {
          removeAll: true
        }
      }
    ]
  })
]

module.exports = {
  plugins
}