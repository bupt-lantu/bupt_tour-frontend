import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Audio, ScrollView } from '@tarojs/components'
import navigationImage from '../../static/navigationImage.png'
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
    if (this.audioPlaying) {
      this.descAudioContext.pause()
      this.audioPlaying = false
    } else {
      this.descAudioContext.play()
      this.audioPlaying = true
    }
  }

  componentWillMount() {
    let id = this.$router.params.id
    Taro.request({
      url: 'http://139.199.26.178:8000/v1/place/' + id,
      header: {
        'accept': 'application/json'
      },
      method: 'GET'
    })
      .then((res) => {
        console.log(res)
        //  console.log(res.data.Picture)
        this.setState({
          longitude:res.data.Longitude,
          latitude:res.data.Latitude,
          placePicSource: res.data.Picture,
          placeTitle: res.data.Title,
          // placeDiscription: res.data.Desc,
          placeDiscription: "这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述这是一个描述",
          placeSound: 'http://pr18vapfw.bkt.clouddn.com/' + res.data.Id + '.mp3',
        })
      })
  }

  componentDidMount() {
    this.descAudioContext = wx.createAudioContext('descPlayer')
    this.descAudioContext.src = this.state.placeSound
    this.audioPlaying = false
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  navigate() {
    let params = {
      type: 'gcj02',
      latitude: 40.159113,
      longitude: 116.288179,
      name: "test",
      address: "detail"
    }
    params.latitude = this.state.latitude
    params.longitude = this.state.longitude
    params.name = this.state.Title

    Taro.openLocation(params).then((res) => {

    })
  }
  render() {
    return (
      <View>
        <Image className="placePicture" src={placePicSource} />
        <View className="titleGroup">
          <View className="title">{placeTitle}</View>
          <Image src={navigationImage} className='navImage' onClick={this.navigate}></Image>
        </View>
        <View className="detail">
          <View className="palyerCountainer">
            <Audio
              id="descPlayer"
              className="player"
              src={placeSound}
              controls={true}
              name={placeTitle}
              author="SZH233"
              poster={placePicSource}
              onClick={this.changeDiscAudioState}
              className="soundPlayer"
            />
          </View>
          <ScrollView scrollY className="placeDiscription">
            <View >{placeDiscription}</View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
