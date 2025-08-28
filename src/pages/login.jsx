import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useRegisterUserMutation, useFindUserQuery, userApi} from "../services/apis";
import {Outlet} from "react-router-dom";
import login from '../style/login/login.module.css'


const Login = () => {
	const [entired, setEntired] = useState(false); // 是否全部填写
	const [user, setUser] = useState(''); // 监测 user 输入框
	const [pwd, setPWD] = useState(''); // 监测 pwd 输入框

	// 使用 useCallback, 确保监测函数只在挂载时创建一次
	const handleInputUser = useCallback((e) => {
		// user 监听器
		setUser(e.target.value);
	}, []);
	const handleInputPWD = useCallback((e) => {
		// 	pwd 监听器
		setPWD(e.target.value);
	}, []);
	const handleEntiredCheck = useCallback((user, pwd) => {
		// 检查是否全部填写
		return (!!user && !!pwd);
	}, [])
	const preventSpaceInput = useCallback((e) => {
		if (e.key === ' ') {
			e.preventDefault();
		}
	})

	// 登陆状态管理
	const [haslogin, setLogin] = useState(false);
	// 注册处理
	const [regis, regisResult] = useRegisterUserMutation();
	// 注册处理器
	// 发送请求到服务器的过程为异步, 需要时间传输数据并等待服务器处理, 若不使用异步, 代码会不等待请求完成直接继续执行, 导致无法正确获取服务器的返回结果
	async function handleRegister(e) {
		e.preventDefault();
		if (!handleEntiredCheck(user, pwd)) {
			alert('请输入完整的用户名和密码');
			return;
		}
		const data = {
			attributes: {
				username: user,
				pwd
			}
		}
		try {
			// 调用注册api, 通过 unwrap 获取原始响应
			const resp = await regis(data).unwrap();
			console.log('注册成功\n', resp);
			localStorage.setItem('token', resp.data.documentId);
			setLogin(true);
		} catch (err) {
			console.log('注册失败: ', err);
		}
	}

	// 登录处理
	async function handleLogin(e) {
		e.preventDefault();
		if (!handleEntiredCheck(user, pwd)) {
			console.log('请输入完整的用户名和密码')
		}
		try {
			const resp = await fetch('http://localhost:1337/api/clients/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username: user, pwd}),
			});
			if (!resp.ok) {
				throw new Error(`登录失败: ${resp.status}`)
			}
			console.log('登录成功\n', resp);
			const data = await resp.json();
			localStorage.setItem('token', data.data.documentId);
			setLogin(true);
		} catch (err) {
			console.log('登录失败', err);
		}
	}



	// 检查本地是否有用户token
	useEffect(() => {
		if (localStorage.token) {
			console.log(localStorage.token);
			// 存在时检查该token对应的用户是否存在
			fetch(`http://localhost:1337/api/clients/${localStorage.token}`)
				.then(resp => {
					console.log(resp);
					if(!resp.ok) {
						// 不存在则移除原用户登录状态
						setLogin(false);
						localStorage.removeItem('token');
					}else{
						setLogin(true);
					}
				})
		}
	}, []);

	// 如果已登录, 渲染子路由, 否则重定向到登录页面
	return haslogin ? <Outlet/> : (
		<div className={login.entire}>
			<form action="" className={login.main}>
				<header>
					<h2>{'在线问卷系统(并非并非)'}</h2>
					<span>{'请登录以继续使用'}</span>
				</header>
				<input type="text" onKeyDown={preventSpaceInput} onChange={handleInputUser} value={user} placeholder="请输入用户名"/>
				<input type="password" onKeyDown={preventSpaceInput} onChange={handleInputPWD} value={pwd}
							 placeholder="请输入密码"/>
				<button onClick={handleLogin} type="submit" style={{color:'white', backgroundColor:'#387df6'}}>{'登录'}</button>
				<button onClick={handleRegister} type="submit" style={{backgroundColor:'white'}}>{'注册'}</button>
			</form>
		</div>
	);
};

export default Login;