import React, {useContext, useState} from 'react';
import {RenderDraftsContext} from "./context/drafts";
import {useNavigate} from "react-router-dom";
import {updateUser} from "../../utils/updateUser";
import {getSurveyQues} from "../../utils/getSurveyQues";
import {getQueDetails} from "../../utils/getQueDetails";
import draftsDisplay from '../../style/draftsDisplay/draftsDisplay.module.css'
import Prompt from "../../ui/prompt/prompt";

const RenderDrafts = ({hasDraft}) => {
	// 鼠标移入移出控制按钮显示
	const [hoverId, setHoverId] = useState(null);


	// element参考信息
	const drafts = useContext(RenderDraftsContext);
	const elements = drafts.map(draft => {
		return {
			title: draft.title,
			description: draft.description,
			id: draft.id
		}
	});
	// 编辑跳转
	// 采用编程式导航
	const navigate = useNavigate()

	async function handleEditClick(e) {
		e.preventDefault();
		// 将问卷相关信息存入sessionStorage
		const data = drafts.filter(draft => draft.id === e.currentTarget.id)[0];
		sessionStorage.setItem('surveyTitleBefore', data.title);
		sessionStorage.setItem('surveyDescriptionBefore', data.description);
		sessionStorage.setItem('surveyTokenBefore', e.currentTarget.id);
		// 等待所有题目信息存入sessionStorage
		const queTokensBefore = [];
		await Promise.all(data.questions.map(async (question) => {
			const r = await getQueDetails(question);
			if (r) {
				sessionStorage.setItem(r.title, JSON.stringify(r));
			}
		}));
		data.questions.forEach(question => {
			queTokensBefore.push(question);
		})
		sessionStorage.setItem('queTokensBefore', JSON.stringify(queTokensBefore));
		// 跳转到publish
		navigate('../edit')
	}


	// 删除草稿
	async function handleDeleteDraft(e) {
		e.preventDefault();
		const surveyId = e.currentTarget.id;
		try {
			const resp = await fetch(`http://localhost:1337/api/clients/${localStorage.getItem('token')}`);
			const result = await resp.json();
			const surveys = result.data.surveys;
			// 移除原survey绑定的question
			const surveyResp = await fetch(`http://localhost:1337/api/surveys/${surveyId}`);
			const surveyResult = await surveyResp.json();
			const quesBefore = surveyResult.data.questions;
			for (const q of quesBefore) {
				const qresp = await fetch(`http://localhost:1337/api/quests/${q}`, {
					method: 'DELETE',
				});
				if (!qresp.ok) {
					console.error(`删除原问题失败: ${qresp.status}`);
				}
			}
			// 移除原survey
			const delSurveyResp = await fetch(`http://localhost:1337/api/surveys/${surveyId}`, {
				method: 'DELETE',
			});
			if (!delSurveyResp.ok) {
				console.error(`移除原survey失败: ${delSurveyResp.status}`);
			}
			// 移除绑定surveys中的原问卷id

			surveys.forEach((survey, index) => {
				if (survey.id === surveyId) {
					surveys.splice(index, 1);
				}
			});
			// 将移除了原surveyId的surveys覆盖给client
			await updateUser('surveys', surveys, true);

		} catch (err) {
			console.error(err);
		}
		// 刷新页面
		window.location.reload();
	}


	// 预览草稿
	async function handlePreview(e) {
		const surveyId = e.currentTarget.id;
		e.preventDefault();
		// title, description, id, questions[]
		const surveyDetails = await getSurveyQues(surveyId, true);
		// 将问卷相关信息存储到sessionStorage用于预览组件获取
		sessionStorage.setItem('surveyTitle', surveyDetails.title);
		sessionStorage.setItem('surveyDescription', surveyDetails.description);
		await Promise.all(surveyDetails.questions.map(async (question) => {
			const r = await getQueDetails(question);
			if (r) sessionStorage.setItem(`${r.title}`, JSON.stringify(r));
		}));
		// 显示预览组件
		navigate('./preview')
	}


	// 发布草稿
	const [finish, setFinish] = useState([]);

	async function handlePublishDraft(e) {
		e.preventDefault();
		const surveyId = e.currentTarget.id;
		const token = localStorage.getItem('token');
		// 更新surveys中相应survey的发布状态
		const pubResp = await fetch(`http://localhost:1337/api/surveys/${surveyId}`, {
			method: "PUT",
			headers: {
				"Content-Type": 'application/json',
			},
			body: JSON.stringify({data: {published: true, endCollection: false}})
		});
		if (!pubResp.ok) {
			console.error(`更新问卷主观发布状态失败: ${pubResp.status}`);
			return null;
		}
		// 获取用户绑定的所有survey
		const getResp = await fetch(`http://localhost:1337/api/clients/${token}`);
		if (!getResp.ok) {
			console.error(`更新问卷客观发布状态失败(获取阶段): ${getResp.status}`);
			return null;
		}
		const data = await getResp.json();
		const surveys = data.data.surveys;
		// 生成更新后的新数据
		for (let survey of surveys) {
			if (survey.id === surveyId) {
				survey.published = true;
			}
		}
		// 将更新状态后的新数据覆盖到原来的数据上
		await updateUser('surveys', surveys, true);
		setFinish([true, surveyId]);
	}


	// 草稿组件生成
	const elementsForRender = elements.map(element => (
		<fieldset key={element.id} id={element.id} onMouseEnter={e => setHoverId(e.currentTarget.id)}
							onMouseLeave={() => setHoverId(null)} className={draftsDisplay.eachDraft}>
			<div className={draftsDisplay.content}>
				<div>{element.title}</div>
				<div>{element.description}</div>
			</div>
			{hoverId === element.id && (
				<div className={draftsDisplay.btnBox}>
					<button onClick={handleEditClick} id={element.id}>{'编辑'}</button>
					<button onClick={handlePreview} id={element.id}>{'预览'}</button>
					<button onClick={handleDeleteDraft} id={element.id}>{'删除'}</button>
					<button onClick={handlePublishDraft} id={element.id}>{'发布'}</button>
				</div>
			)}
		</fieldset>
	))


	return (
		<>
			{finish.length !== 0 && <Prompt content={`http://localhost:3000/platform/survey/${finish[1]}`} title={'问卷填写链接'} copy={true} onClick={() => navigate('../published')}/>}
			<div className={draftsDisplay.entire}>
				<header className={draftsDisplay.draftsHeader}>{'全部草稿'}</header>
				{hasDraft ? (
					<div className={draftsDisplay.draftsDisplayZone}>
						{elementsForRender}
					</div>
				) : <h1 className={draftsDisplay.notFound}>{'暂无草稿, 快去编辑一份吧'}</h1>}
			</div>
		</>
	);
};

export default RenderDrafts;