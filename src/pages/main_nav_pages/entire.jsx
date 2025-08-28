import React, {useEffect, useState} from 'react';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import workbench from '../../style/workbench/workbench.module.css'

const Entire = () => {
	// 导航跳转
	const navigate = useNavigate();
	const navigateTo = e => {
		e.preventDefault();
		if (e.target.id === 'processing' || e.target.id === 'ended') {
			navigate(`./published/${e.target.id}`);
			return;
		}
		if(e.target.id === 'home'){
			navigate('../../');
			return;
		}
		switch (e.target.id){
			case 'edit':
			case 'draft':
			case 'published':
			case 'involved':{
				sessionStorage.clear();
			}
		}
		navigate(`./${e.target.id}`);
	}

	// 根据当前所在工作台页面给导航栏动态添加className
	const location = useLocation();
	const [nowBench, setNowBench] = useState('');
	const [atPublished, setAtPublished] = useState(false);
	const [touching, setTouching] = useState('');
	useEffect(() => {
		const now = location.pathname.split('/');
		if (now.includes('published')) {
			setNowBench('published');
			setAtPublished(true);
			if (now.at(-1) !== 'published') {
				setTouching(now.at(-1));
			} else {
				setTouching('');
			}
		} else {
			setNowBench(now.at(-1));
			setAtPublished(false);
			setTouching('');
		}
	}, [location]);


	return (
		<div className={workbench.entire}>
			<div className={workbench.navBox}>
				<span className={workbench.title}>{'工作台'}</span>
				<span onClick={navigateTo} id={'home'} className={workbench.backToHome}>{'< 返回首页'}</span>
				<div className={workbench.navContent}>
					<div onClick={navigateTo} className={nowBench === 'edit' ? workbench.focus : ''}
							 id={'edit'}>{'创建新问卷'}</div>
					<div onClick={navigateTo} className={nowBench === 'draft' ? workbench.focus : ''} id={'draft'}>{'草稿'}</div>

					<div onClick={navigateTo} className={nowBench === 'published' ? workbench.focus : ''}
							 id={'published'}>{'已发布的问卷'}</div>
					{atPublished && (
						<div className={workbench.publishedBox}>
							<div onClick={navigateTo} id={'processing'}
									 className={touching === 'processing' ? workbench.childFocus : ''}>{'收集中'}</div>
							<div onClick={navigateTo} id={'ended'}
									 className={touching === 'ended' ? workbench.childFocus : ''}>{'已结束收集'}</div>
						</div>
					)}

					<div onClick={navigateTo} className={nowBench === 'involved' ? workbench.focus : ''}
							 id={'involved'}>{'参与过的问卷'}</div>
				</div>
			</div>
			<Outlet/>
		</div>
	);
};

export default Entire;