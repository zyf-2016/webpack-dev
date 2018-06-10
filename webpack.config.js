const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

function getHtmlConfig(name,title) {
  return {
    filename: 'html/' + name + '.html', // 配置输出文件名和路径
    template: 'src/view/' + name + '.html', // 配置文件模板
    title: title,
    inject: true,
    hash: true,
    chunks: ['common',name],
    cache: true,
  }
}
module.exports = {
  entry: {
    common: 'src/common/common',
    index: 'src/page/index/index',
    login: 'src/page/login/index'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'js/[name].js',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      // {
      //   enforce: 'pre', // 指定为前置类型
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: "eslint-loader",
      // },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                //支持@important引入css
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                  plugins: function() {
                      return [
                          //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
                          require('postcss-import')(),
                          require("autoprefixer")({
                              "browsers": ["Android >= 4.1", "iOS >= 7.0", "ie >= 8"]
                          })
                      ]
                  }
              }
            }
          ]
        }),
      },
      // {
      //   test: /\.less$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       'css-loader',
      //       'less-loader',
      //     ],
      //   }),
      // },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
                //'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        //支持@important引入css
                        importLoaders: 1
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function() {
                            return [
                                //一定要写在require("autoprefixer")前面，否则require("autoprefixer")无效
                                require('postcss-import')(),
                                require("autoprefixer")({
                                    "browsers": ["Android >= 4.1", "iOS >= 7.0", "ie >= 8"]
                                })
                            ]
                        }
                    }
                },
                'less-loader'
            ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options:{
              name: 'resource/[hash:8].[name].[ext]',
              // publicPath:'/'
            }
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)\w*/,
        use: [
          {loader:'file-loader',options:{name:'fonts/[name].[hash:8].[ext]'}}
        ]
      },
    ],
  },

  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'), // 这里使用 path.resolve 和 __dirname 来获取绝对路径
      src: path.resolve(__dirname, 'src'), // 这里使用 path.resolve 和 __dirname 来获取绝对路径
      image: path.resolve(__dirname, 'src/image'), // 这里使用 path.resolve 和 __dirname 来获取绝对路径
      styles: path.resolve(__dirname, 'src/styles'), // 这里使用 path.resolve 和 __dirname 来获取绝对路径
      log$: path.resolve(__dirname, 'src/utils/log.js') // 只匹配 log
    },
    extensions: ['.js', '.json', '.jsx', '.css', '.less'],
    modules: [
      path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
    ],
  },
  externals: {
    'jquery': "window.jQuery"
  },
  plugins: [
    new HtmlWebpackPlugin(getHtmlConfig('login','登录')),
    new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.DefinePlugin({
      TWO: '1+1',
      CONSTANTS: {
        APP_VERSION: JSON.stringify('1.1.2'), // const CONSTANTS = { APP_VERSION: '1.1.2' }
      },
    }),
    new CopyWebpackPlugin([
      { from: 'src/image/favicon.ico', to: 'favicon.ico', }, // 顾名思义，from 配置来源，to 配置目标路径
    ]),
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
    new CleanWebpackPlugin(['/dist'],
      // [
      //   'dist/*.js',
      //   'dist/css/*.css',
      //   'dist/*.html'
      // ],
      {
        verbose: true,
        dry: false,
      }
    ),
  ],
  // 打包公共js模块
  optimization: {
    splitChunks: {
      cacheGroups: {
          common: {
              name: "common",
              chunks: "initial",
              minChunks: 2
          }
      }
    },
  },

  devServer: {
    // contentBase: 'localhost',
    port: '1234',
    open: true,
    proxy: {
      '/api/*': {
        target: 'http://happymmall.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '/product'
        }
      }
    },
    before(app){
      app.get('/api/test.json', function(req, res) { // 当访问 /some/path 路径时，返回自定义的 json 数据
        res.json({ code: 200, message: 'hello world' })
      })
    }
  },
}
