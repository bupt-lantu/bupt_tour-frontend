import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import Position from '../../components/position/position'
import Head from '../../components/head/head'
import Body from '../../components/body/body'
export default class Index extends Component {

  config = {
    navigationBarTitleText: '导览服务',
    navigationBarBackgroundColor: "#1564b8",
    navigationBarTextStyle: "white"
  }

  componentWillMount () { }

  componentDidMount () { 
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
       <Head />
       <Position />
       <Body />
      </View>
    )
  }
}
