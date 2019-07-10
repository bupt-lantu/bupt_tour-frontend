import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import coverPic from '../../static/cover.jpg'
export default class detailPage extends Component {

  state = { }

  config = { }

  changeDiscAudioState() { }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  shahe() {
    Taro.navigateTo({
        url: '/pages/mapPage/mapPage?id=2'
      })
  }

  benbu() {
    Taro.navigateTo({
        url: '/pages/mapPage/mapPage?id=1'
      })
  }

  render() {
    return (
      <View >
        <Image src={coverPic} className='coverPic'/>
        <View className='buttonContainer'>
            <View className='visitButton' onClick={this.shahe}>参观沙河校区</View>
            <View className='visitButton' onClick={this.benbu}>参观西土城校区</View>
        </View>
      </View>
    )
  }
}
