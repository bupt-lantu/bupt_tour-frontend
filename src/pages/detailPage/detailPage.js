import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class detailPage extends Component {

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
       })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
      </View>
    )
  }
}
