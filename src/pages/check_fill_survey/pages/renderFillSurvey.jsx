import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {RenderFillContext} from "../../../components/check&fill/context/renderFillContext";
import {quesDisplay} from "../../../components/check&fill/quesDisplay/quesDisplay";
import {useNavigate} from "react-router-dom";
import {SubmitCheckEmptyContext, TendToSubmitContext} from "../../../components/check&fill/context/submitCheckEmptyContext";
import {updateAnswer} from "../../../utils/updateAnswer";
import {getQueDetails} from "../../../utils/getQueDetails";
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'

const RenderFillSurvey = ({surveyId}) => {
	const surveyDetails = useContext(RenderFillContext).surveyData;
	const navigate = useNavigate();

	// 获取问卷对应questionsDetail
	const [questions, setQuestions] = useState([]);
	useEffect(() => {
		setQuestions([]);
		const getQues = async () => {
			// 创建所有请求的Promise数组
			const getQuesPromise = surveyDetails.questions.map(question => {
				return getQueDetails(question);
			});
			// 等待所有promise完成, 获取结果数组
			const results = await Promise.all(getQuesPromise);
			// 一次性更新questions
			const sortedQues = results.sort((a, b) => a.index - b.index);
			setQuestions(sortedQues);
		}
		getQues();
	}, [surveyDetails]);

	// 监控questions变化
	useEffect(() => {
		console.log('questions:----', questions);
	}, [questions]);

	// 获取需要渲染的问题组件
	const elements = quesDisplay(questions);


	// 取消填写问卷, 返回首页, 清空填写问卷时产生的 sessionStorage
	const handleCancel = useCallback(e => {
		e.preventDefault();
		sessionStorage.clear();
		alert('填写的信息将会消失');
		navigate('../published');
	}, [surveyDetails]);


	// 检查是否全部填写
	const allCompleted = useRef(false);
	const tendToSubmit = useRef(false);
	/*传递给每个问题组件的检查函数, 当存在任意一个组件未传递答案时, 设置allCompleted为false
	* @return bool, 该题是否完成填写
	* @accept`title` 问题标题
	* @accept`type` 问题类型*/
	const checkCompleted = useCallback((title, type) => {
		const data = JSON.parse(sessionStorage.getItem(title));
		switch (type) {
			case 'text':
			case 'location':
			case 'single':
			case 'checkbox': {
				if (data.answer.length === 0) {
					alert(`${title} 还没填就想交卷?`);
					allCompleted.current = false;
					tendToSubmit.current = false;
					return false;
				}
				allCompleted.current = true;
				tendToSubmit.current = true;
				return true;
			}
			case 'slider':
			case 'rating': {
				if (data.answer < 0) {
					alert(`${title} 不许打负分!`);
					allCompleted.current = false;
					tendToSubmit.current = false;
					return false
				}
				allCompleted.current = true;
				tendToSubmit.current = true;
				return true;
			}
			default: {
				allCompleted.current = false;
				tendToSubmit.current = false;
				return false;
			}
		}
	}, [surveyDetails]);
	// 用于控制子组件是否启动检查
	const submit = useCallback((e) => {
		e.preventDefault();
		tendToSubmit.current = true;
		// 派发检查事件
		window.dispatchEvent(new Event('submit-check'));
	}, [surveyDetails]);
	// 提交填写的问卷, 返回involved, 清空填写问卷产生的 sessionStorage
	const handleSubmit = useCallback(async (e) => {
		submit(e);
		if (allCompleted && tendToSubmit.current) {
			await updateAnswer(surveyId)
			sessionStorage.clear();
			navigate('../involved');
		}
	}, [surveyDetails]);


	return (
		<div className={involvedCheck.entire}>
			<header className={involvedCheck.headerSuggest}>
				<span>{'填写问卷'}</span>
			</header>
			<div className={involvedCheck.quesDisplayZone}>
				<header>
					<span>{surveyDetails.title}</span>
					<span>{surveyDetails.description}</span>
				</header>
				<SubmitCheckEmptyContext.Provider value={checkCompleted}>
					<TendToSubmitContext.Provider value={tendToSubmit}>
						<div>
							{elements}
						</div>
					</TendToSubmitContext.Provider>
				</SubmitCheckEmptyContext.Provider>
			</div>
			<div className={involvedCheck.btnBox}>
				<button onClick={handleCancel}>{'取消填写'}</button>
				<button onClick={handleSubmit}>{'提交'}</button>
			</div>
		</div>
	);
};

export default RenderFillSurvey;