import Single from "./single";
import Checkbox from "./checkbox";
import Location from "./location";
import Rating from "./rating";
import Select from "./select";
import Slider from "./slider";
import Text from "./text";


/*
* 根据传入问题数组中每个问题的类型返回相应的组件数组,
* 每个组件中 key 为问题的id, que 为用于查找sessionStorage的title
* */
export function getDisplayElements(ques) {
	const elementLst = [];
	ques.forEach((que, index) => {
		// console.log(index,'---',que);
		switch (que.type) {
			case 'single': {
				elementLst.push(<Single index={index} key={que.id} que={que.title}/>);
				return;
			}
			case 'checkbox': {
				elementLst.push(<Checkbox index={index} key={que.id} que={que.title}/>);
				return;
			}
			case 'location': {
				elementLst.push(<Location index={index} key={que.id} que={que.title}/>);
				return;
			}
			case 'rating': {
				elementLst.push(<Rating index={index} key={que.id} que={que.title}/>);
				return;
			}
			case 'select': {
				elementLst.push(<Select index={index} key={que.id} que={que.title}/>);
				return;
			}
			case 'slider': {
				elementLst.push(<Slider index={index} key={que.id} que={que.title}/>);
				return;
			}
			case 'text': {
				elementLst.push(<Text index={index} key={que.id} que={que.title}/>);
				return;
			}
		}
	});
	return elementLst;
}