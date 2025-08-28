import Text from "./elements/text";
import Location from "./elements/location";
import Single from "./elements/single";
import Checkbox from "./elements/checkbox";
import Slider from "./elements/slider";
import Rating from "./elements/rating";

/*根据传入的answers中每个answer的type获取对应的组件*/
export function getDisplayElements(answers) {
	const elements = [];
	answers.forEach(answer => {
		switch (answer.questionType) {
			case 'text': {
				elements.push(<Text index={answer.index}/>);
				break;
			}
			case 'location': {
				elements.push(<Location index={answer.index}/>);
				break;
			}
			case 'single': {
				elements.push(<Single index={answer.index}/>);
				break;
			}
			case 'checkbox': {
				elements.push(<Checkbox index={answer.index}/>);
				break;
			}
			case 'slider': {
				elements.push(<Slider index={answer.index}/>);
				break;
			}
			case 'rating': {
				elements.push(<Rating index={answer.index}/>);
				break;
			}
		}
	});
	return elements;
}