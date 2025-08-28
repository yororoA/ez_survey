'use strict';

/**
 * client controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const bcrypt = require('bcrypt');

module.exports = createCoreController('api::client.client', ({ strapi }) => ({
	// 重写创建方法，添加密码加密
	async create(ctx) {
		const { data } = ctx.request.body;

		// 检查是否包含密码字段
		if (data.pwd) {
			// 加密密码
			const saltRounds = 10;
			data.pwd = await bcrypt.hash(data.pwd, saltRounds);
		}

		// 调用核心创建方法
		return await super.create(ctx);
	},

	// 重写更新方法，处理密码更新
	async update(ctx) {
		const { data } = ctx.request.body;

		// 如果更新了密码，则重新加密
		if (data.pwd) {
			const saltRounds = 10;
			data.pwd = await bcrypt.hash(data.pwd, saltRounds);
		}

		// 调用核心更新方法
		return await super.update(ctx);
	},

	// 自定义登录验证方法
	async login(ctx) {
		const { username, pwd } = ctx.request.body;

		// 验证输入
		if (!username || !pwd) {
			return ctx.badRequest('请提供用户名和密码');
		}

		// 查询用户
		const client = await strapi.db.query('api::client.client').findOne({
			where: { username }
		});

		if (!client) {
			return ctx.badRequest('用户不存在');
		}

		// 验证密码
		const isPasswordValid = await bcrypt.compare(pwd, client.pwd);
		if (!isPasswordValid) {
			return ctx.badRequest('密码错误');
		}

		// 密码验证成功，返回用户信息（不含密码）
		const { pwd: _, ...clientWithoutPassword } = client;
		return {
			success: true,
			data: clientWithoutPassword
		};
	}
}));
