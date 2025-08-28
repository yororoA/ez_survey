import React, {useCallback, useState} from 'react';
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'

const Single = ({title, options, index}) => {
	const [checked, setChecked] = useState(null);
	const handleCheck = useCallback(e => {
		setChecked(e.currentTarget.id);
	}, [checked])


	return (
		<fieldset>
			<fieldset disabled key={index} style={{border: 'none'}}>
				<legend>
					{`${index + 1}. ${title}`}
					<span>{'(单选题)'}</span>
				</legend>
				<div className={involvedCheck.optionsBox}>
					{options.map(option => (
						<div key={option.id} id={option.id} onClick={handleCheck}
								 className={`${involvedCheck.option}
										 ${checked === option.id && involvedCheck.checked}`}
								 style={{cursor:'pointer'}}
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