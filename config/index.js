/*
 * @Author: gongxi33
 * @Date: 2022-04-30 10:38:17
 * @LastEditTime: 2022-08-10 17:38:27
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /bio/config/index.js
 */

const CIPluginOpt = {
  // 微信小程序
  weapp: {
    appid: "wxeea057526f46913c",
    privateKeyPath: "./private.wx105c0ec0ba14780c.key"
  },
  // 版本号
  version: "1.0.0",
  // 版本发布描述
  desc: "版本描述"
}
const config = {
  projectName: 'bio',
  date: '2022-4-30',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [ ["@tarojs/plugin-mini-ci", CIPluginOpt]],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
