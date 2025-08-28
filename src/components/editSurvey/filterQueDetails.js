// 根据 que 类型返回相应 用于发送服务器的 数据结构
export function filterQueDetails(que, index, surveyId) {
	const detail = JSON.parse(sessionStorage.getItem(que.title));
	switch (detail.type) {
		case 'text':
		case 'location':{
			return {
				attributes: {
					title: detail.title,
					type: detail.type,
					index: index,
					surveyId: surveyId
				}
			}
		}
		case 'single':
		case 'checkbox': {
			return {
				attributes: {
					title: detail.title,
					type: detail.type,
					options: JSON.stringify(detail.options),
					index: index,
					surveyId: surveyId
				}
			}
		}
		case 'slider':
		case 'rating': {
			return {
				attributes: {
					title: detail.title,
					type: detail.type,
					index: index,
					max: detail.max,
					step: detail.step,
					surveyId: surveyId
				}
			}
		}
		default: {
			return null;
		}
	}
}