import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SubmitCheckEmptyContext, TendToSubmitContext} from "../../context/submitCheckEmptyContext";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'


const Checkbox = ({title, options, index}) => {
	// 将用户选择的答案存到sessionStorage
	const [checked, setChecked] = useState([]);
	// 初始化
	useEffect(() => {
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: [], questionType: 'checkbox', index}));
	}, [title])
	const handleCheck = useCallback(e => {
		const option = e.currentTarget.id;
		// 检查当前点击的选项是否已经选择
		if (checked.includes(option)) {
			const newOptions = checked.filter(op => op !== option);
			setChecked(newOptions);
		} else {
			setChecked([...checked, option]);
		}
	}, [checked])
	useEffect(() => {
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: checked, questionType: 'checkbox', index}));
	}, [checked])


	// 检查是否完成填写
	const checkCompleted = useContext(SubmitCheckEmptyContext);
	const tendToSubmit = useContext(TendToSubmitContext);
	useEffect(() => {
		const check = () => {
			if (tendToSubmit.current) {
				checkCompleted(title, 'checkbox');
			}
		};
		window.addEventListener('submit-check', check);

		return () => window.removeEventListener('submit-check', check);
	}, [tendToSubmit, title]);

	return (
		<fieldset>
			<fieldset disabled key={index} style={{border: 'none'}}>
				<legend>
					{`${index + 1}. ${title}`}
					<span>{'(多选题)'}</span>
				</legend>
				<div className={involvedCheck.optionsBox}>
					{options.map(option => (
						<div key={option.id} id={option.id} onClick={handleCheck}
								 className={`${involvedCheck.option}
										 ${checked.includes(option.id) && involvedCheck.checked}`}
								 style={{cursor: 'pointer'}}
						>
							<span>{option.id}{'.'}</span>
							<span>{option.content}</span>
						</div>
					))}
				</div>
			</fieldset>
		</fieldset>
	);
};

export default Checkbox;