import React from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import globalBackge from "../../style/globalBackage/globalBackage.module.css"

const Background = () => {
	const navigate = useNavigate();

	const navigateTo = e => {
		e.preventDefault();
		navigate(`./${e.target.id}`);
	}

	return (
		<div className={globalBackge.entire}>
			<div className={globalBackge.useless}>
				<div className={globalBackge.displayUseless}>
					<div onClick={navigateTo} style={{cursor:'pointer'}} id='profile'>{'个人资料'}</div>
					<div onClick={navigateTo} style={{cursor:'pointer'}} id='setting'>{'设置'}</div>
				</div>
			</div>
			<Outlet/>
		</div>
	);
};

export default Background;