import {getUserData} from "./getUserData";
import {getSurveyQues} from "./getSurveyQues";

/*查询用户绑定的survey
* @accept`getDrafts:` Bool, 是否获取草稿, false为获取已发布*/
export async function getUserSurveys(getDrafts) {
	// 获取用户数据
	const data = await getUserData();
	console.log(data);
	// 获取草稿
	if (getDrafts) {
		const surveys = data.data.surveys.filter(survey => survey.published === false);
		const surveysDetails = [];
		for (const survey of surveys) {
			const detail = await getSurveyQues(survey.id, true);
			surveysDetails.push(detail);
		}
		return surveysDetails;
	}
	// 获取已发布
	const surveys = data.data.surveys.filter(survey => survey.published === true);
	const surveysDetails = [];
	for (const survey of surveys) {
		const detail = await getSurveyQues(survey.id, false);
		surveysDetails.push(detail);
	}
	return surveysDetails;
}
