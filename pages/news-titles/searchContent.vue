<template>
	<view>
		<view class="box-bg">
			<uni-nav-bar color="#ffffff" backgroundColor="#ffffff">
				<u-search :show-action="true" actionText="搜索" :animation="true" height="30" placeholder="搜你想看的"
				:clearabled="true" v-model="keyword" @search="search(keyword)" @custom="search(keyword)"
				focus="true"></u-search>
			</uni-nav-bar>
		</view>
		<!-- 搜索历史 -->
		<view class="searchBotBox" v-if="showHistory==true">
			<view class="ov">
				<view class="fl">搜索历史</view>
				<view @click="clearKey" class="fr grace-more-r grace-search-remove">
					<u-icon name="trash" size="20"></u-icon>
				</view>
			</view>
			<view class="searchHistoryBox">
				<view class="searchHistoryBoxItem" v-for="(item,index) in searchKey" :key='index'>
					{{item}}
				</view>
			</view>
		</view>
		<view>
			<cell class = "item "v-for="(item,index) in searchList" :key="item.id" @click="goDetail(item)" >
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
	export default {
		data() {
			return {
				keyword:'',
				searchList: [],
				searchKey: [],
				showHistory : false
			};
		},
		onLoad() {
			//加载搜索的历史记录
			uni.$u.http.get('/news/getSearchHistory/'+ String(this.currentUser.user.id), { custom: { auth: true }}).then(res => {
				this.searchKey = res
				if (res.length != 0 ) {
					this.showHistory = true
				}
				// console.log(this.newsinfo) ;
			}).catch(err => {
				this.$u.toast('服务器异常')
			})
		},
		methods: {
			//根据关键字查询
			search(keyword) {
				// console.log(keyword)
				uni.$u.http.get('/news/getByKeyWord/' + keyword).then(res => {
					// console.log(res)
					this.searchList = res ;
					if (res.length != 0 ) {
						this.showHistory = false
					}
					// console.log(this.newsinfo) ;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
				//查询的同时插入搜索历史
				uni.$u.http.get('/news/searchHistory/'+ String(this.currentUser.user.id) + '/'+ keyword, { custom: { auth: true }}).then(res => {
					console.log(res)
					// console.log(this.newsinfo) ;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			},
			goDetail(item) {
				// 带参数
				uni.$u.route('/pages/news-detail/news-detail', {
					id: item.id 
				});
			},
			//清除搜索历史
			// clearKey: function() {
			// 	var that = this;
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '点击确定将删除所有历史信息，确定删除吗？',
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				//调用删除接口
			// 				uni.$u.http.get('/news/deleteSearchHistory/'+ String(this.currentUser.user.id) , { custom: { auth: true }}).then(response => {
			// 					console.log(response)
			// 					this.searchKey = []
			// 					// console.log(this.newsinfo) ;
			// 				}).catch(err => {
			// 					this.$u.toast('服务器异常')
			// 				})
						
							
			// 			} else if (res.cancel) {
			
			// 			}
			// 		}
			// 	});
			
			// },
			clearKey() {
				uni.$u.http.get('/news/deleteSearchHistory/'+ String(this.currentUser.user.id) , { custom: { auth: true }}).then(response => {
					console.log(response)
					this.searchKey = []
					// console.log(this.newsinfo) ;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.box-bg {
	background-color: #ffffff;	
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
	.ov {
		overflow: hidden;
	}
	
	.fl {
		float: left;
	}
	
	.fr {
		float: right;
	}
	
	.searchTopBox {
		width: 100%;
		background-color: #0b877f;
		height: 100upx;
		box-sizing: border-box;
		padding-top: 15upx;
	}
	
	.searchBoxRadius {
		width: 90%;
		height: 70upx;
		background-color: #fff;
		margin-left: 5%;
		overflow: hidden;
		border-radius: 35upx;
	}
	
	.searchBoxIcon {
		font-size: 40upx;
		margin-top: 20upx;
		margin-left: 20upx;
		float: left;
	}
	
	.searchBoxIpt {
		height: 70upx;
		line-height: 70upx;
		margin-left: 20upx;
		float: left;
	}
	
	.searchBotBox {
		width: 100%;
		margin-top: 30upx;
		padding: 15upx 3%;
		box-sizing: border-box;
	}
	
	.searchHistoryBox {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		margin-top: 40upx;
	}
	
	.searchHistoryBoxItem {
		float: left;
		font-size: 26upx;
		color: #666;
		line-height: 46upx;
		height: 46upx;
		padding: 0 20upx;
		border-radius: 23upx;
		margin-left: 15upx;
		margin-bottom: 20upx;
		border: 1px solid #ccc;
	}
</style>
