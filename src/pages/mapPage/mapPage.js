import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Block, Button, CoverImage } from '@tarojs/components'
import './mapPage.scss';
import xiala from '../../static/xiala.png'
import triangleWhite from '../../static/triangleWhite.png'
import navigationImage from '../../static/navigationImage.png'
import functionSelect from '../../static/functionSelect.png'
import vrImage from '../../static/vr.png'
export default class mapPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      functionClose: false,
      menuHeight: 10,
      open: false,
      shaheCampus: true,
      toView: "place26",
      windowHeight: "667",
      bottomHeight: 300,
      topHeight: 337,
      benbucurTypeId: 2,
      shahecurTypeId: 2,
      curTypeId: 2,  //the current selected place type
      detailDisplay: 1, //the detail for a type of place should be displayed or not
      placeNum: 0,  //the number of curType of place
      curTypePlaces: [], //an array of the selected place
      shaheplaceTypes: [], //an array of all types {id: , type: }
      benbuplaceTypes: [],
      placeTypes: [],
      shaheplaces: new Map(),//key: id, value: array of places
      benbuplaces: new Map(),
      places: new Map(),
      placeMarkers: [],
      curDescrPlaceId: -1,
      shahelatitude: 40.159113,
      shahelongitude: 116.288179,
      benbulatitude: 39.961370,
      benbulongitude: 116.35826,
      latitude: 40.159113,
      longitude: 116.288179,
      entryId: 100000,
      topBarheight: 400,
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
      // this.setState({ placeNum: this.state.curTypePlaces.length })
    })
  }


  placeTypeSelect(e) {
    this.setState({
      curTypeId: parseInt(e.currentTarget.id),
      entryId: 10000
    }, () => {
      this.setCurTypePlaces()
      console.log(this.state.curTypeId)
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
                    marker.width = "40px"
                    marker.height = "50px"
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

    this.normalMarkerSrc = 'https://s2.ax1x.com/2019/07/10/Zgr740.png'
    this.nearastMarkerSrc = 'https://s2.ax1x.com/2019/07/10/Zgr740.png'

    //沙河校区后台
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
          shahecurTypeId: tPlaceTypes[0].id,
          menuHeight: 7 + res.data.length * 7,
          shaheplaceTypes: tPlaceTypes,
          shaheplaces: tPlaces
        }) //place detail in index 
      })

    //本部校区后台
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
            if (tp.Id == 4) break;
            tPlaceTypes.push({ id: tp.Id, type: tp.Type })
            tPlaces.set(tp.Id, tp.Places)
          }
        }
        this.setState({
          benbucurTypeId: tPlaceTypes[0].id,
          benbuplaceTypes: tPlaceTypes,
          benbuplaces: tPlaces
        }) //place detail in index 
      })



    this.mpContext = wx.createMapContext('map')
  }

  //1为本部，2为沙河
  changeCampus(flag) {
    if (flag == 1) {
      this.setState({
        latitude: this.state.benbulatitude,
        longitude: this.state.benbulongitude,
        curTypeId: this.state.benbucurTypeId,
        places: this.state.benbuplaces,
        placeTypes: this.state.benbuplaceTypes
      }, () => {
        this.setCurTypePlaces()
      })
    }
    else {
      this.setState({
        latitude: this.state.shahelatitude,
        longitude: this.state.shahelongitude,
        curTypeId: this.state.shahecurTypeId,
        places: this.state.shaheplaces,
        placeTypes: this.state.shaheplaceTypes,
      }, () => {
        this.setCurTypePlaces()
      })
    }
  }

  componentDidMount() {
    Taro.getSystemInfo().then((res) => {
      console.log(res)
      let topheight = res.windowHeight * 0.6
      let topBarheight = topheight - 35
      if (res.model.search('iPhone X') == -1) {
        var bottomheight = res.windowHeight * 0.4 - 47
      }
      else {
        var bottomheight = res.windowHeight * 0.4 - 133
      }

      console.log(topheight, bottomheight)
      this.setState({
        topBarheight: topBarheight,
        windowHeight: res.windowHeight,
        topHeight: topheight,
        bottomHeight: bottomheight
      }, () => { console.log(this.state.topHeight, this.state.bottomHeight) })
    })
    // Taro.getLocation({ type: "gcj02" }).then(res => {
    //   if ((Math.pow(Math.abs(res.latitude - this.state.shahelatitude), 2) + Math.pow(Math.abs(res.longitude - this.state.benbulongitude), 2)) > (Math.pow(Math.abs(res.latitude - this.state.benbulatitude), 2) + Math.pow(Math.abs(res.longitude - this.state.benbulongitude), 2))) {
    //     this.changeCampus(1)
    //   }
    //   else {
    //     this.changeCampus(2)
    //   }
    // })
    let id = this.$router.params.id
    id = 1
    if (id == 1) {
      this.changeCampus(1)
      this.setState({
        shaheCampus: false
      })
    }
    else {
      this.changeCampus(2)
      this.setState({
        shaheCampus: true
      })
    }
    // this.mpContext.moveToLocation()
    this.descIntervalId = setInterval(this.describePlaceNearBy.bind(this), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.descIntervalId)
  }
  componentDidShow() { }

  componentDidHide() { }

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
    console.log(e)
    console.log(e["markerId"])
    console.log(this.state.placeMarkers)
    this.setState({
      toView: "place" + this.state.placeMarkers[e["markerId"]].Id,
      entryId: e["markerId"],
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
    Taro.openLocation(params)
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

  spreadOut() {
    this.setState({
      open: !this.state.open
    }, () => {
      console.log(this.state.shaheCampus)
    })
  }

  topCampusSelect() {
    this.setState({
      open: false
    })
  }

  bottomCampusSelect() {
    this.setState({
      open: false,
      shaheCampus: !this.state.shaheCampus
    }, () => {
      if (this.state.shaheCampus) {
        this.changeCampus(2)
      }
      else {
        this.changeCampus(1)
      }
    })


  }

  changeFunctionClose() {
    this.setState({
      functionClose: !this.state.functionClose
    }, () => {
      console.log(this.state.functionClose)
    })
  }
  render() {
    return (

      <View>
        <View className="top">

          <Map className="Map" latitude={latitude} longitude={longitude} id='map' show-location markers={this.state.placeMarkers} onmarkertap={this.onMarkSelected} style={"height:" + topHeight + "px"} >
            {/* 不在这个页面选择校区 */}
            {/* <CoverView className="campusDetail" onClick={this.Bar} >
              <CoverView className='campusContainer'>
                <CoverView className='campusTop'>
                  <CoverView onClick={this.topCampusSelect}>{shaheCampus ? '沙河校区' : '西土城校区'}</CoverView>
                  <CoverImage src={xiala} className='xiala' onClick={this.spreadOut}></CoverImage>
                </CoverView>
                {this.state.open &&
                  <CoverView onClick={this.bottomCampusSelect}>{shaheCampus ? '西土城校区' : '沙河校区'}</CoverView>
                }
              </CoverView>
            </CoverView> */}
            <CoverView className="campusTitle">{shaheCampus ? '沙河校区' : '西土城校区'}</CoverView>


            <CoverView className="rightBar">
              <CoverView className="selectContainer" onClick={this.changeFunctionClose}>
                <CoverImage src={functionSelect} className="functionSelectImage" ></CoverImage>
              </CoverView>
              {functionClose && (<CoverImage src={triangleWhite} className="triangle_white"></CoverImage>)}
              {functionClose &&
                (<CoverView className="placeBar" >
                  {this.state.placeTypes.map(type => {
                    return (
                      <CoverView className={curTypeId == type.id ? "isSelectedPlaceTitle" : "notSelectedPlaceTitle"} id={type.id} onClick={this.placeTypeSelect} key={type}>{type.type}</CoverView>
                    )
                  })}
                </CoverView>)}
            </CoverView>

            {shaheCampus &&
              <CoverImage src={vrImage} className="vrImage"></CoverImage>
            }
          </Map>
        </View>
        {/* <View className="displaySelect" onClick={this.displayRev} style={"margin-top:" + topHeight + "px"}>共有{this.state.placeNum}个 </View> */}
        <ScrollView scrollIntoView={toView} scrollWithAnimation="true" scrollY="true" style={{ position: "fixed", height: '40vh', bottom: 0, borderTop: "solid 2rpx lightgray" }}>
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
