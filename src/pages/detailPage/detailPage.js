import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Audio} from '@tarojs/components'

export default class detailPage extends Component {

  state = {
    placePicSource: "",
    placeTitle: "",
    placeDiscription: "",
    placeSound: ""
  }
 
  config = {
    navigationBarTitleText: '地点',
    disableScroll: true
  }

  changeDiscAudioState() {
    if(this.audioPlaying){
      this.descAudioContext.pause()
      this.audioPlaying = false
    }else{
      this.descAudioContext.play()
      this.audioPlaying = true
    }
  }

  componentWillMount () {
    let id = this.$router.params.id
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
            placePicSource: res.data.Picture,
            placeTitle: res.data.Title,
            placeDiscription: res.data.Desc,
            placeSound: 'http://pr18vapfw.bkt.clouddn.com/'+res.data.Id+'.mp3',
           })
       })
  }

  componentDidMount () { 
    this.descAudioContext = wx.createAudioContext('descPlayer')
    this.descAudioContext.src = this.state.placeSound
    this.audioPlaying = false
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
        <Image className="placePicture" src={placePicSource}/>
        <View className="titleGroup">
          <View className="title">{placeTitle}</View>
        </View>
        <View className="detail">
          <View>
            <Audio
              id = "descPlayer" 
              //className="player" 
              src={placeSound} 
              controls={true}
              name = {placeTitle}
              author = "SZH233" 
              poster = {placePicSource}
              onClick={this.changeDiscAudioState} 
            />
          </View>
          <View className="placeDiscription">{placeDiscription}</View>
        </View>
      </View>
    )
  }
}
