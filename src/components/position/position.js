import Taro, {Component} from '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import './position.less'
class Position extends Component{
	render(){
		return (<View className="position">
		<Text className="place">图书馆</Text>
		<Image className="img" src={require("../../images/2.jpg")}/>
		</View>)
	}
}
export default Position;