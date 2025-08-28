import React, {useContext, useEffect, useState} from 'react';
import {InvolvedDataContext} from "./context/involvedDataContext";
import {getSurveyQues} from "../../utils/getSurveyQues";
import {RenderInvolvedEachContext} from "./context/renderInvolvedEachContext";
import RenderInvolvedEach from "./renderInvolvedEach";

const RenderInvolved = () => {
	sessionStorage.clear();
	const involvedData = useContext(InvolvedDataContext);

	// 获取填写过的问卷相关信息
	const [surveysDetails, setSurveysDetails] = useState([]);
	useEffect(() => {
		setSurveysDetails([]);

		async function fetchInvolvedSurveyDetail() {
			const details = [];
			for (let involved of involvedData) {
				const data = await getSurveyQues(involved.survey, false);
				details.push({survey: data, answer: involved.answer});
			}
			setSurveysDetails(details);
		}

		fetchInvolvedSurveyDetail();
	}, [involvedData]);


	return (
		<RenderInvolvedEachContext.Provider value={surveysDetails}>
			<RenderInvolvedEach/>
		</RenderInvolvedEachContext.Provider>
	);
};

export default RenderInvolved;