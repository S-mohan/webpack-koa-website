const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'

// 获取入口文件
function getEntry (globPath, pathDir) {
  const files = glob.sync(globPath)
  let entries = {}, entry, dirname, basename, pathname, extname

  for (let i = 0; i < files.length; i++) {
    entry = files[i]
    dirname = path.dirname(entry)
    extname = path.extname(entry)
    basename = path.basename(entry, extname)
    pathname = path.normalize(path.join(dirname, basename))
    pathDir = path.normalize(pathDir)
    if (pathname.startsWith(pathDir)) {
      pathname = pathname.substring(pathDir.length)
    }
    entries[pathname] = ['./' + entry]
  }
  return entries
}


const entries = getEntry('./src/entries/**/*.js', 'src/entries/')

// config
const config = {
  entry: entries,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: isDev ? 'js/[name].js' : 'static/js/[name].[hash:7].js',
    publicPath: '/'
  },
  resolve: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader'
        }],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: !isDev ? 'static/img/[name].[hash:7].[ext]' : 'img/[name].[ext]'
          }
        }]
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),

    new MiniCssExtractPlugin({
      filename: !isDev ? 'static/css/[name].[hash:7].css' : 'css/[name].css',
      chunkFilename: !isDev ? 'static/css/[name].[hash:7].css' : 'css/[name].css'
    }),

    new OptimizeCSSPlugin({ safe: true, map: false, discardComments: { removeAll: true } }),
  ],

  optimization : {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'app',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
}

// 获取模板文件
Object.keys(getEntry('./src/views/**/*.html', './src/views/')).forEach(pathname => {
  const options = {
    filename: './views/' + pathname + '.html', 
    template: 'src/views/' + pathname + '.html', 
    // 暂时先不注入
    inject: false,
    minify: { 
     removeComments: true, 
     collapseWhitespace: false,
     minifyCSS: true,
     minifyJS: true
    },
    // 强制写入磁盘
    alwaysWriteToDisk: true,
  }

  if (pathname in config.entry) {
    options.favicon = path.resolve(__dirname, './src/assets/imgs/favicon.ico')
    options.inject = 'body'
    options.chunks = ['app', pathname]
    options.hash = true
  }

  config.plugins.push(new HtmlWebpackPlugin(options))
})

config.plugins.push(new HtmlWebpackHarddiskPlugin())

module.exports = config