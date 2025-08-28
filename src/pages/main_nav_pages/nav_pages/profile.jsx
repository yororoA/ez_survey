import React, {useCallback, useEffect, useState} from 'react';
import {getUserData} from "../../../utils/getUserData";
import tf799 from '../../../style/profile&setting/tf799.module.css'
import {useNavigate} from "react-router-dom";


const Profile = () => {
	const [profileData, setProfileData] = useState(null);
	useEffect(() => {
		getUserData().then(r => setProfileData({
			username: r.data.username,
			surveys: r.data.surveys == null ? 0 : r.data.surveys.filter(survey => survey.published === true).length,
			involved: r.data.involved == null ? 0 : r.data.involved.length
		}))
	}, [localStorage.getItem('token')]);



	const logout = useCallback(e=>{
		e.preventDefault();
		localStorage.removeItem('token');
		window.location.reload();
	},[localStorage.getItem('token')]);

	const navigate = useNavigate();

	return (
		<>
			{profileData !== null && (
				<div className={tf799.entire}>
					<div className={tf799.backToHome} onClick={e=>{
						e.preventDefault();
						navigate('../')
					}}>{'< 返回首页'}</div>
					<header>{'个人资料'}</header>
					<div className={tf799.content}>
						<h2>{`用户名: ${profileData.username}`}</h2>
						<h4>{`发布的问卷数量: ${profileData.surveys}`}</h4>
						<h4>{`填写的问卷数量: ${profileData.involved}`}</h4>
					</div>
					<button onClick={logout}>{'退出登录'}</button>
				</div>
			)}
		</>
	);
};

export default Profile;