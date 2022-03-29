<template>
	<view>
		<view class="userInfo">
			<view class="info">
				<view class="u-m-r-20">
					<u-avatar v-if="currentToken == undefined || currentToken == null || currentToken == ''" src="/static/icon/logout_pic.png" size="90" @click="authLogin()"></u-avatar>
					<u-avatar v-else :src="currentUser.user.avator" size="90" @click="uploadPic()"></u-avatar>
				</view>
				<view class="info">
					<view v-if="currentToken == undefined || currentToken == null || currentToken == ''" class="nickname">
						<view class="nick" @click="authLogin()">请登录</view>
						<!-- <view class="account">账号:{{currentUser.user.account}}</view> -->
					</view>
					<view v-else class="nickname">
						<view class="nick">{{currentUser.user.nickname}}</view>
						<view class="account">账号:{{currentUser.user.account}}</view>
					</view>
				</view>
			</view>
			<view class="detail">
				<u-icon name="arrow-right" color="#8d8e90" size="20" label="个人主页" labelPos="left" @click="goUserInfo()"></u-icon>
			</view>
		</view>
		
	<!-- 	<view class="u-m-t-20">
			<u-cell-group>
				<u-cell icon="rmb-circle" title="支付"></u-cell>
			</u-cell-group>
		</view> -->
		
		<view>
			<u-cell-group>
				<u-cell class="cell" icon="star" title="浏览历史" size="large"></u-cell>
				<u-cell class="cell" icon="photo" title="收藏" size="large"></u-cell>
				<u-cell class="cell" icon="coupon" title="消息通知" size="large"></u-cell>
				<u-cell class="cell" icon="heart" title="关注" size="large"></u-cell>
				<u-cell class="cell" icon="setting" title="关于我们" size="large"></u-cell>
				<u-cell class="cell" icon="setting" title="用户反馈" size="large"></u-cell>
				<u-cell class="cell" icon="setting" title="设置" size="large"></u-cell>
				<u-cell class="cell" icon="man-delete" title="退出登录" size="large" @click="authLogout()"></u-cell>
			</u-cell-group>
		</view>
		<!-- <view class="u-m-t-20">
			<u-cell-group>
				<u-cell icon="setting" title="设置"></u-cell>
			</u-cell-group>
		</view> -->
	</view>
</template>

<script>
	import { logout } from '@/config/api.js';
	export default {
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true,
			}
		},
		onLoad() {
			// if (this.currentUser.user == undefined) 
			// this.$u.utils.isLogin()
		},
		methods: {
			//前往个人主页
			goUserInfo() {
				if (this.currentToken) {
					this.$u.route({
						url : 'pages/center/updateInfo'
					})
				}else {
					this.authLogin();
				}
				
			},
			//退出登录
			authLogout() {
				//登录之后 获取用户信息
				logout({ custom: { auth: true }}).then((res) => {
					//退出登录清除token，用户信息置为空
					// this.$u.vuex('currentUser' , null) ;
					this.$u.vuex('currentToken' , null) ;
				}).catch(() =>{
					this.$u.toast('服务器异常')
				})
			},
			authLogin() {
				//来自哪个页面
				const currentPage = getCurrentPages().pop() ;
				//缓存当前页 用于登录或者注册之后的跳转
				uni.setStorageSync('back_url' , currentPage.route) ;
				// vm.$u.toast('您尚未登录，请先登录')
				setTimeout(() => {
					this.$u.route({
						// type: 'redirect',
						animationType: 'slide-in-right',
						url: 'pages/common/login/login'
					})
				},500)
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ffffff;
}
.userInfo {
	display: flex;
	flex-direction: row;
	position: relative;
	height: 300rpx;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 20rpx;
	.info {
		display: flex;
		flex-direction: row;
		position: relative;
		align-items: center;
		justify-content: space-between;
		.nickname {
			padding: 0 20rpx;
			.nick {
				font-size: 40rpx;
			}
			.account {
				padding: 30rpx 0;
				font-size: 25rpx;
				color: #828282;
			}
		}
	}
}
.cell {
	padding: 0rpx 10rpx;
}
.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
