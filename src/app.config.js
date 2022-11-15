/*
 * @Author: gongxi33
 * @Date: 2022-04-30 10:38:17
 * @LastEditTime: 2022-04-30 16:53:28
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /bio/src/app.config.js
 */
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/home/index',
    'pages/add/index',
    'pages/mine/index',
	'pages/changePassword/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
