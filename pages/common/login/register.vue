<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎注册Lucky头条</view>
			<input class="u-border-bottom" type="number" v-model="account" placeholder="请输入手机号" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" />
			<input class="u-border-bottom" type="password" v-model="password2" placeholder="请确认密码" />
			<input class="u-border-bottom" type="text" v-model="nickname" placeholder="请输入昵称" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">注册</button>
		</view>
	</view>
</template>

<script>
import { login , getUserInfo, register} from '@/config/api.js';
import {mapState, mapMutations} from 'vuex'; 
export default {
	data() {
		return {
			account: '',
			password: '',
			password2: '',
			nickname:''
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.$u.test.mobile(this.account) && this.password && this.password2 && this.nickname) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['success'];
			}
			return style;
		}
	},
	methods: {
		async submit() {
			if(this.password != this.password2 ) {
				this.$u.toast('两次输入的密码不一致')
				return ;
			}
			// 处理注册使用的参数
			const params = {
				account: this.account,
				password: this.password,
				nickname: this.nickname
			}
			//请求api 执行注册
			await register(params).then((res) => {
				this.$u.toast('注册成功，请使用该账户进行登录')
			}).catch(() =>{
				
			})
			
			//注册之后 跳转 到登陆页面
			const backUrl = uni.getStorageSync('back_url') || 'pages/news-titles/news-titles'
			setTimeout(() => {
				this.$u.route({
					type: 'reLaunch' ,
					url : 'pages/common/login/login'
				})
			}, 1500)
			
		},
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