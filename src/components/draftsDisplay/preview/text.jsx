import React from 'react';
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'

const Text = ({title, index}) => {

	return (
		<fieldset>
			<fieldset disabled={false} style={{border: 'none'}}>
				<legend>
					{`${index + 1}. ${title}`}
					<span>{'(填空题)'}</span>
				</legend>
				<input type="text"/>
			</fieldset>
		</fieldset>
	);
};

export default Text;