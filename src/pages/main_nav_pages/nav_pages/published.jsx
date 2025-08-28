import React, {useEffect, useState} from 'react';
import {getUserSurveys} from "../../../utils/getUserSurveys";
import RenderPublished from "../../../components/publishedDisplay/renderPublished";
import {RenderPublishedContext} from "../../../components/publishedDisplay/context/renderPublishedContext";

const Published = () => {
	sessionStorage.clear();
	// 获得所有属于当前用户的已发布问卷
	const [publishedSurveys, setPublishedSurveys] = useState([]);
	// 是否存在已发布问卷
	const [hasPublished, setHasPublished] = useState(false);
	fetch(`http://localhost:1337/api/clients/${localStorage.getItem('token')}`)
		.then(resp => {
			if (!resp.ok) {
				throw new Error(`获取用户数据失败: ${resp.status}`);
			}
			return resp.json();
		})
		.then(data => {
			const surveys = data.data.surveys.filter(survey => survey.published === true);
			console.log('????????????', surveys);
			if (surveys == null || surveys.length === 0) {
				setHasPublished(false);
			} else {
				setHasPublished(true);
			}
		})
		.catch(err => {
			if (err.message.includes('Failed to fetch')) {
				console.error(`服务器都没开还想连服务器吗`)
			} else {
				console.error('嘟嘟嘟', err.message)
			}
		})


	useEffect(() => {
		// 获取已发布问卷
		if (hasPublished) getUserSurveys(false).then(r => {
			setPublishedSurveys(r);
		});
	}, [hasPublished]);

	return (
		<RenderPublishedContext.Provider value={publishedSurveys}>
			<RenderPublished hasPulished={hasPublished}/>
		</RenderPublishedContext.Provider>
	);
};

export default Published;