/* 检查问卷是否合法
* @accept`surveyId`: 需要检测的 surveyId
* @return [object object]Promise */
import {getUserData} from "./getUserData";

export async function checkSurvey(surveyId) {
	const checkResp = await fetch(`http://localhost:1337/api/surveys/${surveyId}`);

	// 检查问卷本身的属性
	// 对于不存在和未发布的问卷使用同样的错误信息
	if (!checkResp.ok && checkResp.status === 404) {
		return {
			isValid: false,
			surveyData: null,
			error: {
				code: 1,
				message: '该问卷不存在'
			}
		};
	}
	const data = await checkResp.json();
	if (!data.data.published) {
		return {
			isValid: false,
			surveyData: null,
			error: {
				code: 1,
				message: '该问卷不存在'
			}
		}
	}
	// 当前用户是否为问卷发布者
	const clientId = localStorage.getItem('token');
	if(data.data.clientId === clientId){
		return {
			isValid: false,
			surveyData: null,
			error:{
				code: 0,
				message: '用户为问卷发布者, 跳转可视分析页'
			}
		}
	}
	// 是否已结束收集
	if (data.data.endCollection) {
		return {
			isValid: false,
			surveyData: null,
			error: {
				code: 2,
				message: '该问卷已结束收集'
			}
		}
	}

	// 检查当前用户是否已填写过问卷
	const clientDatas = await getUserData();
	const involved = clientDatas.data.involved;
	if (involved !== null) {
		if (involved.length !== 0) {
			for (let any of involved) {
				if (any.survey === surveyId) {
					return {
						isValid: false,
						surveyData: null,
						error: {
							code: 3,
							message: '已填写并提交'
						}
					}
				}
			}
		}
	}

	return {
		isValid: true,
		surveyData: {
			title: data.data.title,
			description: data.data.description,
			questions: data.data.questions,
			userId: data.data.clientId,
			answers: data.data.answers
		},
		error: {
			code: null,
			message: null
		}
	}
}