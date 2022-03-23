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
				srcUrl: ''
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
			}
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
	
</style>
