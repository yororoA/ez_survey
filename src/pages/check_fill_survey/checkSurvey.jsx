import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {checkSurvey} from "../../utils/checkSurvey";
import {RenderFillContext} from "../../components/check&fill/context/renderFillContext";
import {render} from "./render";


// 检查 surveyId 是否合法
const CheckSurvey = () => {
	// 获取url中的surveyId参数
	const {surveyId} = useParams();

	const [checkResult, setCheckResult] = useState({
		isValid: false, // 问卷是否有效
		surveyData: null, // 问卷详情, title, description, questions, endCollection, userId
		error: {} // 无效原因 code, message
	});
	// 将要渲染到页面中的组件
	const [elements, setElement] = useState(null);
	// 是否正在检查
	const [isChecking, setIsChecking] = useState(true);

	// 检查 surveyId 是否合法
	useEffect(() => {
		if (surveyId) {
			checkSurvey(surveyId).then(r => {
				setCheckResult(r);
				setElement(render(r.error.code, surveyId));
			});
			setIsChecking(false);
		}
	}, [surveyId]);


	return (
		<>
			{isChecking ? <h1>{'让我来大调查一下你要填的问卷...'}</h1> : (
				<>
					<RenderFillContext.Provider value={checkResult}>
						{elements}
					</RenderFillContext.Provider>
				</>
			)}
		</>
	);
};

export default CheckSurvey;