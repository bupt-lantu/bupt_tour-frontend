import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Block, Button } from '@tarojs/components'
import './mapPage.scss';
import shouqi from '../../static/shouqi.png'
import dakai from '../../static/dakai.png'

export default class mapPage extends Component {

  constructor(props){
    super(props)
    this.state = { 
      tests:"green",
      toView:"place26",
      windowHeight:"667",
      bottomHeight:300,
      topHeight:337,
      allPlace:[],
      curTypeId: 2,  //the current selected place type
      detailDisplay: 1, //the detail for a type of place should be displayed or not
      placeNum: 0,  //the number of curType of place
      curTypePlaces: [], //an array of the selected place
      placeTypes: [], //an array of all types {id: , type: }
      places: new Map(),//key: id, value: array of places
      placeMarkers: [],
      curDescrPlaceId: -1,
      latitude: 40.159113,
      longitude:116.288179
    }
  }

  config = {
    navigationBarTitleText: '大美沙河',
    disableScroll: true
  }

  setCurTypePlaces() {
    //把下方列表需要渲染的部分装入curTypePlaces[]

    this.setState({curTypePlaces: this.state.places.get(this.state.curTypeId)},()=>{
      let tempMarkers = []
      for(let mk in this.state.curTypePlaces){
        tempMarkers.push({
          Id:this.state.curTypePlaces[mk].Id,
          id: mk,
          iconPath: this.state.curTypePlaces[mk].Id==this.state.curDescrPlaceId ? this.nearastMarkerSrc : this.normalMarkerSrc,
          latitude: this.state.curTypePlaces[mk].Latitude,
          longitude: this.state.curTypePlaces[mk].Longitude,
          width:"32.5px",
          height:"37px"
        })
      }
      this.setState({placeMarkers: tempMarkers},()=>{console.log(this.state.placeMarkers)})
      this.setState({placeNum: this.state.curTypePlaces.length})
    })
  }


  placeTypeSelect(e) {
    this.setState({curTypeId: parseInt(e.currentTarget.id)},()=>{this.setCurTypePlaces()})
  }

  displayRev() {
    var temp = this.state.detailDisplay;
    temp = (temp + 1) % 2;
    this.setState({
      detailDisplay: temp
    })
  }

