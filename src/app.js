import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/mapPage/mapPage',
      
      'pages/detailPage/detailPage',
      
      
      
      'pages/webview/webview',
      
    ],
    requiredBackgroundModes: ['audio'],
    window: {
      backgroundColor:"#1564b8",
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1564B8',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
    },
    permission: {
      'scope.userLocation': {
        desc: '请求地理信息'
      },
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
