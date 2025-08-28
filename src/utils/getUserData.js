/*查询用户相关数据
* @accept`toOther`: 其他用户的id, 用于提交问卷时将反馈绑定给发布者, 不提供时查询当前用户的数据*/
export async function getUserData(toOther) {
	const clientDocumentId = !!toOther ? toOther : localStorage.getItem('token');
	const url = `http://localhost:1337/api/clients/${clientDocumentId}`;
	try {
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`获取数据失败: ${resp.status}`);
		}
		return await resp.json();
	} catch (err) {
		console.error(err);
		return null;
	}
}