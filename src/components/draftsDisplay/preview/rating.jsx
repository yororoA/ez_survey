import React, {useCallback, useState} from 'react';
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'

const Rating = ({title, max, step, index}) => {
	const [rate, setRate] = useState(step);
	const handleRateChange = useCallback(e => {
		setRate(e.target.value);
	}, [title]);

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