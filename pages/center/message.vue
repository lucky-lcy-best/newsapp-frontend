<template>
	<view>
		<u-tabs :list="list2" :current="currentIndex" @change="change"></u-tabs>
		<view v-if="currentIndex==0">
			<view class="comment" v-for="(res, index) in commentList" :key="res.id">
				<view class="left"><image :src="res.avator" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.userName }}</view>
						<text class="replylabel">回复了</text>
					</view>
					<view class="content">{{ res.content }}</view>
					<view class="reply-box" @click="goCommentDetail(res, index)">
						<view class="item" v-if="res.comment != null">
							[我的评论]{{res.comment.content}}
						</view>
						<view class="item" v-else>
							[我的回复]{{res.reply.content}}
						</view>
					</view>
					<view class="bottom">
						{{ res.replyTime }}
						<view class="reply" @click="toReply(res,index)">回复</view>
						<!-- <view class="delete" v-if="res.userId==currentUser.user.id" @click="deleteById(index)">删除</view> -->
						<u-icon name="close"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view v-if="currentIndex==1">
			<view class="comment" v-for="(res, index) in diggList" :key="res.id" >
				<view class="left"><image :src="res.avator" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.userName }}</view>
						<text class="replylabel">点赞了</text>
					</view>
					<view class="reply-box" @click="goCommentDetail(res, index)">
						<view class="item" v-if="res.comment != null">
							[我的评论]{{res.comment.content}}
						</view>
						<view class="item" v-else>
							[我的回复]{{res.reply.content}}
						</view>
					</view>
					<view class="bottom">
						{{ res.diggTime }}
						<view class="reply" @click="toReply(res,index)">回复</view>
						<!-- <view class="delete" v-if="res.userId==currentUser.user.id" @click="deleteById(index)">删除</view> -->
						<u-icon name="close"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view v-if="currentIndex==2">
			<view class="comment" v-for="(res, index) in commentList" :key="res.id">
				<view class="left"><image :src="res.avator" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.userName }}</view>
						<view v-if="res.id==currComment.id" class="like" :class="{ highlight: currComment.isDigg }">
							<view class="num">{{ currComment.diggCount }}</view>
							<u-icon v-if="!currComment.isDigg" name="thumb-up" :size="25" color="#9a9a9a" @click="commentLike(index)"></u-icon>
							<u-icon v-if="currComment.isDigg" name="thumb-up-fill" :size="25" @click="commentLike(index)"></u-icon>
						</view>
						<view v-else class="like" :class="{ highlight: res.isDigg }">
							<view class="num">{{ res.diggCount }}</view>
							<u-icon v-if="!res.isDigg" name="thumb-up" :size="25" color="#9a9a9a" @click="commentLike(index)"></u-icon>
							<u-icon v-if="res.isDigg" name="thumb-up-fill" :size="25" @click="commentLike(index)"></u-icon>
						</view>
					</view>
					<view class="content">{{ res.content }}</view>
					<view class="contentPic" v-if="res.pic!==''">
						<!-- <image :src="res.pic" mode="aspectFit"  lazy-load="true"></image> -->
						<u--image :showLoading="true" :src="res.pic" radius="5" mode="aspectFill" width="100px" height="200px" @click="previewImg(res.pic)"></u--image>
					</view>
					<view class="reply-box">
						<view class="item" v-for="(item, index) in res.replyList" :key="item.index">
							<view class="username">{{ item.userName }}</view>
							<view class="text" v-if="item.replyContent!==''">{{ item.replyContent }}</view>
							<view class="text" v-else>[图片]</view>
						</view>
						<view class="all-reply" @click="toAllReply(res,index)" v-if="res.replyList != undefined">
							共{{ res.allReply }}条回复
							<u-icon class="more" name="arrow-right" :size="10"></u-icon>
						</view>
					</view>
					<view class="bottom">
						{{ res.commentTime }}
						<view class="reply" @click="toReply(res,index)">回复</view>
						<view class="delete" v-if="res.userId==currentUser.user.id" @click="deleteById(index)">删除</view>
						<u-icon v-else name="close"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list2: [{
						name: '评论',
						badge: {
							// isDot: true,
							value:0
						}
					}, 
					{
						name: '点赞',
						badge: {
							value: 0,
						},
					},
				],
				currentIndex:0,
				commentList:[],
				replyList:[],
				diggList:[]
			}
		},
		async onLoad() {
			//获取所有未读的消息（回复和点赞）
			await this.getComment()
			await this.getDigg()
		},
		methods: {
			change(e) {
				this.currentIndex = e.index;
			},
			// 评论列表
			getComment() {
				//通过newsId来获取新闻评论同时获取这些新闻的回复
				
				//先获取所有评论
				uni.$u.http.get('/reply/getNewReplies/' + String(this.currentUser.user.id),{ custom: { auth: true }}).then(res => {
					
					this.commentList = res
					this.list2[0].badge.value = res.length
					console.log(this.commentList)
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
				
			},
			// 未读点赞列表
			getDigg() {

				//先获取所有评论
				uni.$u.http.get('/digg/getUnReadDigg/' + String(this.currentUser.user.id),{ custom: { auth: true }}).then(res => {
					
					this.diggList = res
					this.list2[1].badge.value = res.length
					console.log(this.diggList)
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
				
			},
			goCommentDetail(res , index) {
				var id = -1 ;
				if (res.comment == null) id = res.reply.id
				else id = res.comment.id
				uni.$u.route('/pages/news-detail/reply', {
					id: id ,
					index: index 
				});
				//同时设置消息已读
				if (this.currentIndex == 0) this.setMessageRead(index)
				else this.setDiggRead(index)
			},
			//设置消息已读
			setMessageRead(index) {
				uni.$u.http.get('/reply/setMessageIsRead/' + String(this.commentList[index].id),{ custom: { auth: true }}).then(res => {
					this.getComment()
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			},
			//设置点赞已读
			setDiggRead(index) {
				uni.$u.http.get('/reply/setDiggIsRead/' + String(this.diggList[index].id) + '/' + String(this.diggList[index].type),{ custom: { auth: true }}).then(res => {
					this.getDigg()
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment {
		display: flex;
		padding: 20rpx 30rpx;
		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.right {
			flex: 1;
			padding-left: 20rpx;
			font-size: 30rpx;
			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				.name {
					color: #5677fc;
				}
				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;
					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}
				}
				.highlight {
					color: #5677fc;
					.num {
						color: #5677fc;
					}
				}
			}
			.content {
				margin-bottom: 10rpx;
			}
			.contentPic {
				// padding: 10rpx;
				padding: 8rpx 0;
			}
			.reply-box {
				background-color: rgb(242, 242, 242);
				border-radius: 12rpx;
				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;
					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}
				.all-reply {
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;
					font-size: 28rpx;
					.more {
						margin-left: 6rpx;
					}
				}
			}
			.bottom {
				margin-top: 20rpx;
				display: flex;
				justify-content:space-between ;
				font-size: 28rpx;
				color: #9a9a9a;
				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
				.delete {
					// padding-left: 50rpx;
					;
				}
			}
		}
	}
</style>
