import React from 'react';
import {useNavigate} from "react-router-dom";
import surveyNotFound from '../../../style/surveyNotFound/surveyNotFound.module.css'


const EndCollected = () => {
	const navigate = useNavigate();
	const backToInvolved = e => {
		e.preventDefault();
		navigate('../involved');
	}


	return (
		<div className={surveyNotFound.entire}>
			<h1>{'该问卷已结束收集'}</h1>
			<div className={surveyNotFound.btnBox}>
				<button onClick={backToInvolved}>{'回到首页'}</button>
			</div>
		</div>
	);
};

export default EndCollected;