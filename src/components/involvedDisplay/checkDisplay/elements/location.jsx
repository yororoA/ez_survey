import React, {useContext} from 'react';
import {AnswersDetailsContext, QuesDetailsBoundedContext} from "../../context/renderChecked";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Location = ({index}) => {
	const answer = useContext(AnswersDetailsContext)[index];
	const question = useContext(QuesDetailsBoundedContext)[index];


	return (
		<>
			{(!!answer && !!question) && (
				<fieldset>
					<fieldset disabled key={index} style={{border: 'none'}}>
						<legend>
							{`${index + 1}. ${question.title}`}
							<span>{'(定位)'}</span>
						</legend>
						<select name="location" id="location">
							<option value="location">{'定位精确位置信息'}</option>
							<option value="select">{'选择省份城市(暂不支持)'}</option>
						</select>
						<label htmlFor="location">{'定位方式'}</label>
						<div>
							<div>{'纬度:'}{answer.answer.value.latitude}</div>
							<div>{'经度:'}{answer.answer.value.longitude}</div>
							{/*<button style={{cursor:'default'}}>{'定位'}</button>*/}
						</div>
					</fieldset>
				</fieldset>
			)}
		</>
	);
};

export default Location;