import React, {useContext, useEffect, useState} from 'react';
import {AnswersInfosContext, QuesBaseInfosContext} from "../../context/visualizationContext";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'

const Checkbox = ({title, index}) => {
	const questions = useContext(QuesBaseInfosContext);
	const answers = useContext(AnswersInfosContext);
	const [allFetched, setAllFetched] = useState(false);
	useEffect(() => {
		if (questions !== null && answers !== null) {
			setAllFetched(true);
		}
	}, [questions, answers]);


	const [optionsPercent, setOptionsPercent] = useState({});
	useEffect(() => {
		// 获取所有选项并初始化选择次数为0
		const options = Object.assign({}, ...questions[index].options.map(option => {
				return {[option.id]: 0};
			})
		);
		// 获取每个选项的选择次数
		if (answers !== null) {
			for (let option in options) {
				for (let answer of answers) {
					if (answer[index].answer.value.includes(option)) options[option] += 1;
				}
			}
			for (let option in options) {
				options[option] = options[option] * 100 / answers.length;
			}
			setOptionsPercent(options);
		}
	}, [allFetched]);


	return (
		<>
			<fieldset>
				<fieldset disabled key={index} style={{border: 'none'}}>
					<legend>
						{`${index + 1}. ${title}`}
						<span>{'(单选题)'}</span>
					</legend>
					<div className={involvedCheck.optionsBox}>
						{questions[index].options.map(option => (
							<div key={option.id} id={option.id}
									 className={`${involvedCheck.option} ${involvedCheck.visualizationOption}`}
									 style={{cursor: 'pointer', '--percent': `${allFetched ? optionsPercent[option.id] : 0}%`}}>
								<span>{option.id}{'.'}</span>
								<span>{option.content}</span>
								<span>{`${allFetched ? optionsPercent[option.id] : 0}%`}</span>
							</div>
						))}
					</div>
				</fieldset>
			</fieldset>
		</>
	);
};

export default Checkbox;