import React, {useCallback, useContext, useEffect, useState} from 'react';
import {RenderPublishedContext} from "./context/renderPublishedContext";
import {useLocation, useNavigate} from "react-router-dom";
import publishedDisplay from '../../style/publishedDisplay/publishedDisplay.module.css'
import Prompt from "../../ui/prompt/prompt";

const RenderPublished = ({hasPulished}) => {
	const publishedSurveys = useContext(RenderPublishedContext);
	const navigate = useNavigate();

	/* 查看详情 */
	async function handleCheck(e) {
		e.preventDefault();
		navigate(`../survey/${e.currentTarget.id}`);
	}


	/* 结束收集 */
	async function handleEndCollection(e) {
		e.preventDefault();
		// 更新数据库中相应 survey 的 endCollection
		const updateEndCollectionResp = await fetch(`http://localhost:1337/api/surveys/${e.currentTarget.id}`, {
			method: "PUT",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({data: {endCollection: true}})
		});
		if (!updateEndCollectionResp.ok) {
			console.error(`结束收集失败: ${updateEndCollectionResp.status}`);
			return null;
		}
		window.location.reload();
	}


	// 鼠标悬停相关功能
	const [hoverId, setHoverId] = useState(null);
	const handleMouseEnter = useCallback(e => {
		setHoverId(e.currentTarget.id);
	}, [hoverId]);
	const handleMouseLeave = useCallback(e => {
		setHoverId(null);
	}, [hoverId]);


	// 筛选
	const [node, setNode] = useState('initial')
	const [ended, setEnded] = useState(false);
	const location = useLocation();
	useEffect(() => {
		const pathnames = location.pathname.split('/');
		if (pathnames.includes('published')) {
			if (pathnames.at(-1) === 'ended') {
				setNode('ended');
				setEnded(true);
			} else if (pathnames.at(-1) === 'processing') {
				setNode('processing');
				setEnded(false);
			} else {
				setNode('initial')
			}
		}
	}, [location]);


	// 已发布组件生成
	const [finish, setFinish] = useState([]);
	const elements = publishedSurveys.map(survey => {
		return (
			<>
				{finish.length !== 0 && <Prompt onClick={() => setFinish([])} title={'问卷填写链接'} copy={true}
																				content={`http://localhost:3000/platform/survey/${finish[1]}`}/>}
				{(node === 'initial' ? true : (survey.endCollection ? ended : !ended)) && (
					<fieldset key={survey.id} id={survey.id} className={publishedDisplay.eachPublished}
										onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
						<div className={publishedDisplay.content}>
							<div>{survey.title}</div>
							<div>
								<span>{survey.description}</span>
								<div>
									<span id={survey.endCollection ? 'ended' : 'processing'}>
										{survey.endCollection ? '已结束: ' : '收集中: '}{`${survey.answers == null ? 0 : survey.answers.length}`}
									</span>
								</div>
							</div>
						</div>
						{hoverId === survey.id && (
							<div className={publishedDisplay.btnBox}>
								<button id={survey.id} onClick={handleCheck}>{'查看详情'}</button>
								{!survey.endCollection && (
									<>
										<button id={survey.id} onClick={handleEndCollection}>{'结束收集'}</button>
										<button onClick={() => setFinish([true, survey.id])}>{'分享'}</button>
									</>
								)}
							</div>
						)}
					</fieldset>
				)}
			</>
		)
	});
	console.log(elements);


	return (
		<div className={publishedDisplay.entire}>
			<header className={publishedDisplay.publishedHeader}>
				{node === 'initial' ? '全部已发布问卷' : (ended ? '已结束收集的问卷' : '收集中的问卷')}
			</header>
			{!hasPulished ? <h1 className={publishedDisplay.notFound}>{'暂无已发布的问卷, 快去编辑一份吧'}</h1> : (
				<div className={publishedDisplay.publishedDisplayZone}>
					{elements}
				</div>
			)}
		</div>
	)
		;
};

export default RenderPublished;