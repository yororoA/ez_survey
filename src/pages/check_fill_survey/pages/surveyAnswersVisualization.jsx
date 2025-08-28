import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getSurveyQues} from "../../../utils/getSurveyQues";
import {getQueDetails} from "../../../utils/getQueDetails";
import {getAnswerDetailsByAnswerId} from "../../../utils/getAnswerDetailsByAnswerId";
import {AnswersInfosContext, QuesBaseInfosContext} from "../../../components/check&fill/context/visualizationContext";
import Visualization from "../../../components/check&fill/visualization/visualization";
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'


// 可视分析页面
const SurveyAnswersVisualization = () => {
	// 返回published
	const navigate = useNavigate();
	const backToPublished = e => {
		e.preventDefault();
		navigate('../published');
	}

	// 获取问卷对应的 基础信息, 题目信息, 所有收集到的问卷反馈
	const {surveyId} = useParams();
	const [surveyBaseInfo, setSurveyBaseInfo] = useState(null);
	const [quesBaseInfo, setQuesBaseInfo] = useState(null);
	const [answers, setAnswers] = useState(null);
	const [allFetched, setAllfetched] = useState(false);
	useEffect(() => {
		// 获取问卷基础信息
		getSurveyQues(surveyId, false).then(r1 => {
			setSurveyBaseInfo({title: r1.title, description: r1.description});

			// 获取问卷的题目信息
			(async () => {
				const quesPromises = r1.questions.map(question => getQueDetails(question));
				const results = await Promise.all(quesPromises);
				setQuesBaseInfo(results.sort((a, b) => a.index - b.index));
			})();

			// 获取所有Answer
			(async () => {
				if (r1.answers !== null) {
					const answersPromises = r1.answers.map(answer => getAnswerDetailsByAnswerId(answer));
					const results = await Promise.all(answersPromises);
					const datas = results.map(data => {
						return data.answers.sort((a, b) => a.index - b.index);
					});
					setAnswers(datas);
				}
			})();

			setAllfetched(true);
		});
	}, [surveyId]);


	return (
		<>
			{!allFetched ? <h1>{'获取数据中...'}</h1> : (
				<QuesBaseInfosContext.Provider value={quesBaseInfo}>
					<AnswersInfosContext.Provider value={answers}>
						<div className={involvedCheck.entire}>
							<header className={involvedCheck.headerSuggest}>
								<span>{'可视化'}</span>
								<span>{'目前只支持 单选/多选/进度条/打分 题的可视化分析'}</span>
							</header>
							<div className={involvedCheck.quesDisplayZone}>
								<header>
									<span>{surveyBaseInfo.title}</span>
									<span>{surveyBaseInfo.description}</span>
								</header>
								<div>
									<Visualization/>
								</div>
							</div>
							<button onClick={backToPublished}>{'返回'}</button>
						</div>
					</AnswersInfosContext.Provider>
				</QuesBaseInfosContext.Provider>
			)}
		</>
	);
};

export default SurveyAnswersVisualization;