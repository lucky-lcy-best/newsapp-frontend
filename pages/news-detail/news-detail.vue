<template>
	<view>
		<u-navbar
			:title="author"
			@rightClick="rightClick"
			:autoBack="true"
			rightIcon="more-dot-fill"
		>
		</u-navbar>
		<view class="u-content">
			<strong><text class="title">{{title}}</text></strong>
			<view class="authorInfo">
				<u-avatar :src="avatorUrl" class="avator"></u-avatar>
				<view class="detail">
					<text class="name">{{author}}</text>
					<text class="cTime"><br>{{cTime}}</text>
				</view>
				<u-button class = "focus" type="primary" text="关注" color="red"></u-button>
			</view>
			<u-parse :content="content" :selectable="true" :lazyLoad="true" class="newsInfo"></u-parse>
			<view class="declaration" v-if="srcUrl">
				本文转载至{{ srcUrl }}，
				<text @tap="copyText(srcUrl)">点此可查看原文链接。</text>
				如有侵权，请联系我们，我们将在最短的时间内处理。
			</view>
			
		
		</view>
		<!-- 底部评论栏 -->
		<view class="navigation">
			<view class="left">
				<!-- 写评论 -->
				<view class="comment_input">
					<u--input
					    placeholder="写评论"
					    border="surround"
						shape="circle"
						prefixIcon="edit-pen"></u--input>
				</view>
				<!-- 评论数 点击可展开评论-->
				<view class="counts">
					<u-badge type="error" max="99" value="20" absolute="true" offset="[10 ,10]"></u-badge>
					<u-icon name="chat" size="35" color="#989898"></u-icon>
				</view>
				<!-- 点赞 -->
				<view class="counts">
					<u-icon name="thumb-up" size="35" color="#989898"></u-icon>
				</view>
				
				<!-- 收藏 -->
				<view class="counts">
					<u-icon name="star" size="35" color="#989898"></u-icon>
				</view>
				
				<!-- 分享 -->
				<view class="share">
					<u-icon name="share" size="35" color="#989898"></u-icon>
				</view>
				<!-- <view class="item">
					<u-icon v-if="!collectNum" name="heart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<u-icon v-else name="heart-fill" :size="40" color="#2979ff"></u-icon>
					<view class="text u-line-1">{{collectNum?"已收藏":"收藏"}}</view>
				</view>
				<view class="item" @tap="toCart">
					<u-badge :count="cartNum" bgColor="#2979ff" :is-center="true"></u-badge>
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">购物车</view>
				</view> -->
			</view>
			<!-- <view class="right">
				<u-button :disabled="goods.stock?false:true" class="cart btn" @click="addCart" :ripple="true" type="primary">加入购物车</u-button>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				content: ``,
				author: "",
				creatorUid:'',
				cTime :'',
				diggCount:0,
				followerCount:0,
				avatorUrl:'',
				srcUrl: '',
				
				// 不需要的
				// 商品基本信息
				goods: {},
				// 推荐商品
				likeGoods: {},
				commentList: {},
				goodsId: null,
				collectNum:0,
				cartNum:0
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.content = option.content ;
			this.title = option.title ;
			this.author = option.author ;
			this.creatorUid = option.creator_uid ;
			this.cTime = option.cTime ;
			this.diggCount = option.digg_count ;
			this.followerCount = option.follower_count ;
			this.avatorUrl = option.avator_url ;
			this.srcUrl = option.src_url ;
			// console.log(this.avatorUrl)
		},
		methods: {
			rightClick() {
				console.log('right')
			},
			
			/*复制*/
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: res => {
						this.$alert('原文链接已复制', 'success');
					}
				});
			},
			
			collect(){
				this.$u.throttle(this.collectNot,1500)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.custom-style {
		color: #ff0000;
		width: 400rpx;
	}
	.newsInfo {
		// font-size: 35rpx;
	}
	.u-content {
		padding: 80px 25rpx;
		// font-size: 35rpx;
		// color: $u-content-color;
		line-height: 1.5;
	}
	.title {
		font-size: 50rpx;
		// padding-top: 100rpx;
	}
	.authorInfo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 15rpx;
	}
	.detail {
		text-align: left;
		padding:0rpx 20rpx;
		line-height: 1;
		width: 300rpx;
	}
		
	.name {
		font-size: 30rpx;
		display:inline-block;/*转为行内块元素*/
		white-space: pre-wrap;/*处理元素内的空白,保留空白符序列，但是正常地进行换行*/
		word-wrap: break-word;/*允许长单词或 URL 地址换行到下一行,在长单词或 URL 地址内部进行换行*/
	}
	.avator {
		padding: 20rpx;
	}
	.focus {
		width: 150rpx;
		height: 65rpx;
		color: white;
		padding-right: 30rpx;
	}
	.cTime {
		/* font-size: 10rpx; */
		padding-top: 10rpx;
		font-size: 20rpx;
		color: #5b5b5b;
	}
	.declaration {
		margin: 50rpx 0;
		font-size: 34rpx;
		color: #999;
	}
	
	.navigation {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 10rpx;
		justify-content: space-between;
		.left {
			display: flex;
			font-size: 20rpx;
			justify-content: space-around;
			.comment_input {
				width: 300rpx;
			}
			.counts {
				width: 100rpx;
				padding: 10rpx 10rpx;
				position: relative;
				
			}
			.share {
				width: 100rpx;
				padding: 10rpx 0rpx;
				position: relative;
			}
			
		}
		// .left {
		// 	flex:3;
		// 	display: flex;
		// 	font-size: 20rpx;
		// 	justify-content: space-around;
		// 	.item {
		// 		position: relative;
		// 		text-align: center;
		// 	}
		// }

		// .right {
		// 	flex:9;
		// 	display: flex;
		// 	font-size: 28rpx;
		// 	justify-content: flex-end;
		// 	align-items: center;
		// 	.btn {
		// 		text-align: center;
		// 		line-height: 66rpx;
		// 		width: 90%;
		// 		border-radius: 10rpx;
		// 		color: #ffffff;
		// 	}

		// 	.cart {
		// 		background-color: #2979ff;
		// 		margin-right: 30rpx;
		// 	}

		// 	.buy {
		// 		background-color: #ff7900;
		// 	}
		// }
	}
	
</style>
