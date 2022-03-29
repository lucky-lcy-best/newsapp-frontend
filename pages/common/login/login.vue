<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录Lucky头条</view>
			<input class="u-border-bottom" type="number" v-model="account" placeholder="请输入手机号" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="password" @click="findPassword()">找回密码</view>
				<text class="issue" @click="goRegister()">注册</text>
			</view>
		</view>
		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon"><u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon></view>
					微信
				</view>
				<view class="QQ item">
					<view class="icon"><u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon></view>
					QQ
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { login , getUserInfo} from '@/config/api.js';
import {mapState, mapMutations} from 'vuex'; 
export default {
	data() {
		return {
			account: '',
			password: '',
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.$u.test.mobile(this.account) && this.password) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['error'];
			}
			return style;
		}
	},
	methods: {
		...mapMutations(['setToken']),
		async submit() {
			var isRegister = true ;
			if(!this.$u.test.mobile(this.account) || !this.password) {
				return ;
			}
			// 处理登录使用的参数
			const params = {
				account: this.account,
				password: this.password
			}
			//登录之前判断该账号是否已经注册
			await uni.$u.http.get('/user/isRegister/'+this.account).then(res => {
				console.log(res)
				isRegister = res ;
			}).catch(err => {
				
			})
			//未注册返回
			if (!isRegister) {
				this.$u.toast('该账号尚未注册，请先注册')
				return
			}
			//请求api 执行登录
			await login(params).then((res) => {
				//缓存token
				this.$u.vuex('currentToken' , res.token) ;
				this.$u.toast('登录成功')
			}).catch(() =>{
				this.$u.toast('服务器异常')
			})
			
			//登录之后 获取用户信息
			await getUserInfo({ custom: { auth: true }}).then((res) => {
				//保存用户信息
				this.$u.vuex('currentUser' , res) ;
			}).catch(() =>{
				this.$u.toast('服务器异常')
			})
			
			//登录之后 跳转 到来源页
			const backUrl = uni.getStorageSync('back_url') || 'pages/news-titles/news-titles'
			setTimeout(() => {
				this.$u.route({
					type: 'redirect' ,
					url : backUrl
				})
			}, 1500)
			
		},
		goRegister() {
			//跳转到注册页面
			this.$u.route({
				type: 'redirect',
				url : 'pages/common/login/register'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.u-border-bottom {
	margin-bottom: 40rpx !important;
}
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 10rpx;
		}
		.tips {
			color: #8c8c8c;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			
			.link {
				// color: $u-type-warning;
			}
		}
	}
}
</style>