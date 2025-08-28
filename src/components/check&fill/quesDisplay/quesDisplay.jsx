import Text from "./display/text";
import Location from "./display/location";
import Single from "./display/single";
import Checkbox from "./display/checkbox";
import Slider from "./display/slider";
import Rating from "./display/rating";





/*根据接受到的问题信息列表返回对应的问题显示组件*/
export function quesDisplay(ques) {
	const elements = [];
	for (let que of ques) {
		switch (que.type) {
			case 'text': {
				elements.push(<Text title={que.title} index={que.index}/>)
				break;
			}
			case 'location': {
				elements.push(<Location title={que.title} index={que.index}/>);
				break;
			}
			case 'single': {
				elements.push(<Single title={que.title} options={que.options} index={que.index}/>);
				break;
			}
			case 'checkbox': {
				elements.push(<Checkbox title={que.title} options={que.options} index={que.index}/>);
				break;
			}
			case 'slider': {
				elements.push(<Slider title={que.title} step={que.step} max={que.max} index={que.index}/>);
				break;
			}
			case 'rating': {
				elements.push(<Rating title={que.title} step={que.step} max={que.max} index={que.index}/>);
				break;
			}
		}
	}
	return elements;
}