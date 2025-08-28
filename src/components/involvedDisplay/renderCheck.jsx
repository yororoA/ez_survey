import React, {useCallback, useContext} from 'react';
import {AnswersDetailsContext, QuesDetailsBoundedContext, SurveyOverviewContext} from "./context/renderChecked";
import {getDisplayElements} from "./checkDisplay/getDisplayElements";
import {useNavigate} from "react-router-dom";
import involvedCheck from '../../style/involvedCheck/involvedCheck.module.css'

const RenderCheck = () => {
	const answers = useContext(AnswersDetailsContext);
	const surveyOverview = useContext(SurveyOverviewContext);

	// 获取每个问题对应组件
	const elementes = getDisplayElements(answers);


	// 返回involved
	const navigate = useNavigate();
	const backToInvolved = useCallback(e => {
		e.preventDefault();
		navigate('../../involved');
	}, [answers]);


	return (
		<div className={involvedCheck.entire}>
			<div className={involvedCheck.quesDisplayZone}>
				<header>
					<span>{surveyOverview.title}</span>
					<span>{surveyOverview.description}</span>
				</header>
				<div>
					{elementes}
				</div>
			</div>
			<button onClick={backToInvolved}>{'返回'}</button>
		</div>
	);
};

export default RenderCheck;