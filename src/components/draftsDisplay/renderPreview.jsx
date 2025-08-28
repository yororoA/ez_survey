import React from "react";
import Text from "./preview/text";
import Location from "./preview/location";
import Single from "./preview/single";
import Checkbox from "./preview/checkbox";
import Slider from "./preview/slider";
import Rating from "./preview/rating";


/*
* @return 返回一个组件数组, 数组中每个元素为每个问题对应的预览组件
* @accept `ques`: 一个问题描述数组, 数组中每个元素应当包含该问题的 title, type, 以及 options 等必要属性;
* */
export function renderPreview(ques) {
	const elements = [];
	ques.forEach((que, ind) => {
		switch (que.type) {
			case 'text': {
				elements.push((
					<Text title={que.title} index={ind}/>
				));
				break;
			}
			case 'location': {
				elements.push((
					<Location title={que.title} index={ind}/>
				));
				break;
			}
			case 'single':{
				elements.push((
					<Single title={que.title} options={que.options} index={ind}/>
				));
				break;
			}
			case 'checkbox':{
				elements.push((
					<Checkbox title={que.title} options={que.options} index={ind}/>
				));
				break;
			}
			case 'slider':{
				elements.push((
					<Slider title={que.title} max={que.max} step={que.step} index={ind}/>
				));
				break;
			}
			case 'rating':{
				elements.push((
					<Rating title={que.title} max={que.max} step={que.step} index={ind}/>
				));
				break;
			}
		}
	});
	return elements;
}