  describePlaceNearBy()
  {
    wx.getLocation({type: 'gcj02', success: (loc)=>{
      Taro.request({
        url: 'http://139.199.26.178:8000/v1/place/match',
        header: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          longitude : loc.longitude,
          latitude : loc.latitude
        },
        method: 'POST'
      })
        .then(res=>{
          if(res.data.Id != this.state.curDescrPlaceId)
          {
            if(Math.abs(res.data.Longitude-loc.longitude)<=0.0025 && Math.abs(res.data.Latitude-loc.latitude)<=0.0025)
            {
              let tempMarkers = this.state.placeMarkers
              console.log(123,tempMarkers)
              for(let marker of tempMarkers) {
                if(this.state.curTypePlaces[marker.id].Id == this.state.curDescrPlaceId) {
                  marker.iconPath = this.normalMarkerSrc
                  marker.width = "32.5px"
                  marker.height = "35px"
                }
                else if(this.state.curTypePlaces[marker.id].Id == res.data.Id) {
                  marker.iconPath = this.nearastMarkerSrc
                  marker.width = "35px"
                  marker.height = "37.5px"
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
            else
            {
              this.changeMarker(this.state.curDescrPlaceId,this.normalMarkerSrc)
              this.setState({curDescrPlaceId: -1})
            }
          }
        })
    }})
  }

  componentWillMount () {

      this.normalMarkerSrc = 'https://s2.ax1x.com/2019/07/04/ZUHKd1.png'
      this.nearastMarkerSrc = 'https://s2.ax1x.com/2019/07/04/ZUOvHH.png'
      Taro.request({
        url: 'http://139.199.26.178:8000/v1/place/',
        method: 'GET'
      }).then(res =>  {
        this.setState({
          allPlace:res.data
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
                if(tp.hasOwnProperty('Places')){
                    tPlaceTypes.push({id: tp.Id, type: tp.Type})
                    tPlaces.set(tp.Id,tp.Places)
                }
            }
            this.setState({curTypeId: tPlaceTypes[0].id}) //
            this.setState({placeTypes: tPlaceTypes},()=>{console.log(this.state.placeTypes)}) //place name and id
            this.setState({places: tPlaces},()=>{
              console.log(this.state.places);
              this.setCurTypePlaces();
            }) //place detail in index 
        })
        this.mpContext = wx.createMapContext('map')
    }

  componentDidMount () {
    Taro.getSystemInfo().then((res) => {
      console.log(res)
      let topheight = res.windowHeight * 0.6
      let bottomheight = res.windowHeight * 0.4 - 35
      this.setState({
       windowHeight:res.windowHeight,
       topHeight:topheight,
       bottomHeight:bottomheight
      },()=>{console.log(this.state.topHeight,this.state.bottomHeight)})
    })
    wx.getLocation({success: this.showLocation.bind(this)})
    this.mpContext.moveToLocation()
    this.descIntervalId = setInterval(this.describePlaceNearBy.bind(this),5000)
  }

  componentWillUnmount () { 
    clearInterval(this.descIntervalId)
  }

  componentDidShow () {
    
  }

  componentDidHide () { }

  showLocation(loc) { 
    console.log(loc)
  }

  jumpToDetail(e)// call this method when select a place from the list to show details
  {
    Taro.navigateTo({
      url: '/pages/detailPage/detailPage?id='+parseInt(e.currentTarget.id)
    })
  }

  changeMarker(id,src){
    let tempmarkers = this.state.placeMarkers;
    for(let marker of tempmarkers){
      if(this.state.curTypePlaces[marker.id].Id==id){

        marker.iconPath = src
        break
      }
    }
    this.setState({placeMarkers: tempmarkers})
  }

  //地图导航界面
  onMarkSelected(e){
    console.log("this.state.curTypePlaces",this.state.curTypePlaces)
    console.log("event",e.detail["markerId"])
    console.log("markers:",this.state.placeMarkers)
    console.log("dshfksahkshk")
    console.log("e.detail[markerId]:"+e.detail["markerId"])
    console.log("id:"+this.state.placeMarkers[e.detail["markerId"]].Id)
    this.setState({
      toView:"place"+this.state.placeMarkers[e.detail["markerId"]].Id
    },()=>{console.log(this.state.toView)})
    // let params = {
    //   type:'gcj02',
    //   latitude: 40.159113,
    //   longitude:116.288179,
    //   name:"test",
    //   address:"detail"
    // }
    // for(let place of this.state.allPlace) {
    //   if(place.Id == e.detail.markerId) {
    //     params.latitude = place.latitude
    //     params.longitude = place.longitude
    //     params.name = place.name
    //     break
    //   }
    // }
    // Taro.openLocation(params).then((res) => {

    // })
  }
  test() {
    this.setState({
      tests:"yellow"
    })
    console.log(this.state.tests)
  }
  render () {
    return (

      <View>
        <View className="top">
          <CoverView className="topBar" style={"height:"+topHeight+"px"}>
            <CoverView className="campusSelect">
              <CoverView className="campusDetail">
                <CoverView>沙河校区</CoverView>
                <CoverImage src={shouqi} className="shouqi"></CoverImage>  
              </CoverView>
            </CoverView>
            <CoverView className="placeSelect"style={"height:"+topHeight+"px"}>
              <ScrollView scrollY="true" >
                <CoverView className="placeTypes">
                  {this.state.placeTypes.map(type => {
                    return(
                      <CoverView className="notSelectedPlaceTitle" id={type.id+"type"} onClick={this.placeTypeSelect} key="type">{type.type}</View>
                    )
                  })}
                </CoverView>
              </ScrollView>         
            </CoverView>
          </CoverView>
          <Map className="Map" latitude={latitude} longitude={longitude} id='map' show-location markers={this.state.placeMarkers} onmarkertap={this.onMarkSelected} style={"height:"+topHeight+"px"} />
        </View>
        <View className="displaySelect" onClick={this.displayRev}>共有{this.state.placeNum}个 </View>
            <ScrollView scrollIntoView={toView} scrollY="true" style={"height:"+bottomHeight+"px"}>
                {this.state.curTypePlaces.map(detail => {
                      return(
                        <View className="detailGroup" id={"place"+detail.Id} onClick={this.jumpToDetail}>
                          <View className="placePicHolder">
                            <Image className="placePic" src={detail.Picture}/>
                          </View>
                          <View className="placeTitle">{detail.Title}</View>
                        </View>
                      )
                    })}
            </ScrollView>  
        </View>
    )
  }
}
