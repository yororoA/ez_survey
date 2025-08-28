import React from 'react';
import Backdrop from "../backdrop/backdrop";
import prompt from './prompt.module.css'

const Prompt = ({title, content, onClick, copy}) => {
	const handleClick = async e => {
		e.preventDefault();
		console.log(onClick);
		if (copy) {
			await navigator.clipboard.writeText(content);
			alert('已将链接复制到剪贴板')
		}
		if (onClick !== undefined) onClick();
	}


	return (
		<Backdrop send={true}>
			<div className={prompt.entire}>
				<header>{title}</header>
				{content && <input type="text" value={content}/>}
				<div className={prompt.btnBox}>
					{!title.includes('链接') && <button>{'取消'}</button>}
					<button onClick={handleClick}>{'确认'}</button>
				</div>
			</div>
		</Backdrop>
	);
};

export default Prompt;