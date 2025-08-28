import HaveInvolved from "./pages/haveInvolved";
import NoSurvey from "./pages/noSurvey";
import EndCollected from "./pages/endCollected";
import SurveyAnswersVisualization from "./pages/surveyAnswersVisualization";
import RenderFillSurvey from "./pages/renderFillSurvey";


/*渲染填写界面, 根据错误码返回相应的组件
* @accept`errCode`: 用于筛选需要返回的组件
* @accept`surveyId`: 在无报错时用于渲染问卷组件*/
export function render(errCode, surveyId) {
	switch (errCode) {
		case 0: {
			return <SurveyAnswersVisualization/>;
		}
		case 1: {
			return <NoSurvey/>;
		}
		case 2: {
			return <EndCollected/>;
		}
		case 3: {
			return <HaveInvolved/>;
		}
		default: {
			return <RenderFillSurvey surveyId={surveyId}/>;
		}
	}
}