import React from 'react';
import tf799 from '../../../style/profile&setting/tf799.module.css'
import {useNavigate} from "react-router-dom";

const Setting = () => {
	const navigate = useNavigate();

	return (
		<div className={tf799.entire}>
			<div className={tf799.backToHome} onClick={e=>{
				e.preventDefault();
				navigate('../')
			}}>{'< 返回首页'}</div>
			<header>{'设置'}</header>
			<div className={tf799.content}>
				<h2>{'全部都没做!'}</h2>
			</div>
		</div>
	);
};

export default Setting;