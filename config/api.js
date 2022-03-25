const http = uni.$u.http

// post请求，用户登录
export const login = (params, config = {}) => http.post('/user/login', params, config)

// get请求，根据header中的token信息获得用户信息
export const getUserInfo = (data) => http.get('/user/getUserInfo', data)

// 注册接口 post
export const register = (params, config = {}) => http.post('/user/register', params, config)

//更新用户信息接口
export const updateUserInfo = (params, config = {}) => http.post('/user/update', params, config)

// get请求，无缝刷新token信息
export const refreshToken = (data) => http.get('/user/refreshToken', data)