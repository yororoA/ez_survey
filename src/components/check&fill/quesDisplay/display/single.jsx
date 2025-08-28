import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SubmitCheckEmptyContext, TendToSubmitContext} from "../../context/submitCheckEmptyContext";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'


const Single = ({title, options, index}) => {
	// 将用户选择的答案存到sessionStorage
	useEffect(() => {
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: "", questionType: 'single', index}));
	}, [title]);
	const [checked, setChecked] = useState(null);
	const handleCheck = useCallback(e => {
		setChecked(e.currentTarget.id);
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: e.currentTarget.id, questionType: 'single', index}));
	}, [checked, title])


	// 检查是否完成填写
	const checkCompleted = useContext(SubmitCheckEmptyContext);
	const tendToSubmit = useContext(TendToSubmitContext);
	useEffect(() => {
		const check = () => {
			if (tendToSubmit.current) {
				checkCompleted(title, 'single');
			}
		};
		window.addEventListener('submit-check', check);

		return () => window.removeEventListener('submit-check', check);
	}, [tendToSubmit, title]);

	return (
		<fieldset>
			<fieldset style={{border: 'none'}}>
				<legend>
					{`${index + 1}. ${title}`}
					<span>{'(单选题)'}</span>
				</legend>
				<div className={involvedCheck.optionsBox}>
					{options.map(option => (
						<div key={option.id} id={option.id} onClick={handleCheck}
								 className={`${involvedCheck.option}
										 ${checked === option.id && involvedCheck.checked}`}
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

export default Single;