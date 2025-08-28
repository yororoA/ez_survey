import React from 'react';
import { useNavigate } from "react-router-dom";
import homeStyles from '../../style/home/home.module.css'

const Home = () => {
	const navigate = useNavigate();

	const navigateTo = e => {
		e.preventDefault();
		navigate(`./platform/${e.target.id}`);
	}


	return (
		<div className={homeStyles.entire}>
			<div className={homeStyles.edit}>
				<div>{'在线问卷系统'}</div>
				<button onClick={navigateTo} id='edit'>{'创建新问卷'}</button>
			</div>
			<div className={homeStyles.myCreation}>
				<div>{'我创建的内容'}</div>
				<div className={homeStyles.createdContent}>
					<div onClick={navigateTo} id='draft'>{'草稿'}</div>
					<div onClick={navigateTo} id='published'>{'已发布的问卷'}</div>
					<div onClick={navigateTo} id='involved'>{'参与过的问卷'}</div>
				</div>
			</div>
		</div>
	);
};

export default Home;