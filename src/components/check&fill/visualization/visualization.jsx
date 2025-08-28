import React, {useContext, useMemo} from 'react';
import {AnswersInfosContext, QuesBaseInfosContext} from "../context/visualizationContext";
import {renderEachVisualization} from "./renderEachVisualization";

const Visualization = () => {
	const questions = useContext(QuesBaseInfosContext);
	const answers = useContext(AnswersInfosContext);

	// 基于 questions 派生渲染结果，避免在 effect 中 setState 导致的无限更新
	const elements = useMemo(() => {
		if (!questions) return null;
		return renderEachVisualization(questions);
	}, [questions]);


	return (
		<>
			{(questions !== null) && (
				<>
					{elements}
				</>
			)}
		</>
	);
};

export default Visualization;