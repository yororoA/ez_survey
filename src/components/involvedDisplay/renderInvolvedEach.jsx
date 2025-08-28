import React, {useContext, useState} from 'react';
import {RenderInvolvedEachContext} from "./context/renderInvolvedEachContext";
import {useNavigate} from "react-router-dom";
import involvedDisplay from '../../style/involvedDisplay/involvedDisplay.module.css'

/* 用于生成在involved中排列的involved问卷组件
* @accept`surveysDetails`: 所有需要获取involved的involved信息, 数组, 其中应包含 survey.title, survey.description, answer(id) */
const RenderInvolvedEach = () => {
	const navigate = useNavigate();
	// 查看详情
	const checkInvolved = (e) => {
		e.preventDefault();
		navigate(`./check/${e.target.id}`);
	}

	// 控制详情按钮的显示
	const [hoveringId, setHoveringId] = useState(null);


	// 生成组件
	const surveysDetails = useContext(RenderInvolvedEachContext);
	const elements = [];
	surveysDetails.forEach(surveyDetails => {
		elements.push(
			<fieldset key={surveyDetails.answer} id={surveyDetails.answer}
								className={involvedDisplay.eachInvolved}
								onMouseEnter={(e) => setHoveringId(e.currentTarget.id)}
								onMouseLeave={() => setHoveringId(null)}>
				<div className={involvedDisplay.content}>
					<div>{surveyDetails.survey.title}</div>
					<div>{surveyDetails.survey.description}</div>
				</div>
				{hoveringId === surveyDetails.answer && (
					<div className={involvedDisplay.btnBox}>
						<button onClick={checkInvolved} id={surveyDetails.answer}>{'查看详情'}</button>
					</div>
				)}
			</fieldset>
		);
	});


	return (
		<div className={involvedDisplay.involvedDisplayZone}>
			{elements}
		</div>
	);
};

export default RenderInvolvedEach;