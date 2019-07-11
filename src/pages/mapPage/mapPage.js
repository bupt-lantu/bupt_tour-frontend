import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Block, Button, CoverImage } from '@tarojs/components'
import './mapPage.scss';
// import jiazizhong from '../../static/jiazizhong.png'
import triangleWhite from '../../static/triangleWhite.png'
import navigationImage from '../../static/navigationImage.png'
import functionSelect from '../../static/functionSelect.png'
import vrImage from '../../static/vr.png'
import locate from '../../static/location.png'

export default class mapPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      functionClose: true,
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
          width: "40px",
          height: "40px"
        })
      }
      this.setState({ placeMarkers: tempMarkers })
      // this.setState({ placeNum: this.state.curTypePlaces.length })
    })
  }


  placeTypeSelect(e) {
    this.setState({
      curTypeId: parseInt(e.currentTarget.id),
      entryId: 10000
    }, () => {
      this.setCurTypePlaces()
    })
  }

  describePlaceNearBy() {
    wx.getLocation({
      type: 'gcj02', success: (loc) => {

        console.log(loc)
        var flag = 0
        console.log(this.state.places)
        this.state.places.forEach((item) => {

          //item 为每一个类别
          item.map((data) => {
            //data为每个类别中的每一项
            if (Math.abs(data.Longitude - loc.longitude) <= 0.0011 && Math.abs(data.Latitude - loc.latitude) <= 0.0011) {
              flag = 1
              console.log(this.state.curDescrPlaceId, data.Id)
              if (this.state.curDescrPlaceId != data.Id) {
                console.log(99999999999999999)
                Taro.getBackgroundAudioManager().title = data.Title
                Taro.getBackgroundAudioManager().src = data.Video
                Taro.getBackgroundAudioManager().play()
                var IDs = data.Id
                let tempMarkers = this.state.placeMarkers

                for (let marker of tempMarkers) {
                  if (this.state.curTypePlaces[marker.id].Id == IDs) {
                    console.log(12312312312)
                    marker.iconPath = this.nearastMarkerSrc
                    marker.width = "55px"
                    marker.height = "55px"
                  }
                  else {
                    marker.iconPath = this.normalMarkerSrc
                    marker.width = "40px"
                    marker.height = "40px"
                  }
                }
                this.setState({
                  curDescrPlaceId: IDs,
                  placeMarkers: tempMarkers
                }, () => {
                  console.log(11111111, this.state.curDescrPlaceId)
                })
              }


            }
          })
        })
        if (!flag) {
          this.changeMarker(this.state.curDescrPlaceId, this.normalMarkerSrc)
          this.setState({ curDescrPlaceId: -1 })
        }

        // Taro.request({
        //   url: 'http://139.199.26.178:8000/v1/place/match',
        //   header: {
        //     'accept': 'application/json',
        //     'content-type': 'application/x-www-form-urlencoded'
        //   },
        //   data: {
        //     longitude: loc.longitude,
        //     latitude: loc.latitude
        //   },
        //   method: 'POST'
        // })
        //   .then(res => {


        // })
      }
    })
  }

  componentWillMount() {
    Taro.getStorage({ key: 'iconPath' }).then((res) => {
      this.normalMarkerSrc = res.data
      this.nearastMarkerSrc = res.data
    })
    // this.normalMarkerSrc = 'https://s2.ax1x.com/2019/07/10/Zgr740.png'
    let id = this.$router.params.id
    if (id == 1) {
      //本部校区后台
      Taro.request({
        url: 'http://139.199.26.178:8000/v1/placetype/',
        header: {
          'accept': 'application/json'
        },
        method: 'GET'
      })
        .then(res => {
          this.req2 = true
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
          }, () => {
            this.changeCampus(1)
            this.setState({
              shaheCampus: false
            })
          }) //place detail in index 
        })

    }
    else {
      //沙河校区后台
      Taro.request({
        url: 'http://139.199.26.178:8000/v1/placetype/',
        header: {
          'accept': 'application/json',
          'content-type': 'application/json'

        },
        method: 'GET'
      })
        .then(res => {
          this.req1 = true
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
          }, () => {
            this.changeCampus(2)
            this.setState({
              shaheCampus: true
            })
          }) //place detail in index 
        })
    }
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
  mpContext = null
  componentDidMount() {
    this.mpContext = wx.createMapContext('map')
    console.log(this.mpContext)
    Taro.getSystemInfo().then((res) => {
      let topheight = res.windowHeight * 0.6
      let topBarheight = topheight - 35
      if (res.model.search('iPhone X') == -1) {
        var bottomheight = res.windowHeight * 0.4 - 47
      }
      else {
        var bottomheight = res.windowHeight * 0.4 - 133
      }

      this.setState({
        topBarheight: topBarheight,
        windowHeight: res.windowHeight,
        topHeight: topheight,
        bottomHeight: bottomheight
      })
    })
    // Taro.getLocation({ type: "gcj02" }).then(res => {
    //   if ((Math.pow(Math.abs(res.latitude - this.state.shahelatitude), 2) + Math.pow(Math.abs(res.longitude - this.state.benbulongitude), 2)) > (Math.pow(Math.abs(res.latitude - this.state.benbulatitude), 2) + Math.pow(Math.abs(res.longitude - this.state.benbulongitude), 2))) {
    //     this.changeCampus(1)
    //   }
    //   else {
    //     this.changeCampus(2)
    //   }
    // })

    // this.mpContext.moveToLocation()
    // while(!this.req1 || ! this.req2){
    //   console.log(1);
    //   this.sleep(300)
    // }
    // let id = this.$router.params.id
    // if (id == 1) {
    //   this.changeCampus(1)
    //   this.setState({
    //     shaheCampus: false
    //   })
    // }
    // else {
    //   this.changeCampus(2)
    //   this.setState({
    //     shaheCampus: true
    //   })
    // }
  }
  sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  }
  componentWillUnmount() {
    clearInterval(this.descIntervalId)
  }
  componentDidShow() {
    this.descIntervalId = setInterval(this.describePlaceNearBy.bind(this), 5000)

  }

  componentDidHide() { }

  jumpToDetail(e)// call this method when select a place from the list to show details
  {
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
    })
  }

  backToMyLocation() {
    Taro.getLocation({ type: "gcj02" }).then(res => {
      this.mpContext.moveToLocation()
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
            <CoverView className="locateContainer">
              <CoverImage src={locate} className="locateIcon" onClick={this.backToMyLocation}></CoverImage>
            </CoverView>
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
