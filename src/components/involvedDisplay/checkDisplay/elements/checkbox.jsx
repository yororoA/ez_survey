import React, {useContext} from 'react';
import {AnswersDetailsContext, QuesDetailsBoundedContext} from "../../context/renderChecked";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Checkbox = ({index}) => {
	const answer = useContext(AnswersDetailsContext)[index];
	const question = useContext(QuesDetailsBoundedContext)[index];

	console.log(answer, question)


	return (
		<>
			{(!!answer && !!question) && (
				<fieldset>
					<fieldset disabled key={index} style={{border: 'none'}}>
						<legend>
							{`${index + 1}. ${question.title}`}
							<span>{'(多选题)'}</span>
						</legend>
						<div className={involvedCheck.optionsBox}>
							{question.options.map(option => (
								<div key={option.id} id={option.id}
										 className={`${involvedCheck.option}
										 ${answer.answer.value.includes(option.id) && involvedCheck.checked}`}>
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

export default Checkbox;