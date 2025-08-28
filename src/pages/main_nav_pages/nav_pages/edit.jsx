import React, {useCallback, useEffect, useRef, useState} from 'react';
import QuesList from "../../../components/editSurvey/quesList";
import AddQue from "../../../components/editSurvey/addQue";
import {GetTitleContext} from "../../../components/editSurvey/context/getTitleContext";
import {useCreateQueMutation, useSaveSurveyMutation, useUpdateSurveyMutation} from "../../../services/apis";
import {filterQueDetails} from "../../../components/editSurvey/filterQueDetails";
import {
	CancelEditContext,
	ConfirmEditContext,
	EditingQueContext, InitialDataContext,
	IsEditingContext,
	ReEditQueContext
} from "../../../components/editSurvey/context/reEditQueContext";
import {updateUser} from "../../../utils/updateUser";
import {useNavigate} from "react-router-dom";
import edit from '../../../style/edit/edit.module.css'
import Prompt from "../../../ui/prompt/prompt";


const Edit = () => {
	const navigate = useNavigate();
	// 监测是否正在添加某个问题
	const [adding, setAdding] = useState(false);
	// 正在添加的问题信息
	const [addingTitle, setAddingTitle] = useState({});
	// 是否添加完毕
	const [addComplete, setAddComplete] = useState(false);
	//  问题列表
	const [ques, setQues] = useState([]);
	// 检测是否保存或发布
	const [draftOrPublish, setDraftOrPublish] = useState(false);

	// 从草稿页面点击编辑跳转到publish时
	// 检测sessionStorage中是否存在需要编辑的键值对, 若为null则不是从草稿页面跳转过来的
	const storageSurveyTitle = sessionStorage.getItem('surveyTitleBefore');
	const storageSurveyDescription = sessionStorage.getItem('surveyDescriptionBefore');
	const isFromDrafts = (storageSurveyTitle !== null || storageSurveyDescription !== null);

	// 问卷标题
	const [surveyTitle, setSurveyTitle] = useState(isFromDrafts ? storageSurveyTitle : '');
	// 问卷描述
	const [surveyDescr, setSurveyDescr] = useState(isFromDrafts ? storageSurveyDescription : '');
	useEffect(() => {
		if (isFromDrafts) { // 如果跳转自drafts的编辑link
			const nums = sessionStorage.length; // 相应draft从服务器拉取到本地的数据数目
			const questionDatas = [];
			for (let i = 0; i < nums; i++) {
				// 读取每个数据的key, 若为题目key则存储在列表中, 用于之后上传给ques
				const key = sessionStorage.key(i);
				if (key === 'surveyTitleBefore' || key === 'surveyDescriptionBefore' || key === 'surveyTokenBefore' || key === 'queTokensBefore') {
					continue;
				}
				const data = JSON.parse(sessionStorage.getItem(key));
				questionDatas.push(data);
			}
			// 将data按index升序排序
			questionDatas.sort((a, b) => a.index - b.index);
			// 将所需数据传递给ques
			const questions = [];
			questionDatas.forEach(data => {
				questions.push({title: data.title, type: data.type});
			});
			setQues(questions);
		}
	}, [isFromDrafts]);

	// 问卷标题
	const handleTitleChange = useCallback(e => {
		const newTitle = e.target.value;
		setSurveyTitle(newTitle);
		// 将标题存储到 sessionStorage
		sessionStorage.setItem('surveyTitle', newTitle);
	}, []);
	// 问卷描述
	const handleDescrChange = useCallback(e => {
		const newDescr = e.target.value;
		setSurveyDescr(newDescr);
		// 将描述存储到 sessionStorage
		sessionStorage.setItem('surveyDescription', newDescr);
	}, [])

	// 添加问题
	const handleAddQue = useCallback((e) => {
		e.preventDefault();
		setAdding(true);
		setAddComplete(false);
		setDraftOrPublish(false);
		// 清除上一次草稿中保存的题目title, 避免因取消空标题的添加造成的清除前一个sessionStorage
		setAddingTitle({title: '', id: Date.now()});
	}, [adding, addComplete]);
	// 获得问题 title 用于定位 sessionStorage 中的存储
	// 草稿---未确认添加
	function draftTitle(title) {
		console.log(title);
		// 将获得的标题传给 addingTitle, 即正在使用的标题
		setAddingTitle({title, id: Date.now()});
	}

	// 确认添加---保存问题->ques
	function saveTitle() {
		if (addingTitle.title.length !== 0) {
			const queType = JSON.parse(sessionStorage.getItem(addingTitle.title)).type;
			setQues([...ques, {...addingTitle, type: queType}]);
		} else {
			alert('问题内容不可为空')
		}
	}

	// 确认添加
	const handleCompleteQue = e => {
		e.preventDefault();
		// 检查题目信息
		const raw = sessionStorage.getItem(addingTitle.title);
		if (!raw) {
			alert('请先完善题目内容');
			return;
		}
		const data = JSON.parse(raw);
		const type = data?.type;
		// 检查是否存在空选项（含仅空白）或没有选项
		if (type === 'single' || type === 'checkbox') {
			const options = Array.isArray(data.options) ? data.options : [];
			const hasEmpty = options.some(opt => {
				if (!opt) return true;
				const content = typeof opt.content === 'string' ? opt.content.trim() : '';
				return content.length === 0;
			});
			if (options.length === 0 || hasEmpty) {
				alert('选项内容不可为空');
				return;
			}
			saveTitle();
			setAdding(false);
			setAddComplete(true);
			return;
		}
		saveTitle();
		setAdding(false);
		setAddComplete(true);
	};


	// 取消添加
	const handleCancel = useCallback(e => {
		e.preventDefault();
		setAdding(false);
		setAddComplete(false);
		setDraftOrPublish(false);
		// 取消添加时移除sessionStorage中存储的临时信息
		sessionStorage.removeItem(addingTitle.title);
		// 清空当前问题草稿
		setAddingTitle({});
	}, [adding, addComplete, addingTitle])


	// 编辑问题
	const [queToEdit, setQueToEdit] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [edintType, setEdingType] = useState(null);
	const [editCompleted, setEditCompleted] = useState(false);
	const [initialData, setInitialData] = useState(null);
	const lastEditTitle = useRef('');

	/*
	* 编辑问题
	* @title 需要编辑的问题title
	* @deleteOrEdit Bool, true:delete, false:edit*/
	function editQue(title, delteOrEdit) {
		// 删除问题
		if (delteOrEdit) {
			setQues(prevQues => prevQues.filter(que => que.title !== title));
			sessionStorage.removeItem(title);
			setIsEditing(false);
			setQueToEdit('');
			return;
		}
		// 编辑问题
		// 需要编辑的问题
		const data = JSON.parse(sessionStorage.getItem(title));
		console.log('点击编辑前的数据------', data);
		const type = data.type;
		setQueToEdit(title);
		setIsEditing(true);
		setEdingType(type)
		// 将点击编辑前的数据保留下来
		setInitialData(data);
		lastEditTitle.current = title;
	}

	/*
	* 确认编辑
	* */
	function confirmEdit(title) {
		setQueToEdit(title);
		setIsEditing(false);
		setEditCompleted(true);
		// 更新 ques
		const newQues = ques;
		newQues.forEach(que => {
			if (que.title === lastEditTitle.current) {
				que.title = title;
				que.type = edintType;
			}
		})
		setQues(newQues);
	}

	/*
	* 取消编辑
	* */
	function cancelEdit() {
		setQueToEdit('');
		setIsEditing(false);
		setEditCompleted(true);
		// 重传 ques
		setQues(ques);
	}

	// 将survey保存到草稿
	const [doSaveDraft, {}] = useSaveSurveyMutation();
	const [doSaveDraftQue, {}] = useCreateQueMutation();
	const [doUpdateDraft, {}] = useUpdateSurveyMutation();

	async function saveDraft(e) {
		e.preventDefault();
		// 1. 先上传survey的基础信息
		const data = {
			attributes: {
				title: surveyTitle,
				description: surveyDescr,
				clientId: localStorage.getItem('token'),
				published: false
			}
		};
		if (!ques[0] || !surveyTitle || !surveyDescr) {
			alert('问题不可为空!');
			return;
		}
		try {
			const resp = await doSaveDraft(data).unwrap();
			console.log('保存问卷成功', resp);
			// 将surveyToken临时储存在本地, 用于问题上传的绑定
			sessionStorage.setItem('tempSurveyToken', resp.data.documentId);
		} catch (err) {
			console.log('保存draft失败', err);
		}
		const surveyToken = sessionStorage.getItem('tempSurveyToken');
		// 将该survey绑定给创建问卷的用户
		await updateUser('surveys', {id: surveyToken, published: false}, false);
		// 2. 上传问题信息并绑定survey
		sessionStorage.removeItem(''); // 移除会话存储中的空白token
		const queTokens = [];
		for (const [index, que] of ques.entries()) {
			const detail = filterQueDetails(que, index, surveyToken);
			if (!detail) continue;
			try {
				const resp = await doSaveDraftQue(detail).unwrap();
				console.log('保存问题成功', resp);
				// 将queToken保存在数组中, 用于后续更新survey中的questions
				queTokens.push(resp.data.documentId);
			} catch (err) {
				console.log('保存问题失败', err);
			}
		}
		// 3. 更新survey中的questions
		data.attributes.questions = JSON.stringify(queTokens);
		try {
			const resp = await doUpdateDraft(data).unwrap();
			console.log('绑定问题成功', resp);
		} catch (err) {
			console.log('绑定问题失败', err);
		}
		// 3.5 移除原来的draft相关内容
		if (isFromDrafts) {
			try {
				const resp = await fetch(`http://localhost:1337/api/clients/${localStorage.getItem('token')}`);
				const result = await resp.json();
				console.log(result);
				const surveys = result.data.surveys;
				const surveyTokenBefore = sessionStorage.getItem('surveyTokenBefore');
				// 移除原survey绑定的question
				const surveyResp = await fetch(`http://localhost:1337/api/surveys/${surveyTokenBefore}`);
				const surveyResult = await surveyResp.json();
				const quesBefore = surveyResult.data.questions;
				for (const q of quesBefore) {
					const qresp = await fetch(`http://localhost:1337/api/quests/${q}`, {
						method: 'DELETE',
					});
					if (!resp.ok) {
						console.error(`删除原问题失败: ${resp.status}`);
					}
				}
				// 移除原survey
				const delSurveyResp = await fetch(`http://localhost:1337/api/surveys/${surveyTokenBefore}`, {
					method: 'DELETE',
				});
				if (!delSurveyResp.ok) {
					console.error(`移除原survey失败: ${delSurveyResp.status}`);
				}
				// 移除绑定surveys中的原问卷id

				surveys.forEach((survey, index) => {
					if (survey.id === surveyTokenBefore) {
						surveys.splice(index, 1);
					}
				});
				// 将移除了原surveyId的surveys覆盖给client
				await updateUser('surveys', surveys, true);

			} catch (err) {
				console.error(err);
			}
		}


		// 4. 清除创建问卷产生的会话存储, 以免影响后续使用
		sessionStorage.clear();
		setDraftOrPublish(true);
		// // 直接刷新页面, 绕开因清理sessionStorage可能造成的null错误
		// window.location.reload();
		navigate('../draft');
	}

	// 取消问卷
	function cancelSurvey(e) {
		e.preventDefault();
		// 清除创建问卷产生的会话存储, 以免影响后续使用
		sessionStorage.clear();
		// 清理缓存
		setQues([]);
		setSurveyTitle('');
		setSurveyDescr('');
		if (isFromDrafts) navigate('../draft');
	}


	// 发布问卷
	const [finish, setFinish] = useState([]);

	async function publishSurvey(e) {
		e.preventDefault();
		// 1. 先上传survey的基础信息
		const data = {
			attributes: {
				title: surveyTitle,
				description: surveyDescr,
				clientId: localStorage.getItem('token'),
				published: true,
				endCollection: false
			}
		};
		if (!ques[0] || !surveyTitle || !surveyDescr) {
			alert('问题不可为空!');
			return;
		}
		try {
			const resp = await doSaveDraft(data).unwrap();
			console.log('保存问卷成功', resp);
			// 将surveyToken临时储存在本地, 用于问题上传的绑定
			sessionStorage.setItem('tempSurveyToken', resp.data.documentId);
		} catch (err) {
			console.log('保存draft失败', err);
		}
		const surveyToken = sessionStorage.getItem('tempSurveyToken');
		// 将该survey绑定给创建问卷的用户
		await updateUser('surveys', {id: surveyToken, published: true}, false);
		// 2. 上传问题信息并绑定survey
		sessionStorage.removeItem(''); // 移除会话存储中的空白token
		const queTokens = [];
		for (const [index, que] of ques.entries()) {
			const detail = filterQueDetails(que, index, surveyToken);
			if (!detail) continue;
			try {
				const resp = await doSaveDraftQue(detail).unwrap();
				console.log('保存问题成功', resp);
				// 将queToken保存在数组中, 用于后续更新survey中的questions
				queTokens.push(resp.data.documentId);
			} catch (err) {
				console.log('保存问题失败', err);
			}
		}
		// 3. 更新survey中的questions
		data.attributes.questions = JSON.stringify(queTokens);
		try {
			const resp = await doUpdateDraft(data).unwrap();
			console.log('绑定问题成功', resp);
		} catch (err) {
			console.log('绑定问题失败', err);
		}
		// 3.5 移除原来的draft相关内容
		if (isFromDrafts) {
			try {
				const resp = await fetch(`http://localhost:1337/api/clients/${localStorage.getItem('token')}`);
				const result = await resp.json();
				console.log(result);
				const surveys = result.data.surveys;
				const surveyTokenBefore = sessionStorage.getItem('surveyTokenBefore');
				// 移除原survey绑定的question
				const surveyResp = await fetch(`http://localhost:1337/api/surveys/${surveyTokenBefore}`);
				const surveyResult = await surveyResp.json();
				const quesBefore = surveyResult.data.questions;
				for (const q of quesBefore) {
					const qresp = await fetch(`http://localhost:1337/api/quests/${q}`, {
						method: 'DELETE',
					});
					if (!resp.ok) {
						console.error(`删除原问题失败: ${resp.status}`);
					}
				}
				// 移除原survey
				const delSurveyResp = await fetch(`http://localhost:1337/api/surveys/${surveyTokenBefore}`, {
					method: 'DELETE',
				});
				if (!delSurveyResp.ok) {
					console.error(`移除原survey失败: ${delSurveyResp.status}`);
				}
				// 移除绑定surveys中的原问卷id

				surveys.forEach((survey, index) => {
					if (survey.id === surveyTokenBefore) {
						surveys.splice(index, 1);
					}
				});
				// 将移除了原surveyId的surveys覆盖给client
				await updateUser('surveys', surveys, true);

			} catch (err) {
				console.error(err);
			}
		}


		// 4. 清除创建问卷产生的会话存储, 以免影响后续使用
		sessionStorage.clear();
		setDraftOrPublish(true);
		// // 直接刷新页面, 绕开因清理sessionStorage可能造成的null错误
		// window.location.reload();

		// 跳出填写链接
		setFinish([true, surveyToken]);
	}

	return (
		<>
			{finish.length!==0 && (
				<Prompt copy={true} title={'问卷填写链接'} content={`http://localhost:3000/platform/survey/${finish[1]}`} onClick={()=>{navigate('../published')}}/>
			)}
			<div className={edit.entire}>
				<header>
					<div className={edit.summaries}>
						<input onChange={handleTitleChange} type="text" value={surveyTitle} placeholder={'请输入问卷标题'}/>
						<input onChange={handleDescrChange} type="text" value={surveyDescr} placeholder={'请输入问卷描述'}/>
					</div>
					<div className={edit.headerButtonBox}>
						<button onClick={saveDraft} style={{
							backgroundColor: 'transparent'
						}}>{'保存草稿'}</button>
						<div className={edit.rightBtns}>
							<button onClick={publishSurvey} style={{
								color: "black"
							}}>{'发布问卷'}</button>
							{!!sessionStorage.length && <button onClick={cancelSurvey} style={{
								backgroundColor: '#ff760e'
							}}>{'取消'}</button>}
						</div>
					</div>
				</header>
				<div className={edit.quesDisplayZone}>
					<header>{'问卷编辑'}</header>
					<GetTitleContext.Provider value={draftTitle}>
						<ConfirmEditContext.Provider value={confirmEdit}>
							<CancelEditContext.Provider value={cancelEdit}>
								<InitialDataContext.Provider value={initialData}>
									<ReEditQueContext.Provider value={editQue}>
										<IsEditingContext.Provider value={isEditing}>
											<EditingQueContext.Provider value={queToEdit}>
												{!draftOrPublish &&
													<QuesList ques={ques} editingType={edintType} editCompleted={editCompleted}/>}
											</EditingQueContext.Provider>
										</IsEditingContext.Provider>
									</ReEditQueContext.Provider>
									<div>
										{!adding && <button onClick={handleAddQue}>{'添加问题'}</button>}
										{adding && (
											<>
												{/* 使用context传递获取标题的函数 */}
												{/* 存储到草稿中, 确认添加时通过handleCompleteQue将问题存储到ques, 取消时通过handleCancel移除草稿 */}
												<AddQue/>
												<button onClick={handleCompleteQue} style={{
													backgroundColor: 'rgba(69,136,251,0.8)'
												}}>{'确认'}</button>
												<button onClick={handleCancel}>{'取消'}</button>
											</>
										)}
									</div>
								</InitialDataContext.Provider>
							</CancelEditContext.Provider>
						</ConfirmEditContext.Provider>
					</GetTitleContext.Provider>
				</div>
			</div>
		</>
	);
};

export default Edit;