import React, {useContext} from 'react';
import {AnswersDetailsContext, QuesDetailsBoundedContext} from "../../context/renderChecked";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Rating = ({index}) => {
	const answer = useContext(AnswersDetailsContext)[index];
	const question = useContext(QuesDetailsBoundedContext)[index];


	return (
		<>
			{(!!answer && !!question) && (
				<fieldset>
					<fieldset disabled style={{border: 'none'}}>
						<legend>
							{`${index + 1}. ${question.title}`}
							<span>{'(进度条)'}</span>
						</legend>
						<div className={involvedCheck.optionsBox}
								 style={{'--slide-value': answer.answer.value, '--total-value': question.max}}>
							<input type="range" className={involvedCheck.slider}
										 min={0} max={question.max} step={question.step} value={answer.answer.value}
										 style={{'--slide-value': answer.answer.value, '--total-value': question.max}}
										 disabled={true}/>
							<span className={involvedCheck.thumbBefore}>{answer.answer.value}</span>
						</div>
					</fieldset>
				</fieldset>
			)}
		</>
	);
};

export default Rating;