import React, {useCallback, useState} from 'react';
import {getLocation} from "../../../utils/getLocation";
import involvedCheck from '../../../style/involvedCheck/involvedCheck.module.css'

const Location = ({title, index}) => {
	const [isSelect, setIsSelect] = useState(false);	// 是否精确定位
	const [position, setPosition] = useState(null); //
	// 根据选择判定是否精确定位
	const handleChoose = useCallback(e => {
		if (e.target.value === 'location') setIsSelect(true);
		else setIsSelect(false);
	}, [title]);

	// 精确定位相关逻辑
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


	return (
		<fieldset>
			<fieldset key={index} style={{border: 'none'}}>
				<legend>
					{`${index + 1}. ${title}`}
					<span>{'(定位)'}</span>
				</legend>
				<select onChange={handleChoose} name="location" id="location">
					<option value="select">{'选择省份城市(暂不支持)'}</option>
					<option value="location">{'定位精确位置信息'}</option>
				</select>
				<label htmlFor="location">{'定位方式'}</label>
				{!isSelect ? (
					<div>{'请选择所在城市(暂不支持)'}</div>
				) : (
					<div>
						<div>{'纬度:'}{position?.latitude}</div>
						<div>{'经度:'}{position?.longitude}</div>
						<button onClick={handleGetPosition}>定位</button>
					</div>
				)}
			</fieldset>
		</fieldset>
	);
};

export default Location;