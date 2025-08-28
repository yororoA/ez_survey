import {getUserData} from "./getUserData";

/*
* 更新用户数据(push), 使用 `await` 前缀直接调用更新数据, 无返回值
*
* @accept`updateElement`: 需要更新的数据:string, 'username','pwd','surveys','answers'
* @accept`newElement`: string, 对于 username/pwd: 更新后的数据, 对于 surveys/answers: 需要添加的数据id
* @accept`reload`: bool, 仅用于 surveys/answers/involved; true: 用 newElement 覆盖 oldElement; false: 添加
* @accept`toOther`: 其他用户的id, 用于提交问卷时将问卷反馈绑定给发布者, 不提供时更新当前用户数据
* */
export async function updateUser(updateElement, newElement, reload, toOther) {
	const clientDocumentId = !!toOther?toOther:localStorage.getItem('token');
	const url = `http://localhost:1337/api/clients/${clientDocumentId}`;
	// 先获取用户数据
	const data = await getUserData();
	// 更新用户数据
	switch (updateElement) {
		case 'username':
		case 'pwd': {
			try {
				const resp = await fetch(url, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					// 仅更新需要更新的数据
					body: JSON.stringify({data: {[updateElement]: newElement}})
				});
				if (!resp.ok) {
					throw new Error(`更新 ${updateElement} 失败: ${resp.status}`);
				}
				const updated = await resp.json();
				console.log('更新用户数据成功', updated);
			} catch (err) {
				console.error(err);
			}
			break;
		}
		case 'surveys':
		case 'answers':
		case 'involved': {
			const last = data?.data?.[updateElement];
			const lastNull = last == null;
			if (last === '') {
				const resp = await fetch(url, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({data: {[updateElement]: null}})
				})
			}
			try {
				const resp = await fetch(url, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					// 根据原本是否有数据进行更新
					body: JSON.stringify({data: {[updateElement]: reload ? [...newElement] : !lastNull ? [...last, newElement] : [newElement]}})
				});
				if (!resp.ok) {
					throw new Error(`更新 ${updateElement} 失败: ${resp.status}`);
				}
				const updated = await resp.json();
				console.log('更新用户数据成功', updated);
			} catch (err) {
				console.error(err);
			}
			break;
		}
	}
}