import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Block } from '@tarojs/components'
import './mapPage.scss';

export default class mapPage extends Component {

  constructor(props){
    super(props)
    this.state = { 
      curTypeId: 2,  //the current selected place type
      detailDisplay: 1, //the detail for a type of place should be displayed or not
      placeNum: 0,  //the number of curType of place
      curTypePlaces: [], //an array of the selected place
      placeTypes: [], //an array of all types {id: , type: }
      places: new Map(),//key: id, value: array of places
      placeMarkers: [],
      curDescrPlaceId: -1
      /**********PLACE INSTANCE
       *   "Id": 17,
            "Title": "北京邮电大学沙河校区雁北园男生宿舍",
            "Desc": "这是一个描述",
            "Picture": "https://www.bupt.edu.cn/upload/image/201704/10%20%E5%AD%A6%E7%94%9F%E5%AE%BF%E8%88%8D.jpg",
            "Video": "https://dwz.cn/bjnFx8Ed",
            "Longitude": 40.158735,
            "Latitude": 116.28808,
            "PlaceType": {
                "Id": 2,
                "Type": "宿舍楼"
             }
       */
    }
  }

  config = {
    navigationBarTitleText: '地图',
    disableScroll: true
  }

  setCurTypePlaces() {
    //把下方列表需要渲染的部分装入curTypePlaces[]

    this.setState({curTypePlaces: this.state.places.get(this.state.curTypeId)},()=>{
      let tempMarkers = []
      for(let mk in this.state.curTypePlaces){
        tempMarkers.push({
          id: mk,
          iconPath: this.state.curTypePlaces[mk].Id==this.state.curDescrPlaceId ? this.nearastMarkerSrc : this.normalMarkerSrc,
          latitude: this.state.curTypePlaces[mk].Latitude,//+0.062035,//40.22077,//mk.Longitude,
          longitude: this.state.curTypePlaces[mk].Longitude//-0.0568//116.23128//mk.Latitude
        })
      }
      this.setState({placeMarkers: tempMarkers},()=>{console.log(this.state.placeMarkers)})
      this.setState({placeNum: this.state.curTypePlaces.length})
      console.log(this.state.curTypePlaces)})
  }


  placeTypeSelect(e) {
    this.setState({curTypeId: parseInt(e.currentTarget.id)},()=>{this.setCurTypePlaces()})
  }

  displayRev() {
    //reverse this.state.detailDisplay
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
          //console.log(res.data)
          if(res.data.Id != this.state.curDescrPlaceId)
          {
            console.log("NEWPLACE",loc.longitude,loc.latitude)
            if(Math.abs(res.data.Longitude-loc.longitude)<=0.0025 && Math.abs(res.data.Latitude-loc.latitude)<=0.0025)
            {
              console.log(res.data)
              this.changeMarker(this.curDescrPlaceId,this.normalMarkerSrc)
              this.setState({curDescrPlaceId: res.data.Id})
              Taro.getBackgroundAudioManager().title = res.data.Title
              Taro.getBackgroundAudioManager().src = 'http://pr18vapfw.bkt.clouddn.com/'+res.data.Id+'.mp3'
              Taro.getBackgroundAudioManager().play()
              this.changeMarker(res.data.Id,this.nearastMarkerSrc)
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
      this.normalMarkerSrc = 'https://i.loli.net/2019/05/03/5ccc3a422c0ef.png'
      this.nearastMarkerSrc = 'http://pr18vapfw.bkt.clouddn.com/timg2.png'
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
    /*
    let markers = [];
    let curPlaces = this.state.places.get(this.state.curTypeId);
    this.mpContext.markers = markers;
    */
    wx.getLocation({success: this.showLocation.bind(this)})
    this.mpContext.moveToLocation()
    //this.describePlaceNearBy()
    this.descIntervalId = setInterval(this.describePlaceNearBy.bind(this),5000)
  }

  componentWillUnmount () { 
    clearInterval(this.descIntervalId)
  }

  componentDidShow () { }

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
        console.log("SZHSB",id,src)
        marker.iconPath = src
        break
      }
    }
    this.setState({placeMarkers: tempmarkers})
  }
  onMarkSelected(e){
    console.log(e)
    wx.openLocation({
      latitude: 40.22077,//mk.Longitude,
      longitude: 116.23128//mk.Latitude
    })
  }

  render () {
    return (
      <View>
        <View className="topBar">
          <View className="campusSelect">沙河校区</View>
          <View className="placeSelect">
            <ScrollView scrollX="true">
              <View className="placeTypes">
                {this.state.placeTypes.map(type => {
                  return(
                    <View className="notSelectedPlaceTitle" id={type.id+"type"} onClick={this.placeTypeSelect} key="type">{type.type}</View>
                  )
                })}
              </View>
            </ScrollView>         
          </View>
        </View>
        
        {(detailDisplay == 1) && (<Map latitude="40.22077" longitude="116.23128" id='map' show-location markers={this.state.placeMarkers} onmarkertap={this.onMarkSelected} style='width: 100%; height:48vh'/>)}
        {(detailDisplay == 0) && (<Map latitude="40.22077" longitude="116.23128" id='map' show-location markers={this.state.placeMarkers} onmarkertap={this.onMarkSelected} style='width: 100%; height:88vh'/>)}         
        {(detailDisplay == 1) && (<View className="displaySelect" onClick={this.displayRev}>共有{this.state.placeNum}个 ∨</View>)}
        {(detailDisplay == 0) && (<View className="displaySelect" onClick={this.displayRev}>共有{this.state.placeNum}个 ∧</View>)}
        {(detailDisplay == 1) &&
        (<View className="placeDetail">
            <ScrollView>
              <View className="placeDetail">

                {this.state.curTypePlaces.map(detail => {
                      return(
                        <View className="detailGroup" id={detail.Id+"place"} onClick={this.jumpToDetail}>
                          <View className="placePicHolder">
                            <Image className="placePic" src={detail.Picture}/>
                          </View>
                          <View className="placeTitle">{detail.Title}</View>
                        </View>
                      )
                    })}

              </View>
            </ScrollView>  
        </View>)}
      </View>
    )
  }
}
