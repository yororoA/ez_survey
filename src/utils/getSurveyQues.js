/* 根据 `surveyId` 查询相应 `survey` 的 `questions`
* @accept `surveyId`: 需要查询的 survey
* @accept `draftsOrPublished`: bool, 是否获取草稿, false为获取已发布 */
export async function getSurveyQues(surveyId, draftsOrPublished) {
	const url = `http://localhost:1337/api/surveys/${surveyId}`;
	try {
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`获取数据失败: ${resp.status}`);
		}
		const surveyDetails = await resp.json();
		return draftsOrPublished ? {
			// 返回草稿问卷相关信息
			title: surveyDetails.data.title,
			description: surveyDetails.data.description,
			id: surveyId,
			questions: surveyDetails.data.questions
		} : {
			// 返回已发布问卷相关信息
			title: surveyDetails.data.title,
			description: surveyDetails.data.description,
			id: surveyId,
			endCollection: surveyDetails.data.endCollection,
			questions: surveyDetails.data.questions,
			answers: surveyDetails.data.answers
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}