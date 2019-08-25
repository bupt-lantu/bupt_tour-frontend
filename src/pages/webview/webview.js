import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import coverPic from '../../static/cover.png'
import shahee from '../../static/shahe.png'
export default class detailPage extends Component {

  state = {}



  changeDiscAudioState() { }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showShareMenu({
      withShareTicket: true
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }



  render() {
    return (
      <View >
          <web-view src="https://dmsh.bupt.edu.cn/vr/"></web-view>
          {/* <web-view src="https://www.baidu.com"></web-view> */}
        </View>
    )
  }
}
