/*
 * @Author: gongxi33
 * @Date: 2022-04-30 10:38:17
 * @LastEditTime: 2022-04-30 14:08:07
 * @LastEditors: gongxi33
 * @Description:
 * @FilePath: /bio/src/app.js
 */
import { Component } from 'react'
import './app.scss'

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 是将要会渲染的页面
  render () {
    return this.props.children
  }
}

export default App
