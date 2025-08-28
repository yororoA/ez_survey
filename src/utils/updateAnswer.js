import {updateUser} from "./updateUser";


/* 提交问卷, await直接调用
* @return bool_promise 是否提交成功
* @accept`surveyId`: 填写的问卷id */
export async function updateAnswer(surveyId) {
	// 用户id
	const clientId = localStorage.getItem('token');
	// 获取sessionStorage中的问题答案信息
	const nums = sessionStorage.length;
	const answers = [];
	for (let i = 0; i < nums; i++) {
		const key = sessionStorage.key(i);
		const data = JSON.parse(sessionStorage.getItem(key));
		answers.push({
			answer: {value: data.answer}, // 将 answer 包裹在对象中, 避免数据库解析时因使用 split 而无法读取
			questionType: data.questionType,
			index: data.index
		})
	}
	console.log(answers);
	// 更新Answer中的反馈信息, 由于在 strapi 中使用的 answers 为重复组件, 在上传时为便于后续查询, 必须携带 ?populate, 且后续查询时也应携带该参数
	const postResp = await fetch('http://localhost:1337/api/answers?populate=answers', {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: {
				surveyId,
				clientId,
				answers
			}
		})
	});
	if (!postResp.ok) {
		alert(`${postResp.status}: 提交失败(保存阶段)`);
		return false;
	}
	const q = await postResp.json();
	console.log(q);
	const answerId = q.data.documentId;
	// 获取对应survey已有的Answer
	const getBondedResp = await fetch(`http://localhost:1337/api/surveys/${surveyId}`);
	if (!getBondedResp.ok) {
		alert(`${getBondedResp.status}: 提交失败(绑定问卷阶段)`);
		return null;
	}
	const survey = await getBondedResp.json();
	const boundedAnswers = (survey.data.answers == null || survey.data.answers.length === 0) ? [] : [...survey.data.answers];
	// 将该Answer绑定给对应的survey
	const bondToSurveResp = await fetch(`http://localhost:1337/api/surveys/${surveyId}`, {
		method: "PUT",
		headers: {"Content-Type": 'application/json'},
		body: JSON.stringify({data: {answers: [...boundedAnswers, answerId]}})
	});
	if (!bondToSurveResp.ok) {
		alert(`${bondToSurveResp.status}: 提交失败(绑定问卷阶段)`);
		return null;
	}
	// 将Answer绑定给发布问卷的用户
	const publisherId = survey.data.clientId;
	await updateUser(`answers`, answerId, false, publisherId);
	// 将Answer绑定给当前用户的involved
	await updateUser(`involved`, {survey: surveyId, answer: answerId}, false);
}