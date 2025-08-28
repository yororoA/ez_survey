import React from 'react';
import surveyNotFound from '../../style/surveyNotFound/surveyNotFound.module.css'
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
	const navigate = useNavigate()

	return (
		<div className={surveyNotFound.error}>
			<span>{'404: NOT FOUND'}</span>
			<button onClick={e=>{
				e.preventDefault();
				navigate('../')
			}}>{'前往首页'}</button>
		</div>
	);
};

export default NotFoundPage;