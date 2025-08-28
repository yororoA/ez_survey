import React, {useCallback, useContext, useRef, useState} from 'react';
import {GetTitleContext} from "../context/getTitleContext";
import {
	CancelEditContext,
	ConfirmEditContext,
	EditingQueContext,
	InitialDataContext,
	IsEditingContext
} from "../context/reEditQueContext";

const Rating = () => {
	// edit
	const isEditing = useContext(IsEditingContext);
	const editingQue = useContext(EditingQueContext);
	const initialData = useContext(InitialDataContext);
	const confirmEdit = useContext(ConfirmEditContext);
	const cancelEdit = useContext(CancelEditContext);
	// 存储问题内容
	const [question, setQuestion] = useState(isEditing ? editingQue : '');
	// 存储最大值, 默认为100
	const [max, setMax] = useState(isEditing ? initialData.max : 100);
	// 存储步长, 默认为5
	const [step, setStep] = useState(isEditing ? initialData.step : 5);
	// 获取返回标题的函数
	const getTitle = useContext(GetTitleContext);
	// 每次修改标题时的上一个标题
	const lastTitle = useRef(question);

	// 标题输入
	const handleTitleChange = useCallback(e => {
		const newTitle = e.target.value;
		// 清除可能存在的属于title的上一次sessionStorage
		if (lastTitle.current) {
			sessionStorage.removeItem(lastTitle.current);
		}
		lastTitle.current = newTitle;
		setQuestion(newTitle);
		// 将标题存储到sessionStorage
		const data = {
			title: newTitle,
			max,
			step,
			type: 'rating'
		};
		sessionStorage.setItem(`${newTitle}`, JSON.stringify(data));
		// 将新标题返回给publish
		getTitle(newTitle);
	}, [question, max, step]);

	// 最大值输入
	const handleMaxChange = useCallback(e => {
		const newMax = e.target.value ? e.target.value : 100;
		setMax(newMax);
		// ...sessionStorage
		const data = {
			title: question,
			max: newMax,
			step,
			type: 'rating'
		};
		sessionStorage.setItem(`${question}`, JSON.stringify(data));
	}, [question, max, step]);

	// 步长输入
	const handleStepChange = useCallback(e => {
		const newStep = e.target.value ? e.target.value : 5;
		setStep(newStep);
		// ...sessionStorage
		const data = {
			title: question,
			max,
			step: newStep,
			type: 'rating'
		};
		sessionStorage.setItem(`${question}`, JSON.stringify(data));
	}, [question, max, step])


	// 确认编辑
	function handleConfirmEdit(e) {
		e.preventDefault();
		sessionStorage.removeItem('');
		confirmEdit(question);
	}

	// 取消编辑
	function handleCancelEdit(e) {
		e.preventDefault();
		sessionStorage.removeItem('');
		sessionStorage.removeItem(question);
		sessionStorage.setItem(editingQue, JSON.stringify(initialData));
		cancelEdit();
	}

	return (
		<div>
			<input onChange={handleTitleChange} type="text" value={question} placeholder={'请输入问题'}/><br/>
			<input onChange={handleMaxChange} type="number" value={max} placeholder={'请输入最大值(默认100)'}/>{'请输入最大值(默认100)'}<br/>
			<input onChange={handleStepChange} type="number" value={step} placeholder={'请输入滑动步长(默认5)'}/>{'请输入步长(默认5)'}
			{isEditing && (
				<>
					<br/>
					<button onClick={handleConfirmEdit}>{'确认'}</button>
					<button onClick={handleCancelEdit}>{'取消'}</button>
				</>
			)}
		</div>
	);
};

export default Rating;