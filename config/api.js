const http = uni.$u.http

// post请求，用户登录
export const login = (params, config = {}) => http.post('/user/login', params, config)

// get请求，根据header中的token信息获得用户信息
export const getUserInfo = (data) => http.get('/user/getUserInfo', data)

// 注册接口 post
export const register = (params, config = {}) => http.post('/user/register', params, config)