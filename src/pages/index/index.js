import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import coverPic from '../../static/coverShaHe.jpg'
export default class detailPage extends Component {

  state = { }

  config = { }

  changeDiscAudioState() { }

  componentWillMount() { 
    Taro.downloadFile({
      url:'https://dmsh.bupt.edu.cn/files/ZR0fBj.png'
    }).then((res) => {
      console.log(res)
      Taro.setStorage({
        key:"iconPath",
        data:res.tempFilePath
      })
    })
    // Taro.request({
    //   url: 'https://s2.ax1x.com/2019/07/10/Zgr740.png',
    //   header: {
    //     'accept': 'application/json'
    //   },
    //   method: 'GET'
    // })
  }

  componentDidMount() { }

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
        <Image src={coverPic} className='coverPic'/>
        <View className='buttonContainer'>
          <View className='visitButton' onClick={this.benbu}>参观沙河校区</View>
          <View className='visitButton' onClick={this.shahe}>参观西土城校区</View>            
        </View>
      </View>
    )
  }
}
