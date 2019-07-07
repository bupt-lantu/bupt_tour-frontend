import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Block, Button } from '@tarojs/components'
import './mapPage.scss';
import shouqi from '../../static/shouqi.png'
import dakai from '../../static/dakai.png'
import navigationImage from '../../static/navigationImage.png'
export default class mapPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tests: "green",
      toView: "place26",
      windowHeight: "667",
      bottomHeight: 300,
      menuHeight: 0,
      topHeight: 337,
      allPlace: [],
      curTypeId: 2,  //the current selected place type
      detailDisplay: 1, //the detail for a type of place should be displayed or not
      placeNum: 0,  //the number of curType of place
      curTypePlaces: [], //an array of the selected place
      placeTypes: [], //an array of all types {id: , type: }
      places: new Map(),//key: id, value: array of places
      placeMarkers: [],
      curDescrPlaceId: -1,
      latitude: 40.159113,
      longitude: 116.288179,
      animationData: {},
      close: false,
      entryId: 100000,
      topBarheight:400,
    }
  }

  config = {
    navigationBarTitleText: '大美沙河',
    disableScroll: true
  }

  setCurTypePlaces() {
    //把下方列表需要渲染的部分装入curTypePlaces[]

    this.setState({ curTypePlaces: this.state.places.get(this.state.curTypeId) }, () => {
      let tempMarkers = []
      for (let mk in this.state.curTypePlaces) {
        tempMarkers.push({
          Id: this.state.curTypePlaces[mk].Id,
          id: mk,
          iconPath: this.state.curTypePlaces[mk].Id == this.state.curDescrPlaceId ? this.nearastMarkerSrc : this.normalMarkerSrc,
          latitude: this.state.curTypePlaces[mk].Latitude,
          longitude: this.state.curTypePlaces[mk].Longitude,
          width: "32.5px",
          height: "37px"
        })
      }
      this.setState({ placeMarkers: tempMarkers }, () => { console.log(this.state.placeMarkers) })
      this.setState({ placeNum: this.state.curTypePlaces.length })
    })
  }


  placeTypeSelect(e) {
    console.log(this.state.allPlace)
    console.log(e)
    this.setState({
      curTypeId: parseInt(e.currentTarget.id),
      entryId:10000
    }, () => { this.setCurTypePlaces() })
  }

  displayRev() {
    var temp = this.state.detailDisplay;
    temp = (temp + 1) % 2;
    this.setState({
      detailDisplay: temp
    })
  }

  describePlaceNearBy() {
    wx.getLocation({
      type: 'gcj02', success: (loc) => {
        Taro.request({
          url: 'http://139.199.26.178:8000/v1/place/match',
          header: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            longitude: loc.longitude,
            latitude: loc.latitude
          },
          method: 'POST'
        })
          .then(res => {
            if (res.data.Id != this.state.curDescrPlaceId) {
              if (Math.abs(res.data.Longitude - loc.longitude) <= 0.0025 && Math.abs(res.data.Latitude - loc.latitude) <= 0.0025) {
                let tempMarkers = this.state.placeMarkers
                for (let marker of tempMarkers) {
                  if (this.state.curTypePlaces[marker.id].Id == this.state.curDescrPlaceId) {
                    marker.iconPath = this.normalMarkerSrc
                    marker.width = "32.5px"
                    marker.height = "37px"
                  }
                  else if (this.state.curTypePlaces[marker.id].Id == res.data.Id) {
                    marker.iconPath = this.nearastMarkerSrc
                    marker.width = "35px"
                    marker.height = "40px"
                  }
                }
                this.setState({
                  curDescrPlaceId: res.data.Id,
                  placeMarkers: tempMarkers
                })
                Taro.getBackgroundAudioManager().title = res.data.Title
                Taro.getBackgroundAudioManager().src = res.data.Video
                Taro.getBackgroundAudioManager().play()
              }
              else {
                this.changeMarker(this.state.curDescrPlaceId, this.normalMarkerSrc)
                this.setState({ curDescrPlaceId: -1 })
              }
            }
          })
      }
    })
  }

  componentWillMount() {

    this.normalMarkerSrc = 'https://s2.ax1x.com/2019/07/04/ZUHKd1.png'
    this.nearastMarkerSrc = 'https://s2.ax1x.com/2019/07/04/ZUOvHH.png'
    Taro.request({
      url: 'http://139.199.26.178:8000/v1/place/',
      method: 'GET'
    }).then(res => {
      this.setState({
        allPlace: res.data
      })
    });

    Taro.request({
      url: 'http://139.199.26.178:8000/v1/placetype/',
      header: {
        'accept': 'application/json'
      },
      method: 'GET'
    })
      .then(res => {
        let tPlaceTypes = []
        let tPlaces = new Map();
        for (let tp of res.data) {
          if (tp.hasOwnProperty('Places')) {
            tPlaceTypes.push({ id: tp.Id, type: tp.Type })
            tPlaces.set(tp.Id, tp.Places)
          }
        }
        this.setState({ 
          curTypeId: tPlaceTypes[0].id,
          menuHeight: 6 + res.data.length * 7,
        }) //
        this.setState({ placeTypes: tPlaceTypes }, () => { console.log(this.state.placeTypes) }) //place name and id
        this.setState({ places: tPlaces }, () => {
          console.log(this.state.places);
          this.setCurTypePlaces();
        }) //place detail in index 
      })
    this.mpContext = wx.createMapContext('map')
  }

  componentDidMount() {
    Taro.getSystemInfo().then((res) => {
      console.log(res)
      let topheight = res.windowHeight * 0.6 
      let topBarheight = topheight-35
      if(res.model.search('iPhone X') == -1) {
        var bottomheight = res.windowHeight *0.4 -47
      }
      else {
        var bottomheight = res.windowHeight *0.4 -133
      }
      
      console.log(topheight,bottomheight)
      this.setState({
        topBarheight:topBarheight,
        windowHeight: res.windowHeight,
        topHeight: topheight,
        bottomHeight: bottomheight
      }, () => { console.log(this.state.topHeight, this.state.bottomHeight) })
    })
    wx.getLocation({ success: this.showLocation.bind(this) })
    this.mpContext.moveToLocation()
    this.descIntervalId = setInterval(this.describePlaceNearBy.bind(this), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.descIntervalId)
  }
  componentDidShow() {

  }

  componentDidHide() { }

  showLocation(loc) {
    console.log(loc)
  }

  jumpToDetail(e)// call this method when select a place from the list to show details
  {
    console.log(e)
    Taro.navigateTo({
      url: '/pages/detailPage/detailPage?id=' + parseInt(e.currentTarget.id.substr(5))
    })
  }

  changeMarker(id, src) {
    let tempmarkers = this.state.placeMarkers;
    for (let marker of tempmarkers) {
      if (this.state.curTypePlaces[marker.id].Id == id) {

        marker.iconPath = src
        break
      }
    }
    this.setState({ placeMarkers: tempmarkers })
  }

  //地图导航界面
  onMarkSelected(e) {
    this.setState({
      toView: "place" + this.state.placeMarkers[e.detail["markerId"]].Id,
      entryId: e.detail["markerId"],
    })
  }

  navigate(e) {
    let params = {
      type: 'gcj02',
      latitude: 40.159113,
      longitude: 116.288179,
      name: "test",
      address: "detail"
    }
    let place = this.state.curTypePlaces[e]
    params.latitude = place.Latitude
    params.longitude = place.Longitude
    params.name = place.Title

    Taro.openLocation(params).then((res) => {

    })
  }

  Bar() {
    console.log("click")
    var animation = Taro.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease-in",
      delay: 0
    })
    if (this.state.close) {
      animation.translate(0, 0).step();
    }
    else {
      animation.translate(-200, 0).step();
    }

    this.setState({
      animationData: animation.export(),
      close: !this.state.close
    })

  }

  render() {
    return (

      <View>
        <View className="top">

          <Map className="Map" latitude={latitude} longitude={longitude} id='map' show-location markers={this.state.placeMarkers} onmarkertap={this.onMarkSelected} style={"height:" + topHeight + "px"} >
          {/* <CoverView className="campusSelect" animation={animationData} ></CoverView> */}
            <CoverView className="campusDetail" onClick={this.Bar} style={{margin:"2.5vh",borderTopLeftRadius:'0',borderTopRightRadius:'0',borderBottomLeftRadius:this.state.close ? '0' : '0',borderBottomRightRadius:this.state.close ? '0' : '0'}} >
             沙河校区{this.state.close ? ' >' :' <'}
             
              {/* {this.state.close
                ? <CoverImage src={dakai} className="shouqi"></CoverImage>
                : <CoverImage src={shouqi} className="shouqi"></CoverImage>
              } */}
            </CoverView>
            
            <CoverView className="topBar" style={"height:"+menuHeight+"vh;margin:2.5vh;box-shadow: 0 5rpx 7rpx 0 rgba(0, 0, 0, 0.1), 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.06);"} animation={animationData}>
              <CoverView className="placeSelect" style={"height:52vh"} >
                <CoverView className="placeTypes">
                  {this.state.placeTypes.map((type,index) => {
                    return (
                      <CoverView className="notSelectedPlaceTitle" id={type.id + "type"} onClick={this.placeTypeSelect} key={type}>{type.type}</CoverView>
                    )
                  })}
                </CoverView>

              </CoverView>
            </CoverView>
          </Map>
        </View>
        {/* <View className="displaySelect" onClick={this.displayRev} style={"margin-top:" + topHeight + "px"}>共有{this.state.placeNum}个 </View> */}
        <ScrollView scrollIntoView={toView} scrollWithAnimation="true" scrollY="true" style={{position:"fixed",height:'40vh',bottom:0,borderTop:"solid 2rpx lightgray"}}>
          {this.state.curTypePlaces.map((detail, index) => {
            return (
              <View className={this.state.entryId == index ? "detailGroupActive" : "detailGroup"} >
                <View className="placePicHolder" id={"place" + detail.Id} onClick={this.jumpToDetail}>
                  <Image className="placePic" src={detail.Picture} />
                  <View className="placeTitle" >{detail.Title}</View>
                </View>
                
                <Image className="navigationImage" src={navigationImage} onClick={this.navigate.bind(this, index)}></Image>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}
