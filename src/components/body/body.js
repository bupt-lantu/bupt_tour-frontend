import Taro, {Component} from '@tarojs/taro';
import {View,Text,Image} from '@tarojs/components';
import './body.less'
class Body extends Component{
	constructor(){
		super(...arguments)
		this.state={
			poster:'',
			name:'图书馆',
			//src=
			controls:true,
			loop:true
		}
	}
	component
	render(){
		return (<View className="body">
		<audio class="audio" poster="{{poster}}" name="{{name}}" /*src="{{src}}"*/ id="myAudio" controls="{{controls}}" loop="{{loop}}"></audio>
		<Text className="content">含一级学科博,北京邮电大学（Beijing University of Posts and Telecommunications），简称北邮，是中华人民共和国教育部直属、工业和信息化部共建的全国重点大学，位列国家“211工程”、“985工程优势学科创新平台”、“世界一流学科建设高校”，是北京高科大学联盟成员高校，是中国政府奖学金来华留学生接收院校、国家建设高水平大学公派研究生项目实施高校、全国深化创新创业教育改革示范高校、国家大学生文化素质教育基地，入选国家“111计划”、“2011计划”和教育部首批“卓越工程师教育培养计划”、“新工科研究与实践项目”。
北京邮电大学创建于1955年，原名北京邮电学院，是中华人民共和国第一所邮电高等学府，隶属原邮电部。 1960年，被国务院确定为全国重点高校。1993年，更名为“北京邮电大学”。2000年，划入教育部直属高校行列。
据2019年4月学校官网显示，北京邮电大学有西土城路校区、沙河校区、宏福校区和小西天校区，在江苏无锡和广东深圳分别设有研究院。全日制本、硕、博学生及留学生近23000名，正式注册的非全日制学生近55000名；教职工总数2183人，其中专任教师1435人；有博士学位授权一级学科点10个，硕士点10个），有7类专业硕士学位授权点，有43个本科专业，建立博士后科研流动站6个</Text>
		</View>)
	}
}
export default Body;