import React, {useContext, useEffect, useState} from 'react';
import {AnswersInfosContext, QuesBaseInfosContext} from "../../context/visualizationContext";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Rating = ({title, index}) => {
	const questions = useContext(QuesBaseInfosContext);
	const answers = useContext(AnswersInfosContext);
	const [allFetched, setAllFetched] = useState(false);
	useEffect(() => {
		if (questions !== null && answers !== null) {
			setAllFetched(true);
			console.log(questions)
		}
	}, [questions, answers]);


	const [average, setAverage] = useState(0);
	useEffect(() => {
		if (answers !== null) {
			let total = 0;
			for (let answer of answers) {
				total += answer[index].answer.value;
			}
			setAverage(total / answers.length);
		}
	}, [allFetched]);

	return (
		<>
			<fieldset>
				<fieldset disabled style={{border: 'none'}}>
					<legend>
						{`${index + 1}. ${questions[index].title}`}
						<span>{'(评分)'}</span>
					</legend>
					<div className={involvedCheck.optionsBox}
							 style={{'--slide-value': average, '--total-value': questions[index].max}}>
						<input type="range" className={involvedCheck.slider}
									 min={0} max={questions[index].max} step={0.1} value={average}
									 style={{'--slide-value': average, '--total-value': questions[index].max}}
									 disabled={true}/>
						<span className={involvedCheck.thumbBefore}>{average}</span>
					</div>
				</fieldset>
			</fieldset>
		</>
	);
};

export default Rating;