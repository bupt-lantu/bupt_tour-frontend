import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class mapPage extends Component {

  constructor(props){
    super(props)
    this.state = { 
      curTypeId: 0,  //the current selected place type
      placeTypes: [], //an array of all types {id: , type: }
      places: new Map()//key: id, value: array of places
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

  componentWillMount () {
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
            this.setState({placeTypes: tPlaceTypes},()=>{console.log(this.state.placeTypes)})
            this.setState({places: tPlaces},()=>{console.log(this.state.places)})
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
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  showLocation(loc) { 
    console.log(loc)
  }

  jumpToDetail(id)// call this method when select a place from the list to show details
  {
    Taro.navigateTo({
      url: '/pages/detailPage/detailPage?id='+id
    })
  }

  render () {
    return (
      <View>
        <Text>TEST!</Text>
        <Map 
          id='map'
          style='width: 100%; height: 400px;'
        />
      </View>
    )
  }
}
