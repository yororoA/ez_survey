'use strict';

/**
 * client router
 */

// 不使用createCoreRouter，直接定义路由
module.exports = {
	routes: [
		// 保留默认CRUD路由
		{
			method: 'GET',
			path: '/clients',
			handler: 'client.find',
			config: { auth: false }
		},
		{
			method: 'GET',
			path: '/clients/:id',
			handler: 'client.findOne',
			config: { auth: false }
		},
		{
			method: 'POST',
			path: '/clients',
			handler: 'client.create',
			config: { auth: false }
		},
		{
			method: 'PUT',
			path: '/clients/:id',
			handler: 'client.update',
			config: { auth: false }
		},
		{
			method: 'DELETE',
			path: '/clients/:id',
			handler: 'client.delete',
			config: { auth: false }
		},
		// 自定义登录路由 - 关键配置
		{
			method: 'POST',
			path: '/clients/login',
			handler: 'client.login',
			config: { auth: false }
		}
	]
};
