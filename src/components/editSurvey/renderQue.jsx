import React from 'react';
import Single from "./ques/single";
import Checkbox from "./ques/checkbox";
import Location from "./ques/location";
import Rating from "./ques/rating";
import Select from "./ques/select";
import Slider from "./ques/slider";
import Text from "./ques/text";

/*
* 返回传入类型对应的问题编辑组件
* */
export function renderQue(queType){
	switch (queType){
		case 'single':{
			return <Single/>;
		}
		case 'checkbox':{
			return <Checkbox/>;
		}
		case 'location':{
			return <Location/>;
		}
		case 'rating':{
			return <Rating/>;
		}
		case 'select':{
			return <Select/>;
		}
		case 'slider':{
			return <Slider/>;
		}
		case 'text':{
			return <Text/>;
		}
		default:{
			return <Text/>;
		}
	}
}