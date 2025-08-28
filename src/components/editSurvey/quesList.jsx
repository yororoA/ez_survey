import React, {useContext} from 'react';
import {getDisplayElements} from "./quesPreview/getDisplayElements";
import {renderQue} from "./renderQue";
import {EditingQueContext, IsEditingContext} from "./context/reEditQueContext";

const QuesList = ({ques, editingType, editCompleted}) => {
	const isEditing = useContext(IsEditingContext);
	const editingQue = useContext(EditingQueContext);
	const quesFront = [];
	const quesBehind = [];
	let index = null;
	if (isEditing) {
		ques.forEach((que, ind) => {
			if (que.title === editingQue) {
				index = ind;
			}
		});
		ques.forEach((que, ind) => {
			if (index === 0) {
				if (que.title !== editingQue) {
					quesBehind.push(que);
				}
			} else if (index === ques.length) {
				if (que.title !== editingQue) {
					quesFront.push(que);
				}
			} else {
				if (que.title !== editingQue && ind < index) {
					quesFront.push(que);
				} else if (que.title !== editingQue && ind > index) {
					quesBehind.push(que);
				}
			}
		});
	}

	const elements = getDisplayElements(ques);

	return (
		<div>
			{!isEditing && elements}
			{isEditing && (
				<>
					{getDisplayElements(quesFront)}
					{renderQue(editingType)}
					{getDisplayElements(quesBehind)}
				</>
			)}
		</div>
	);
};

export default QuesList;