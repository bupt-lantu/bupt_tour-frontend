import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import coverPic from '../../static/cover.png'
import shahee from '../../static/shahe.png'
export default class detailPage extends Component {

  state = {}

  config = {}

  changeDiscAudioState() { }

  componentWillMount() {
    Taro.downloadFile({
      url: 'https://dmsh.bupt.edu.cn/files/ZR0fBj.png'
    }).then((res) => {
      console.log(res)
      Taro.setStorage({
        key: "nearastMarkerSrc",
        data: res.tempFilePath
      })
    })
    Taro.downloadFile({
      url: 'https://dmsh.bupt.edu.cn/files/simplePlace.png'
    }).then((res) => {
      console.log(res)
      Taro.setStorage({
        key: "normalMarkerSrc",
        data: res.tempFilePath
      })
    })
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
          <web-view src="https://mp.weixin.qq.com/"></web-view>
        </View>
    )
  }
}
