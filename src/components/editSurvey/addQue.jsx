import React, {useCallback, useState} from 'react';
import {renderQue} from "./renderQue";
import select from '../../style/select/selectBox.module.css'
import Backdrop from "../../ui/backdrop/backdrop";
import addQue from '../../style/addQue/addQue.module.css'


const AddQue = () => {
	const [startChoose, setStartChoose] = useState(false);
	const [chooseType, setType] = useState('text');
	const [text, setText] = useState('填空题');

	const handleCheckType = useCallback(e => {
		if (e.target.id === 'select') {
			alert('我说这个题目类型现在不支持你是👂🐉还是👁🦐？')
			setStartChoose(true);
			return;
		}
		if (!!e.target.id) {
			setStartChoose(false)
			setType(e.target.id);
			setText(e.target.textContent);
			return;
			;
		}
		setStartChoose(false)
	}, []);

	const handleClickBox = e => {
		setStartChoose(true);
	}

	return (
		<div className={addQue.entire}>
			<label htmlFor="select">{"请选择问题类型: "}</label>
			<span id='selectBox' className={select.entire} onClick={handleClickBox}>{text}</span>
			<Backdrop send={startChoose} onClick={handleCheckType}>
				<div className={select.option} id='text'>{'填空题'}</div>
				<div className={select.option} id='single'>{'单选题'}</div>
				<div className={select.option} id='checkbox'>{'多选题'}</div>
				<div className={select.option} id='rating'>{'评分题'}</div>
				<div className={select.option} id='slider'>{'进度条'}</div>
				<div className={select.option} id='location'>{'定位'}</div>
				<div className={select.option} style={{cursor: 'not-allowed'}} id='select'>{'下拉框(暂不支持)'}</div>
			</Backdrop>
			{renderQue(chooseType)}
		</div>
	);
};

export default AddQue;