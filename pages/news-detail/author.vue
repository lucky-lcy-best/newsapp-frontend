<template>
	<view>
		<view class="userInfo">
			<view class="info">
				<view class="u-m-r-20">
					<u-avatar :src="author.avatorUrl" size="90"></u-avatar>
				</view>
				<view class="info">
					<view class="nickname">
						<view class="nick">{{author.author}}</view>
						<view class="account">账号:{{author.creatorUid}}</view>
					</view>
				</view>
			</view>
			<view class="detail">
				<!-- <u-icon name="arrow-right" color="#8d8e90" size="20" label="个人主页" labelPos="left" @click="goUserInfo()"></u-icon> -->
				<u-button v-if="isFollow==false" class = "focus" type="primary" text="关注" color="red" @click="followMediaUser()"></u-button>
				<u-button v-else class = "focus" type="primary" text="已关注" color="red" :plain="true" @click="cancelFollowMediaUser()"></u-button>
			</view>
		</view>
		<view class="item-line"></view>
		<view>
			<cell class = "item "v-for="(item,index) in newsList" :key="item.id" @click="goDetail(item)" >
				<view v-if="item.posterUrl==undefined || item.posterUrl == ''" class="item" >
					<!-- <image class="item-poster" :src="item.posterUrl" ></image> -->
					<view class="item-detail-noimg">
						<text class="item-title-noimg">{{item.title}}</text>
						<text class="item-other-noimg">{{item.author}}  {{item.commentCount}}评论 {{item.diggCount}}点赞  {{item.publishTime}}</text>
					</view>
					<view class="item-line"></view>
				</view>
				<view v-else class="item">
					<image class="item-poster" :src="item.posterUrl" mode="aspectFill"></image>
					<view class="item-detail">
						<text class="item-title">{{item.title}}</text>
						<!-- <text v-if="newsId===item.id" class="item-other">{{item.author}}   {{item.commentCount}}评论   {{this.diggCount}}点赞</text> -->
						<text class="item-other">{{item.author}}   {{item.commentCount}}评论   {{item.diggCount}}点赞\n</text>
						<text class="item-cTime">{{item.publishTime}}发布</text>
					</view>
					<view class="item-line"></view>
				</view>
			
			</cell>
			<loading v-if="hasMoreData"></loading>
		</view>
	</view>
</template>

<script>
	import { logout } from '@/config/api.js';
	export default {
		data() {
			return {
				author:{},
				newsList:[],
				isFollow:false
				
			}
		},
		onLoad(option) {
			//获取作者信息
			uni.$u.http.get("/news/getAuthorById/" + String(option.creatorUid), {custom : {auth: true}}).then(res=> {
				this.author = res ;
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
			//根据uid获取该作者发布的新闻
			uni.$u.http.get("/news/getNewsByAuthUid/" + String(option.creatorUid), {custom : {auth: true}}).then(res=> {
				this.newsList = res ;
				console.log(res)
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
			//判断是否已关注
			uni.$u.http.get('/news/isFollow/' + String(this.currentUser.user.id) + '/' + String(option.creatorUid) ,{ custom: { auth: true }}).then(res => {
				//直接修改isdigg
				// console.log(res)
				this.isFollow = res ;
			}).catch(err => {
				this.$u.toast('服务器异常')
			})
		},
		onShow () {
			
		},
		methods: {
			//关注与取关用户
			followMediaUser() {
				this.isFollow = true ;
				uni.$u.http.get('/news/followMedia/' + String(this.currentUser.user.id) + '/' + String(this.newsinfo.creatorUid) ,{ custom: { auth: true }}).then(res => {
					//直接修改isdigg
					this.isFollow = res ;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			},
			cancelFollowMediaUser() {
				this.isFollow = false ;
				uni.$u.http.get('/news/cancelFollowMedia/' + String(this.currentUser.user.id) + '/' + String(this.newsinfo.creatorUid) ,{ custom: { auth: true }}).then(res => {
					//直接修改isdigg
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			},
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
					this.messageNum = 0 ;
					this.$u.toast('已退出登录')
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
			},
			goHistory() {
				//获得历史记录
				this.$u.route({
					url : 'pages/center/history'
				})
			},
			goUserLike() {
				//获得历史记录
				this.$u.route({
					url : 'pages/center/like'
				})
			},
			goUserMessage() {
				//获得历史记录
				this.$u.route({
					url : 'pages/center/message'
				})
			},
			goDetail(item) {
				// 带参数
				uni.$u.route('/pages/news-detail/news-detail', {
					id: item.id 
				});
			},
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
	background-color: #f9f9f9;
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
	.detail {
		
	}
}
.focus {
		width: 150rpx;
		height: 65rpx;
		color: white;
		padding-right: 30rpx;
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
.u-slot-value {
	width: 60rpx; 
	height: 50rpx;
	background-color: rgb(255, 0, 0);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	.num {
		color: #ffffff;
	}
}
.content {
		flex: 1;
		height: 100%;
	}
	
	.item {
		display: flex;
		flex-direction: row;
		position: relative;
		height: 275rpx;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 15rpx;
	}
	
	.item-title {
		color: #000000;
		font-size: 35rpx;
		width:500rpx;/* 盒子宽自己设置想要的宽度 */
		/* #ifndef APP-NVUE */
		height: auto;/*高度自动*/
		display:inline-block;/*转为行内块元素*/
		white-space: pre-wrap;/*处理元素内的空白,保留空白符序列，但是正常地进行换行*/
		word-wrap: break-word;/*允许长单词或 URL 地址换行到下一行,在长单词或 URL 地址内部进行换行*/
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* #endif */
		text-align: left;
		padding:0rpx 20rpx;
		overflow: hidden;
		lines: 3;
		text-overflow:ellipsis;
	}
	.item-title-noimg {
		color: #000000;
		font-size: 35rpx;
		width:700rpx;/* 盒子宽自己设置想要的宽度 */
		/* #ifndef APP-NVUE */
		height: auto;/*高度自动*/
		display:inline-block;/*转为行内块元素*/
		white-space: pre-wrap;/*处理元素内的空白,保留空白符序列，但是正常地进行换行*/
		word-wrap: break-word;/*允许长单词或 URL 地址换行到下一行,在长单词或 URL 地址内部进行换行*/
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* #endif */
		lines: 3;
		text-align: left;
		overflow: hidden;
		text-overflow:ellipsis;
		
	}
	.item-poster {
		width: 230rpx;
		height: 200rpx;
		border-radius: 10rpx ;
	
	}
	.item-other {
		/* font-size: 10rpx; */
		padding-top: 55rpx;
		padding-left: 20rpx;
		font-size: 25rpx;
		color: #5b5b5b;
	}
	.item-cTime {
		font-size: 25rpx;
		color: #5b5b5b;
		padding-left: 20rpx;
	}
	.item-other-noimg {
		/* font-size: 10rpx; */
		padding-top: 55rpx;
		font-size: 25rpx;
		color: #5b5b5b;
	}
	.item-detail {
		font-size: 28rpx;
		color: white;
		/* background-color: #007AFF; */
	}
	.item-detail-noimg {
		font-size: 28rpx;
		color: white;
		/* background-color: #007AFF; */
	}
	.item-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: #eeeeee;
	}
</style>
