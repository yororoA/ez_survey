import React, {useCallback, useContext, useEffect} from 'react';
import {SubmitCheckEmptyContext, TendToSubmitContext} from "../../context/submitCheckEmptyContext";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'


const Text = ({title, index}) => {
	// 将用户输入的答案存到sessionStorage
	useEffect(() => {
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: '', questionType: 'text', index}));
	}, [title]);
	const textInput = useCallback(e => {
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: e.target.value, questionType: 'text', index}));
	}, [title]);


	// 检查是否完成填写
	const checkCompleted = useContext(SubmitCheckEmptyContext);
	const tendToSubmit = useContext(TendToSubmitContext);
	useEffect(() => {
		const check = () => {
			if (tendToSubmit.current) {
				checkCompleted(title, 'text');
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
					<span>{'(填空题)'}</span>
				</legend>
				<input type="text" onChange={textInput}/>
			</fieldset>
		</fieldset>
	);
};

export default Text;