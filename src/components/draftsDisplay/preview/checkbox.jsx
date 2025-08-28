import React, {useCallback, useState} from 'react';
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'


const Checkbox = ({title, options, index}) => {
	const [checked, setChecked] = useState([]);
	const handleCheck = useCallback(e => {
		const option = e.currentTarget.id;
		if (checked.includes(option)) {
			const newOptions = checked.filter(op => op !== option);
			setChecked(newOptions);
		} else {
			setChecked([...checked, option]);
		}
	}, [checked])


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