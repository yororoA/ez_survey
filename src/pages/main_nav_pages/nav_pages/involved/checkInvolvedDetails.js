import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getAnswerDetailsByAnswerId} from "../../../../utils/getAnswerDetailsByAnswerId";
import {getSurveyQues} from "../../../../utils/getSurveyQues";
import {getQueDetails} from "../../../../utils/getQueDetails";
import {
	AnswersDetailsContext,
	QuesDetailsBoundedContext, SurveyOverviewContext
} from "../../../../components/involvedDisplay/context/renderChecked";
import RenderCheck from "../../../../components/involvedDisplay/renderCheck";

const CheckInvolvedDetails = () => {
	const {answerId} = useParams();
	const [answerDetails, setAnswerDetails] = useState([]);
	const [surveyOverview, setSurveyOverview] = useState({});
	const [surveyBoundedQuesBounded, setSurveyQuesBounded] = useState([]);

	useEffect(() => {
		// 获取填写的answer内容
		getAnswerDetailsByAnswerId(answerId).then(r => {
			// 将answers按index排序, 便于问题读取答案
			const answers = r.answers.sort((a, b) => a.index - b.index);
			setAnswerDetails(answers);

			// 获取与answer相关的问卷绑定的问题id
			getSurveyQues(r.surveyId, false).then(rb => {
				// 将survey的基础信息存入
				setSurveyOverview({title: rb.title, description: rb.description});

				const questions = rb.questions;

				// 获取问题内容
				async function fetchQueDetails() {
					const promises = questions.map((question) => getQueDetails(question));
					const results = await Promise.all(promises);
					// 将questions按index排序, 以供与答案进行匹配
					setSurveyQuesBounded(results.sort((a, b) => a.index - b.index));
				}

				fetchQueDetails();
			})

		});
	}, [answerId]);


	return (
		<div>
			<AnswersDetailsContext.Provider value={answerDetails}>
				<QuesDetailsBoundedContext.Provider value={surveyBoundedQuesBounded}>
					<SurveyOverviewContext.Provider value={surveyOverview}>
						<RenderCheck/>
					</SurveyOverviewContext.Provider>
				</QuesDetailsBoundedContext.Provider>
			</AnswersDetailsContext.Provider>
		</div>
	);
};

export default CheckInvolvedDetails;