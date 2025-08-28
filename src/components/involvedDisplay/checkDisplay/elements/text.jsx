import React, {useContext} from 'react';
import {AnswersDetailsContext, QuesDetailsBoundedContext} from "../../context/renderChecked";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Text = ({index}) => {
	const answer = useContext(AnswersDetailsContext)[index];
	const question = useContext(QuesDetailsBoundedContext)[index];

	return (
		<>
			{(!!answer && !!question) && (
				<fieldset>
					<fieldset disabled={true} style={{border: 'none'}}>
						<legend>
							{`${index + 1}. ${question.title}`}
							<span>{'(填空题)'}</span>
						</legend>
						<input type="text" value={answer.answer.value}/>
					</fieldset>
				</fieldset>
			)}
		</>
	);
};

export default Text;