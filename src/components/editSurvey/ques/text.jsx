import React, {useCallback, useContext, useRef, useState} from 'react';
import {GetTitleContext} from "../context/getTitleContext";
import {
	CancelEditContext,
	ConfirmEditContext,
	EditingQueContext,
	InitialDataContext,
	IsEditingContext
} from "../context/reEditQueContext";

const Text = () => {
	// edit
	const isEditing = useContext(IsEditingContext);
	const editingQue = useContext(EditingQueContext);
	// 存储问题内容
	const [question, setQuestion] = useState(isEditing ? editingQue : '');
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
			type: 'text'
		};
		sessionStorage.setItem(`${quesTitle}`, JSON.stringify(data));
		// 将问题标题返回给publish
		getTitle(quesTitle);
	}, [question]);


	// 编辑问题
	const confirmEdit = useContext(ConfirmEditContext);
	const cancelEdit = useContext(CancelEditContext);
	const initialData = useContext(InitialDataContext);

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
			<input onChange={handleQuestionChange} type="text" value={question}
						 placeholder={'请输入问题内容'}/>
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

export default Text;