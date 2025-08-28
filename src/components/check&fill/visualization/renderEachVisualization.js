import Text from "./diplay/text";
import Location from "./diplay/location";
import Single from "./diplay/single";
import Checkbox from "./diplay/checkbox";
import Slider from "./diplay/slider";
import Rating from "./diplay/rating";

/* 根据问题渲染可视化组件, 接受一个包含问题详细信息的数组 */
export function renderEachVisualization(questions) {
	const elements = [];
	questions.forEach(question => {
		switch (question.type) {
			case 'text': {
				elements.push(<Text key={question.index} index={question.index} title={question.title}/>);
				break;
			}
			case 'location': {
				elements.push(<Location key={question.index} index={question.index} title={question.title}/>);
				break;
			}
			case 'single': {
				elements.push(<Single key={question.index} index={question.index} title={question.title}/>);
				break;
			}
			case 'checkbox': {
				elements.push(<Checkbox key={question.index} index={question.index} title={question.title}/>);
				break;
			}
			case 'slider': {
				elements.push(<Slider key={question.index} index={question.index} title={question.title}/>);
				console.log(elements)
				break;
			}
			case 'rating': {
				elements.push(<Rating key={question.index} index={question.index} title={question.title}/>);
				break;
			}
		}
	});

	return elements;
}