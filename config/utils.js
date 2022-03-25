const install = (Vue , vm) => {
	/**
	 * 是否登录
	 */
	
	const isLogin = () => {
		//如果没有token 跳转到登陆页面
		const token = vm.currentToken
		if (!token) {
			//来自哪个页面
			const currentPage = getCurrentPages().pop() ;
			//缓存当前页 用于登录或者注册之后的跳转
			uni.setStorageSync('back_url' , currentPage.route) ;
			vm.$u.toast('您尚未登录，请先登录')
			setTimeout(() => {
				vm.$u.route({
					type: 'redirect',
					animationType: 'slide-in-right',
					url: 'pages/common/login/login'
				})
			},1500)
			return false ;
		}
		//已经登录并且有token了，但是token失效过期了，自动重新刷新token
		else {
			uni.$u.http.get('/user/refreshToken/' + String(vm.currentUser.user.id)).then(res => {
				vm.$u.vuex('currentToken' , res.token) ;
			}).catch(err => {
				vm.$u.toast('服务器异常')
			})
			
			//刷新完token 不需要更新用户信息，因为更新用户信息只有在编辑资料的时候需要
		}
		return true ;
	}
	
	vm.$u.utils = {
		isLogin
	}
}

export default {
	install
}