import React, {useCallback, useContext, useEffect, useState} from 'react';
import {getLocation} from "../../../utils/getLocation";
import {ReEditQueContext} from "../context/reEditQueContext";
import editPreview from '../../../style/editPreview/editPreview.module.css'

const Location = ({key, que, index}) => {
	const [position, setPosition] = useState(null);
	const [isSelect, setIsSelect] = useState(true);

	// 是否自己输入位置信息
	const handleChoose = useCallback(e => {
		switch (e.target.value) {
			case 'select': {
				setIsSelect(true);
				return;
			}
			case 'location': {
				setIsSelect(false);
				return;
			}
			default: {
				setIsSelect(true)
			}
		}
	}, [isSelect, position]);

	// 精确定位
	// const handleGetPosition = useCallback(e => {
	// 	e.preventDefault();
	// 	const po = getLocation();
	// 	console.log(po);
	// 	setPosition(po);
	// },[isText, position]);
	async function handleGetPosition(e) {
		e.preventDefault();
		try {
			const location = await getLocation();
			setPosition(location);
			console.log('定位成功\n', location);
		} catch (err) {
			console.error('定位失败\n', err);
		}
	}

	// 编辑
	const edit = useContext(ReEditQueContext);

	function handleEdit(e) {
		e.preventDefault();
		edit(que, false);
	}

	// 删除
	function handleDel(e) {
		e.preventDefault();
		edit(que, true);
	}

	const [isHover, setIsHover] = useState(false);
	// 鼠标进入
	const handleEnter = useCallback(e => {
		setIsHover(true);
	}, [isHover]);
	// 鼠标离开
	const handleLeave = useCallback(e => {
		setIsHover(false);
	}, [isHover]);

	useEffect(() => {
		console.log('-------\n', position)
	}, [position])

	return (
		<fieldset onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
			<fieldset disabled={true} style={{border: 'none'}}>
				<legend>{`${index + 1}. ${que}`}</legend>
				<select onChange={handleChoose} name="location" id="">
					<option value="select">选择</option>
					<option value="location">定位精确位置信息</option>
				</select>
				{isSelect ? (
					<div>{'请选择所在城市'}</div>
				) : (
					<div>
						<div>{'纬度:'}{position?.latitude}</div>
						<div>{'经度:'}{position?.longitude}</div>
						<button onClick={handleGetPosition}>定位</button>
					</div>
				)}
			</fieldset>
			{isHover && (
				<div className={editPreview.btnBox}>
					<button onClick={handleEdit}>{'编辑'}</button>
					<button onClick={handleDel}>{'删除'}</button>
				</div>
			)}
		</fieldset>
	);
};

export default Location;