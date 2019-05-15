import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Audio} from '@tarojs/components'

export default class detailPage extends Component {

  state = {
    placePicSource: "",
    placeTitle: "",
    placeDiscription: ""
  }
 
  config = {
    navigationBarTitleText: '地点',
    disableScroll: true
  }

  componentWillMount () {
    console.log('OK');
    let id = this.$router.params.id
    console.log(id)
    Taro.request({
        url: 'http://139.199.26.178:8000/v1/place/'+id,
        header: {
            'accept': 'application/json'
          },
        method: 'GET'
      })
       .then((res)=>{
           console.log(res)
          //  console.log(res.data.Picture)
           this.setState({
            placeSound: res.data.Video,
            placePicSource: res.data.Picture,
            placeTitle: res.data.Title,
            placeDiscription: res.data.Desc,
           })
       })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
        <Image className="placePicture" src={placePicSource}/>
        <View className="titleGroup">
          {/* <Audio className="player" src={placeSound}/> */}
          <View className="title">{placeTitle}</View>
        </View>
        <View className="placeDiscription">{placeDiscription}</View>
      </View>
    )
  }
}
