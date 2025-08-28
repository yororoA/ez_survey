import React, {useCallback, useContext, useState} from 'react';
import {ReEditQueContext} from "../context/reEditQueContext";
import editPreview from '../../../style/editPreview/editPreview.module.css'

const Single = ({key, que, index}) => {
	const data = JSON.parse(sessionStorage.getItem(que));
	const options = data.options;


	// 编辑
	const edit = useContext(ReEditQueContext);

	function handleEdit(e) {
		e.preventDefault();
		edit(que, false);
	}

	// 删除
	function handleDel(e) {
		e.preventDefault();
		edit(que, true);
	}

	const [isHover, setIsHover] = useState(false);
	// 鼠标进入
	const handleEnter = useCallback(e => {
		setIsHover(true);
	}, [isHover]);
	// 鼠标离开
	const handleLeave = useCallback(e => {
		setIsHover(false);
	}, [isHover]);

	return (
		<fieldset onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
			<fieldset disabled style={{border: 'none'}}>
				<legend>
					{`${index + 1}. ${que}`}
					<span>{'(单选题)'}</span>
				</legend>
				<div className={editPreview.optionsBox}>
					{options.map(option => (
						<div key={key} id={option.id} className={editPreview.option}>
							<span>{option.id}{'.'}</span>
							<span>{option.content}</span>
						</div>
					))}
				</div>
			</fieldset>
			{isHover && (
				<div className={editPreview.btnBox}>
					<button onClick={handleEdit}>{'编辑'}</button>
					<button onClick={handleDel}>{'删除'}</button>
				</div>
			)}
		</fieldset>
	);
};

export default Single;