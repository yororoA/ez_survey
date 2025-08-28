// 获取用户地理位置
export function getLocation() {
	// 检查浏览器是否支持 geolocation api
	if (!navigator.geolocation) {
		return '您的浏览器不支持地理位置服务';
	}

	// 调用定位方法
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			// 成功回调, 获取地理位置信息
			(position) => {
				const coords = position.coords;
				resolve({
					latitude: coords.latitude, // 纬度
					longitude: coords.longitude, // 经度
					accuracy: coords.accuracy // 定位精度(米)
				})
			},
			// 失败回调, 处理错误
			(err) => {
				const errorMsg = {
					1: '用户拒绝提供定位权限',
					2: '无法获取位置信息（可能是网络或设备问题）',
					3: '定位超时'
				}[err.code] || `定位失败（错误码：${err.code}）`;
				reject(errorMsg); // 传递具体错误描述
			}
		)
	})
}