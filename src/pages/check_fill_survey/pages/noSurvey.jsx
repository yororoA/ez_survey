import React from 'react';
import {useNavigate} from "react-router-dom";
import surveyNotFound from '../../../style/surveyNotFound/surveyNotFound.module.css'

const NoSurvey = () => {
	const navigate = useNavigate();
	const backToInvolved = e => {
		e.preventDefault();
		navigate('../involved');
	}


	return (
		<div className={surveyNotFound.entire}>
			<h1>{'该问卷不存在'}</h1>
			<div className={surveyNotFound.btnBox}>
				<button onClick={backToInvolved}>{'回到首页'}</button>
			</div>
		</div>
	);
};

export default NoSurvey;