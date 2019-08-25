import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Audio } from '@tarojs/components'
import navigationImage from '../../static/navigationImage.png'

export default class detailPage extends Component {

  state = {
    topImageHeight: 40,
    bottomHeight: 300,
    placePicSource: "",
    placeTitle: "",
    placeDiscription: "",
    placeSound: ""
  }

  config = {
    navigationBarTitleText: '地点',
    disableScroll: false,
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
    Taro.getSystemInfo().then((res) => {
      let topImageHeight = res.windowWidth * 66.7 / res.windowHeight
      console.log(topImageHeight)
      let bottomHeight = 90 - topImageHeight
      this.setState({
        bottomHeight: bottomHeight,
        topImageHeight: topImageHeight
      })
    })
    let id = this.$router.params.id
    var url = ''
    Taro.getStorage({ key: 'campus' }).then((res) => {
      console.log(123412412, res)
      if (res.data == 1) {
        url = 'https://dmsh.bupt.edu.cn/xituc_v1/place/'
      }
      else {
        url = 'https://dmsh.bupt.edu.cn/shahe_v1/place/'
      }
    }).then(() => {
      console.log(1232131312)
      console.log(url)
      Taro.request({
        url: url + id,
        header: {
          'accept': 'application/json'
        },
        method: 'GET'
      }).then((res) => {
        console.log(res)
        this.setState({
          longitude: res.data.Longitude,
          latitude: res.data.Latitude,
          placePicSource: 'https://dmsh.bupt.edu.cn/files/' + res.data.Picture,
          placeTitle: res.data.Title,
          placeDiscription: res.data.Desc,
          // placeDiscription: "asjdkhlflkjashdljfhajkasjdkhlflkjashdljfhajkshdnfkjashdjkfcjzHBKxgLAAIDGUKAJEwfglIWOIEFHpasjdkhlflkjashdljfhajkshdnfkjashdjkfcjzHBKxgLAAIDGUKAJEwfglIWOIEFHpasjdkhlflkjashdljfhajkshdnfkjashdjkfcjzHBKxgLAAIDGUKAJEwfglIWOIEFHpshdnfkjashdjkfcjzHBKxgLAAIDGUKAJEwfglIWOIEFHp  ",
          placeSound: 'https://dmsh.bupt.edu.cn/files/' + res.data.Video,
        }, () => {
          this.descAudioContext = wx.createAudioContext('descPlayer')
          this.descAudioContext.src = this.state.placeSound
          this.audioPlaying = false
        })
      })
    })

  }

  componentDidMount() {

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

    Taro.openLocation(params)
  }
  render() {
    return (
      <View >
        <View className="page">
          <Image className="placePicture" src={placePicSource} style={"height:" + topImageHeight + "vh"} />
          <View className="titleGroup">
            <View className="title">{placeTitle}</View>
            <Image src={navigationImage} className='navImage' onClick={this.navigate}></Image>
          </View>
          <View className="detail" style={"height:" + bottomHeight + "vh"}>
            <View className="palyerCountainer" >
              <Audio
                id="descPlayer"
                className="player"
                src={placeSound}
                controls={true}
                name={placeTitle}
                author=' '
                poster={placePicSource}
                onClick={this.changeDiscAudioState}
                className="soundPlayer"
              />
            </View>

            <View className="placeDiscription" >
              
                {placeDiscription}
      
            </View>
          </View>
        </View>
      </View>
    )
  }
}
