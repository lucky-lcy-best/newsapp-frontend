const http = uni.$u.http

// post请求，用户登录
export const login = (params, config = {}) => http.post('/user/login', params, config)

// get请求，根据token退出登录
export const logout = (data) => http.get('/user/logout', data)

// get请求，根据header中的token信息获得用户信息
export const getUserInfo = (data) => http.get('/user/getUserInfo', data)

// 注册接口 post
export const register = (params, config = {}) => http.post('/user/register', params, config)

//更新用户信息接口
export const updateUserInfo = (params, config = {}) => http.post('/user/update', params, config)

// get请求，无缝刷新token信息
export const refreshToken = (data) => http.get('/user/refreshToken', data)

// post请求，发表评论
export const sendComment = (params, config = {}) => http.post('/comment/addComment', params, config)

// post请求，点赞评论
export const commentDigg = (params, config = {}) => http.post('/comment/clickDigg', params, config)

// post请求，点赞回复
export const ReplyDigg = (params, config = {}) => http.post('/reply/clickDigg', params, config)

// post请求，发表回复
export const sendReply = (params, config = {}) => http.post('/reply/addReply', params, config)

// post请求，插入历史记录
export const addHistory = (params, config = {}) => http.post('/news/addHistory', params, config)




