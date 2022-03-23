<template>
	<view class="wrap">
		<view class="content">
			<view class="user">
				<view class="base-info">
					<view class="user-info">
						<view class="avatar" v-if="">
							<u-avatar src="http://p9.toutiaoimg.com/large/pgc-image/25eb7693ea90430bbc8ecdca7ced7e7d" size="70" @click="goUserInfo()"></u-avatar>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
import iconfont from '@/components/iconfont/iconfont.vue';
import pageLoading from '@/components/loading/pageLoading.vue';
export default {
	components: {
		iconfont,
		pageLoading
	},
	data() {
		return {
			user:{}
		};
	},
	onLoad() {
		//未登录直接return
		if (!this.$u.utils.isLogin()) return
	}
}
</script>

<style scoped lang="scss">
.top {
	/*页面标题*/
	.page-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90rpx;
		text-align: center;
		z-index: 9999;
		font-size: 38rpx;
		font-weight: bold;
		color: #ffffff;
	}
}
.user {
	.base-info {
		//background-image: linear-gradient(top, #e4edec 20%, #e4edec 80%);
		background: #8cc7b5;
		height: 400rpx;
	}
	.user-info {
		padding: 64rpx 32rpx;
		display: flex;
		align-item: center;
		justify-content: space-between;
		.avatar {
			flex-grow: 0;
			flex-shrink: 0;
			line-height: 0;
			border-radius: 50%;
			padding-left: 25rpx;
			padding-top: 10rpx;
			image {
				width: 144rpx;
				height: 144rpx;
				border-radius: 50%;
				border: 1rpx solid #fff;
			}
		}
		.default-avatar {
			margin-top: -12rpx;
		}
		.info {
			flex-grow: 1;
			flex-shrink: 1;
			padding-left: 28rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.nickname {
				font-size: 44rpx;
				color: #ffffff;
				margin-top: -14rpx;
			}
			.mobile {
				font-size: 34rpx;
				color: #fff;
				display: flex;
				align-items: center;
				line-height: normal;
				/deep/ .icon {
					margin-left: 30rpx;
					font-size: 28rpx;
					display: block;
				}
			}
			.user-type {
				display: flex;
				margin-top: 6rpx;
				text {
					font-size: 24rpx;
					color: #fff;
					background-color: #cd8202;
					padding: 0 24rpx;
					border-radius: 55px;
				}
			}
			.btn-login {
				font-size: 42rpx;
				background: transparent;
				color: #fff;
				text-align: left;
				width: 200rpx;
			}
		}
		.setting {
			flex-grow: 0;
			flex-shrink: 0;
			.btn-setting {
				margin-top: 10rpx;
				/deep/ .icon {
					color: #fff;
					font-size: 48rpx;
				}
			}
		}
	}
}
.nav {
	margin-top: -15rpx;
	margin-bottom: calc(var(--window-bottom) + 20rpx);
	.list {
		margin-top: 15rpx;
		margin-bottom: 20rpx;
		.item {
			padding-left: 24rpx;
			background: #ffffff;
			.info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #e9ebee;
				padding: 4rpx 24rpx 4rpx 0;
				height: 100rpx;
				.name {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					font-size: 34rpx;
					line-height: normal;
					image {
						width: 45rpx;
						height: 45rpx;
						margin-right: 16rpx;
					}
					/deep/ .icon {
						color: #8cc7b5;
						font-size: 44rpx;
						margin-right: 16rpx;
						line-height: normal;
					}
					/deep/ .icon-car {
						font-size: 35rpx;
						margin-right: 14rpx;
					}

					/deep/ .icon-profile-o {
						font-size: 48rpx;
						margin-right: 12rpx;
					}

					/deep/ .icon-user-info {
						font-size: 50rpx;
						margin-left: -5rpx;
						margin-right: 10rpx;
					}
					/deep/ .icon-favorite {
						font-size: 42rpx;
					}
					/deep/ .icon-about {
						font-size: 44rpx;
						margin-left: -4rpx;
						margin-right: 12rpx;
					}
					/deep/ .icon-question {
						margin-right: 16rpx;
					}
				}

				/deep/ .icon {
					color: #c1c4c9;
					font-size: 24rpx;
				}
			}
			&:last-child {
				.info {
					border-bottom: 0;
				}
			}
		}
	}
}
.status-bar {
	background: #8cc7b5;
}
</style>
