// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        /* config 为默认全局配置*/
        config.baseURL = 'http://localhost:8081'; 
		// config.baseURL = 'http://172.19.115.65:8081';
		// config.baseURL = 'http://172.28.128.176:8081'; 
		// config.baseURL = 'http://172.22.8.92:8081'
		config.header= {};
		// config.method= 'GET';
		config.dataType= 'json';
		// #ifndef MP-ALIPAY
		config.responseType= 'text';
		// #endif
		// 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
		config.custom= {}; // 全局自定义参数默认值
		// #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
		config.timeout= 800;
		// #endif
		// #ifdef APP-PLUS
		config.sslVerify= true;
		// #endif
		// #ifdef H5
		// 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
		config.withCredentials= false;
		// #endif
		// #ifdef APP-PLUS
		config.firstIpv4=false; // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
		// #endif
		// 局部优先级高于全局，返回当前请求的task,options。请勿在此处修改options。非必填
		// getTask: (task, options) => {
		// 相当于设置了请求超时时间500ms
		//   setTimeout(() => {
		//     task.abort()
		//   }, 500)
		// },
		// 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
		config.validateStatus= (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
			return statusCode >= 200 && statusCode < 300
		};
        return config
    })
	
	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	    // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
	    config.data = config.data || {}
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if(config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			config.header.Authorization = vm.currentToken
		}
	    return config 
	}, config => { // 可使用async await 做异步操作
	    return Promise.reject(config)
	})
	
	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const custom = response.config?.custom
		if (data.code !== 200) { 
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				vm.$u.utils.isLogin()
			}
			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise，请求不会进入catch中
				return new Promise(() => { })
			}
		}
		return data.data === undefined ? {} : data.data
	}, (response) => { 
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}