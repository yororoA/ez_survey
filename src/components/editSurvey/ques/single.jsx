import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {GetTitleContext} from "../context/getTitleContext";
import {
	CancelEditContext,
	ConfirmEditContext,
	EditingQueContext,
	InitialDataContext,
	IsEditingContext
} from "../context/reEditQueContext";

const Single = () => {
	// edit
	const isEditing = useContext(IsEditingContext);
	const editingQue = useContext(EditingQueContext);
	const initialData = useContext(InitialDataContext);
	const confirmEdit = useContext(ConfirmEditContext);
	const cancelEdit = useContext(CancelEditContext);
	// 存储问题内容
	const [question, setQuestion] = useState(isEditing ? editingQue : '');
	// 存储选项列表, [{id, content}]
	const [options, setOptions] = useState(isEditing ? initialData.options : []);
	// 当前选项编号, 1 -> A
	const [optionIndex, setOptionIndex] = useState(isEditing ? initialData.options.length + 1 : 1);

	// 问题输入
	// 获取返回标题的函数
	const getTitle = useContext(GetTitleContext);
	// 每次修改标题时的上一个标题
	const lastTitle = useRef(question);
	const handleQuestionChange = useCallback(e => {
		const quesTitle = e.target.value;
		// 清除上一次的会话内存
		if (lastTitle.current) {
			sessionStorage.removeItem(lastTitle.current);
		}
		lastTitle.current = quesTitle
		setQuestion(quesTitle);
		// ...sessionStorage
		const data = {
			title: quesTitle,
			options,
			type: 'single'
		};
		sessionStorage.setItem(`${quesTitle}`, JSON.stringify(data));
		// 将问题标题返回给publish
		getTitle(quesTitle);
	}, [options]);

	// 添加新选项
	const addOption = useCallback(e => {
		e.preventDefault();
		// 选项标识 A,B,C,...
		const label = String.fromCharCode(optionIndex + 64);
		// 选项编号递增, 用于下次生成新标识, 函数式更新避免依赖optionIndex
		setOptionIndex(prevIndex => prevIndex + 1);
		// 	添加新选项到数组, 初始为空
		const newOptions = [...options, {id: label, content: ''}];
		setOptions(newOptions);
		// ...sessionStorage
		const data = {
			title: question,
			options: newOptions,
			type: 'single'
		}
		sessionStorage.setItem(`${question}`, JSON.stringify(data));
	}, [question, options]);

	// 选项内容变化
	const handleOptionChange = useCallback((e) => {
		// 更新对应选项内容
		// console.log(e.target.value)
		const id = e.target.id;
		// 若选项id相同则更新content
		const newOptions = options.map(option => option.id === id ? {...option, content: e.target.value} : option);
		setOptions(newOptions);
		// ...sessionStorage
		const data = {
			title: question,
			options: newOptions,
			type: 'single'
		}
		sessionStorage.setItem(`${question}`, JSON.stringify(data));
	}, [question, options]);


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

	useEffect(() => {
		// console.log(options);
	}, [options])


	return (
		<div>
			<input onChange={handleQuestionChange} value={question} placeholder={'请输入问题'}/>
			{/* 选项列表 */}
			<div>
				{options.map(
					(option, index) => (
						<div key={option.id}>
							<span>{option.id}</span>
							<input type="text" id={option.id} value={option.content} onChange={handleOptionChange}
										 placeholder={'请输入内容'}/>
						</div>
					))}
			</div>
			<button onClick={addOption}>添加选项</button>
			{isEditing && (
				<>
					<br/>
					<button onClick={handleConfirmEdit}> {'确认'}</button>
					<button onClick={handleCancelEdit}>{'取消'}</button>
				</>
			)}
		</div>
	);
};

export default Single;