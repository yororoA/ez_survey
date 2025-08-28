import React, {useEffect, useState} from 'react';
import {getUserSurveys} from "../../../../utils/getUserSurveys";
import {RenderDraftsContext} from "../../../../components/draftsDisplay/context/drafts";
import RenderDrafts from "../../../../components/draftsDisplay/renderDrafts";

const DraftDisplay = () => {
	sessionStorage.clear();
	// 获取用户保存在草稿的问卷
	const [drafts, setDrafts] = useState([]);


	// 是否存在草稿
	const [hasDraft, setHasDraft] = useState(false);
	// 将副作用移动到 useEffect 中，并在卸载时中断请求
	useEffect(() => {
		let mounted = true;
		const ac = new AbortController();
		const token = localStorage.getItem('token');

		if (!token) {
			setHasDraft(false);
			return () => {};
		}

		fetch(`http://localhost:1337/api/clients/${token}`, { signal: ac.signal })
			.then(resp => {
				if (!resp.ok) {
					throw new Error(`获取用户数据失败: ${resp.status}`);
				}
				return resp.json();
			})
			.then(data => {
				if (!mounted) return;
				const noSurveys = data?.data?.surveys == null || data.data.surveys.length === 0;
				if (noSurveys) {
					setHasDraft(false);
					return;
				}
				const surveys = data.data.surveys.filter(survey => survey.published === false);
				setHasDraft(surveys != null && surveys.length > 0);
			})
			.catch(err => {
				if (err?.name === 'AbortError') return; // 组件卸载，忽略
				console.error(err);
				if (mounted) setHasDraft(false);
			});

		return () => {
			mounted = false;
			ac.abort();
		};
	}, []);


		useEffect(() => {
			let mounted = true;
			// 获取草稿中问卷
			if (hasDraft) {
				getUserSurveys(true).then(r => {
					if (mounted) setDrafts(r);
				}).catch(err => console.error(err));
			} else {
				setDrafts([]);
			}
			return () => { mounted = false; };
		}, [hasDraft]);


	return (
		<RenderDraftsContext.Provider value={drafts}>
			<RenderDrafts hasDraft={hasDraft}/>
		</RenderDraftsContext.Provider>
	);
};

export default DraftDisplay;