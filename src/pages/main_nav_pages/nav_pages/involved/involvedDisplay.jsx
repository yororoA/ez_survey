import React, {useEffect, useState} from 'react';
import {getUserData} from "../../../../utils/getUserData";
import RenderInvolved from "../../../../components/involvedDisplay/renderInvolved";
import {InvolvedDataContext} from "../../../../components/involvedDisplay/context/involvedDataContext";
import involvedDisplay from '../../../../style/involvedDisplay/involvedDisplay.module.css'

const InvolvedDisplay = () => {
	const clientId = localStorage.getItem('token');
	const [involvedData, setInvolvedData] = useState(null);
	const [hasInvolved, setHasInvolved] = useState(false);
	// 获取用户参与并提交过的问卷
	useEffect(() => {
		getUserData().then(r => setInvolvedData(r.data.involved));
	}, [clientId]);
	// 检查是否存在参与并提交过的问卷
	useEffect(() => {
		if (involvedData == null) {
			setHasInvolved(false);
		} else {
			if (involvedData.length === 0) {
				setHasInvolved(false);
			} else {
				setHasInvolved(true)
			}
		}
	}, [involvedData]);


	return (
		<div className={involvedDisplay.entire}>
			<header className={involvedDisplay.involvedHeader}>{'参与过的问卷'}</header>
			<InvolvedDataContext.Provider value={involvedData}>
				{hasInvolved ? <RenderInvolved/> : <h1 className={involvedDisplay.notFound}>{'暂未填写并提交过问卷, 快去填写一份吧'}</h1>}
			</InvolvedDataContext.Provider>
		</div>
	);
};

export default InvolvedDisplay;