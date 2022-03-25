<template>
	<view>
		<view class="userInfo">
			<view class="info">
				<view class="u-m-r-20">
					<u-avatar :src="currentUser.user.avator" size="90" @click="uploadPic()"></u-avatar>
				</view>
				<view class="info">
					<view class="nickname">
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
				<u-cell class="cell" icon="setting" title="退出登录" size="large"></u-cell>
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
	export default {
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true
			}
		},
		onLoad() {
			this.$u.utils.isLogin();
		},
		methods: {
			goUserInfo() {
				this.$u.route({
					url : 'pages/center/updateInfo'
				})
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
