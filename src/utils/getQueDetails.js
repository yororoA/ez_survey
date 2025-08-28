/* 根据 `questionId` 获取对应的 `questionDetail` */
export async function getQueDetails(questionId) {
	const url = `http://localhost:1337/api/quests/${questionId}`;
	try {
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`获取数据失败: ${resp.status}`);
		}
		const questionDetails = await resp.json();
		const questionType = questionDetails.data.type;
		switch (questionType) {
			case 'text':
			case 'location': {
				return {
					title: questionDetails.data.title,
					type: questionType,
					index: questionDetails.data.index
				};
			}
			case 'single':
			case 'checkbox': {
				return {
					title: questionDetails.data.title,
					type: questionType,
					options: questionDetails.data.options,
					index: questionDetails.data.index
				};
			}
			case 'rating':
			case 'slider': {
				return {
					title: questionDetails.data.title,
					type: questionType,
					max: questionDetails.data.max,
					step: questionDetails.data.step,
					index: questionDetails.data.index
				}
			}
		}
	} catch (err) {
		console.error(err);
		return null;
	}
}