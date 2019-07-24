import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import coverPic from '../../static/cover.jpg'
import shahee from '../../static/shahe.png'
import benbuu from '../../static/xituc.png'
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
        key:"nearastMarkerSrc",
        data:res.tempFilePath
      })
    })
    Taro.downloadFile({
      url:'https://dmsh.bupt.edu.cn/files/simplePlace.png'
    }).then((res) => {
      console.log(res)
      Taro.setStorage({ 
        key:"normalMarkerSrc",
        data:res.tempFilePath
      })
    })
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
        <Image src={benbuu} className='xituc' onClick={this.shahe}></Image>
        <Image src={shahee} className='shahe' onClick={this.benbu}></Image>
      </View>
    )
  }
}
