import Taro, {Component} from '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import './head.less'
class Head extends Component{
	render(){
		return (<View className="head"><Image className="img" src={require("../../images/1.jpg")} /></View>)
	}
}
export default Head;

