import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SubmitCheckEmptyContext, TendToSubmitContext} from "../../context/submitCheckEmptyContext";
import involvedCheck from '../../../../style/involvedCheck/involvedCheck.module.css'



const Rating = ({title, max, step, index}) => {
	// 将用户输入的答案存到sessionStorage
	useEffect(() => {
		// 初始化sessionStorage
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: 0, questionType: 'rating', index}));
	}, [title])
	// 分数变化
	const [rate, setRate] = useState(-step);
	const handleRateChange = useCallback(e => {
		const newRate = +e.target.value;
		setRate(newRate);
	}, [title])
	// 分数存储
	useEffect(() => {
		sessionStorage.setItem(`${title}`, JSON.stringify({answer: rate, questionType: 'rating', index}));
	}, [rate]);


	// 检查是否完成填写
	const checkCompleted = useContext(SubmitCheckEmptyContext);
	const tendToSubmit = useContext(TendToSubmitContext);
	useEffect(() => {
		const check = () => {
			if (tendToSubmit.current) {
				checkCompleted(title, 'rating');
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
					<span>{'(评分)'}</span>
				</legend>
				<div className={involvedCheck.optionsBox}
						 style={{'--slide-value': rate, '--total-value': max}}>
					<input type="range" className={involvedCheck.slider}
								 min={0} max={max} step={step} value={rate}
								 style={{'--slide-value': rate, '--total-value': max}}
								 onChange={handleRateChange}
								 disabled={false}/>
					<span className={involvedCheck.thumbBefore}>{rate}</span>
				</div>
			</fieldset>
		</fieldset>
	);
};

export default Rating;