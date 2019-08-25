import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import coverPic from '../../static/cover.jpg'
// import shahee from '../../static/shahe.png'
export default class detailPage extends Component {

  state = {}

  config = {
    navigationBarTitleText: '北京邮电大学沙河校区',

  }

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

  shahe() {
    Taro.navigateTo({
      url: '/pages/mapPage/mapPage?id=1'
    })
  }

  benbu() {
    Taro.navigateTo({
      url: '/pages/mapPage/mapPage?id=2'
    })
  }

  render() {
    return (
      <View >
        <Image src={coverPic} onClick={this.benbu} className='coverPic' />
        {/* <Image src={benbuu} className='xituc' onClick={this.shahe}></Image> */}
        {/* <Image src={shahee} className='shahe' onClick={this.benbu}></Image> */}
        {/* <View className="zongheban">沙河校区综合办公室</View>
        <View className="lantu"> 计算机学院蓝图创新协会</View>
        <View className="lianhe"> 联合出品</View> */}
      </View>
    )
  }
}
