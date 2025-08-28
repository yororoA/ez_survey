import React, {useContext} from 'react';
import {AnswersDetailsContext, QuesDetailsBoundedContext} from "../../context/renderChecked";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Single = ({index}) => {
	const answer = useContext(AnswersDetailsContext)[index];
	const question = useContext(QuesDetailsBoundedContext)[index];

	return (
		<>
			{(!!answer && !!question) && (
				<fieldset>
					<fieldset disabled key={index} style={{border: 'none'}}>
						<legend>
							{`${index + 1}. ${question.title}`}
							<span>{'(单选题)'}</span>
						</legend>
						<div className={involvedCheck.optionsBox}>
							{question.options.map(option => (
								<div key={option.id} id={option.id}
										 className={`${involvedCheck.option}
										 ${answer.answer.value === option.id && involvedCheck.checked}`}>
									<span>{option.id}{'.'}</span>
									<span>{option.content}</span>
								</div>
							))}
						</div>
					</fieldset>
				</fieldset>
			)}
		</>
	);
};

export default Single;