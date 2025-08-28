import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

// 创建用户相关数据api对象
const userApi = createApi({
	reducerPath: 'userApis',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:1337/api/',
		// prepareHeaders: ,
	}),
	endpoints(build) {
		return {
			// 注册
			registerUser: build.mutation({
				query(user) {
					return {
						url: 'clients',
						method: 'POST',
						body: {data: user.attributes}
					}
				}
			}),
			// 查询用户
			findUser: build.query({
				query(token) {
					return `clients/${token}`
				},
				transformResponse(baseQueryReturnValue, meta, arg) {
					// console.log(baseQueryReturnValue)
					return baseQueryReturnValue;
				},
			}),
			//	创建问题
			createQue: build.mutation({
				query(que) {
					return {
						url: 'quests',
						method: 'POST',
						body: {data: que.attributes}
					}
				}
			}),
			// 修改问题
			updateQue: build.mutation({
				query(documentId, que) {
					return {
						url: `quests/${documentId}`,
						method: 'PUT',
						body: {data: que.attributes}
					}
				}
			}),
			// 删除问题
			delQue: build.mutation({
				query(documentId) {
					return {
						url: `quests/${documentId}`,
						method: 'DELETE',
					}
				}
			}),
			// 创建问卷
			saveSurvey: build.mutation({
				query(survey) {
					return {
						url: 'surveys',
						method: 'POST',
						body: {data: survey.attributes}
					}
				}
			}),
			// 更新问卷
			updateSurvey: build.mutation({
				query(survey) {
					const surveyId = sessionStorage.getItem('tempSurveyToken');
					return {
						url: `surveys/${surveyId}`,
						method: 'PUT',
						body: {data: survey.attributes}
					}
				}
			})
		}
	}
});


// 暴露钩子函数
export const {
	useRegisterUserMutation,
	useFindUserQuery,
	useCreateQueMutation,
	useUpdateQueMutation,
	useDelQueMutation,
	useSaveSurveyMutation,
	useUpdateSurveyMutation,
} = userApi;
export default userApi;


