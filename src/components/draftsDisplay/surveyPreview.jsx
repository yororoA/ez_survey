import React from 'react';
import {renderPreview} from "./renderPreview";
import {useNavigate} from "react-router-dom";
import involvedCheck from '../../style/involvedCheck/involvedCheck.module.css'

const SurveyPreview = () => {
	// 用于预览的数据
	const surveyTitle = sessionStorage.getItem('surveyTitle');
	const surveyDescription = sessionStorage.getItem('surveyDescription');
	const nums = sessionStorage.length;
	const questions = [];
	for (let i = 0; i < nums; i++) {
		const key = sessionStorage.key(i);
		if (key === 'surveyTitle' || key === 'surveyDescription') continue;
		questions.push(JSON.parse(sessionStorage.getItem(key)));
	}
	questions.sort((a, b) => a.index - b.index);
	console.log(questions);

	// 获取每个问题的预览组件
	const elements = renderPreview(questions);


	// 返回
	const navigate = useNavigate();
	const backToDrafts = e => {
		e.preventDefault();
		sessionStorage.clear();
		navigate('../');
	}


	return (
		<div className={involvedCheck.entire}>
			<header className={involvedCheck.headerSuggest}>{'草稿预览'}</header>
			<div className={involvedCheck.quesDisplayZone}>
				<header>
					<span>{surveyTitle}</span>
					<span>{surveyDescription}</span>
				</header>
				<div>
					{elements}
				</div>
			</div>
			<button onClick={backToDrafts}>{'返回'}</button>
		</div>
	);
};

export default SurveyPreview;