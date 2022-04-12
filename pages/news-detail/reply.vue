<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo"><image :src="comment.avator" mode=""></image></view>
					<view class="user-info">
						<view class="name">{{ comment.userName }}</view>
						<view class="date">{{ comment.commentTime }}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: comment.isDigg }">
					<view class="num">{{ comment.diggCount }}</view>
					<u-icon v-if="comment.isDigg == false" name="thumb-up" class="like" color="#9a9a9a" :size="25" @click="commentLike()"></u-icon>
					<u-icon v-else name="thumb-up-fill" class="like" :size="25" @click="commentLike()"></u-icon>
				</view>
			</view>
			<view class="content">{{ comment.content }}</view>
			<view class="contentPic" v-if="comment.pic!==''">
				<!-- <image :src="res.pic" mode="aspectFit"  lazy-load="true"></image> -->
				<u--image :showLoading="true" :src="comment.pic" radius="5" mode="aspectFill" width="100px" height="200px" @click="previewImg(comment.pic)"></u--image>
			</view>
			<view class="bottom">
				<view class="reply" @click="toggleComment()">
					<text>回复</text>
					<u-icon class="more" name="arrow-right" :size="15"></u-icon>
				</view>
				<view class="delete" v-if="comment.userId==currentUser.user.id">删除</view>
				<u-icon v-else name="close"></u-icon>
			</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.allReply }}）</view>
			<view class="item" v-for="(item, index) in replyList" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo"><image :src="item.avator" mode=""></image></view>
							<view class="user-info">
								<view class="name">{{ item.userName }}</view>
								<view class="date">{{ item.replyTime }}</view>
							</view>
						</view>
						<view class="right"  :class="{ highlight: item.isDigg }">
							<view class="num">{{ item.diggCount }}</view>
							<u-icon v-if="!item.isDigg" name="thumb-up" class="like" :size="25" color="#9a9a9a" @click="ReplyLike(index)"></u-icon>
							<u-icon v-if="item.isDigg" name="thumb-up-fill" class="like" :size="25" @click="ReplyLike(index)"></u-icon>
						</view>
					</view>
					<view class="reply" v-if="item.replyTo">
						<view class="username">{{ item.replyTo.userName }}</view>
						<view class="text">{{ item.replyTo.replyContent }}</view>
						<view class="contentPic" v-if="item.replyTo.pic!==''">
							<!-- <image :src="res.pic" mode="aspectFit"  lazy-load="true"></image> -->
							<u--image :showLoading="true" :src="item.replyTo.pic" radius="5" mode="aspectFill" width="50px" height="100px" @click="previewImg(item.replyTo.pic)"></u--image>
						</view>
					</view>
					<view class="content">{{ item.content }}</view>
					<view class="contentPic" v-if="item.pic!==''">
						<!-- <image :src="res.pic" mode="aspectFit"  lazy-load="true"></image> -->
						<u--image :showLoading="true" :src="item.pic" radius="5" mode="aspectFill" width="100px" height="200px" @click="previewImg(item.pic)"></u--image>
					</view>
				</view>
				<view class="bottom">
					<view class="reply" @click="toggleReply(item , index)">
						<text>回复</text>
						<u-icon class="more" name="arrow-right" :size="15"></u-icon>
					</view>
					<view class="delete" v-if="comment.userId==currentUser.user.id" @click="deleteById(index)">删除</view>
					<u-icon v-else name="close"></u-icon>
				</view>
			</view>
			
		</view>
		<!-- 回复弹出框 -->
		<view class="popup">
			<u-popup :show="popShow" :round="10" mode="bottom" @close="close" @open="open">
				<view class="popup-all">
					<view class="popup-content">
						<u--textarea class="input" v-model="replyContent" placeholder="请输入内容" count maxlength="250">
						</u--textarea>
						<view class="buttons">
							<view class="submitButton">
								<u-button type="primary" size="small" text="发送" color="#ff4646" throttleTime="1000" shape="circle" @click="sendReply()"></u-button>
							</view>
							<view class="submitButton">
								<u-button type="primary" size="small" text="清空" color="#ff4646" throttleTime="1000" shape="circle"></u-button>
							</view>
						</view>
					</view>
					<view class="picUpload">
						<u-upload
							:fileList="fileList1"
							@afterRead="afterRead"
							@delete="deletePic"
							name="1"
							multiple
							:maxCount="1"
							:previewFullImage="true"
							width="120rpx"
							height="120rpx"
						></u-upload>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
import { sendComment , commentDigg , sendReply , ReplyDigg} from '@/config/api.js';
export default {
	data() {
		return {
			replyList: [],
			comment: {} ,
			replyPage: 1 ,
			totalPage: 0,
			popShow: false,
			type: 0,
			fileList1:[],
			commentContent: '',
			replyContent: '',
			currIndex: -1,
			currReply : {},
			replyPic : ''
		};
	},
	async onLoad(option) {
		//存一下当前id
		// console.log(option)
		await uni.setStorageSync("index",option.index)
		//根据评论id先获取评论信息
		await uni.$u.http.get("/comment/getById/" + String(option.id) + '/' + String(this.currentUser.user.id), {custom : {auth: true}}).then(res=> {
			this.comment = res ;
			console.log(res)
		})
		.catch(err => {
			this.$u.toast('服务器异常')
		})
		await this.getReply();
	},
	methods: {
		//发表回复
		async sendReply() {
			//发表一条回复需要 用户id , 用户头像昵称，直接本地获取，新闻的news_id也是本页面获取
			var to_uid = null ;
			if (this.type == 1) {
				to_uid = this.currReply.id ;
			}
			const params = {
				commentId : this.comment.id ,
				content : this.replyContent ,
				fromUid : this.currentUser.user.id ,
				toUid : to_uid,
				type: this.type,
				replyPic: this.replyPic
				// commentPic : this.commentPic
			}
			await sendReply(params, {custom: {auth: true}}).then((res) => {
				//发表回复之后刷新该评论的回复信息 
				this.$u.toast("回复成功")
			}).catch(() =>{
				this.$u.toast('服务器异常')
			})
			//关闭弹窗
			this.close();
			//清空回复内容
			this.replyContent = '';
			//根据评论id先获取评论信息
			await uni.$u.http.get("/comment/getById/" + String(this.comment.id) + '/' + String(this.currentUser.user.id), {custom : {auth: true}}).then(res=> {
				// console.log(res)
				this.comment = res
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
			await this.getReply();
		},
		//删除该回复
		async deleteById(index) {
			// console.log(this.commentList[index])
			await uni.$u.http.get("/reply/deleteById/" + String(this.replyList[index].id), {custom : {auth: true}}).then(res=> {
				// console.log(res)
				//删除该评论及其回复
				// setTimeout(() => {
				// 	this.replyList.splice(index, 1)
				// },300)
				//刷新一下回复列表 级联删除
				this.getReply();
				// console.log(this.commentList)
				this.$u.toast('删除成功')
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
		},
		// 当前回复点赞
		ReplyLike(index) {
			this.replyList[index].isDigg = !this.replyList[index].isDigg;
			//进行点赞
			const params = {
				userId : this.currentUser.user.id ,
				replyId : this.replyList[index].id ,
				isDigg : this.replyList[index].isDigg
			}
			ReplyDigg(params, {custom: {auth: true}}).then((res) => {
				// console.log(res)
				//缓存token
				if (res == true) {
					this.replyList[index].diggCount++;
				} else {
					this.replyList[index].diggCount--;
				}
			}).catch(() =>{
				this.$u.toast('服务器异常')
			})
		},
		// 当前评论点赞
		commentLike() {
			// console.log(this.comment.isDigg)
			this.comment.isDigg = !this.comment.isDigg;
			//进行点赞
			const params = {
				userId : this.currentUser.user.id ,
				commentId : this.comment.id ,
				isDigg : this.comment.isDigg
			}
			commentDigg(params, {custom: {auth: true}}).then((res) => {
				// console.log(res)
				if (res == true) {
					this.comment.diggCount++;
				} else {
					this.comment.diggCount--;
				}
			}).catch(() =>{
				this.$u.toast('服务器异常')
			})
		},

		// 回复列表
		async getReply() {
			//获取当前的回复列表
			await uni.$u.http.get('/reply/getAll/' + String(this.comment.id) + '/' + String(this.replyPage) + '/' + String(this.currentUser.user.id),{ custom: { auth: true }}).then(res => {
				this.totalPage = res.pageNum ;
				if (this.replyPage == 1) this.replyList = res.replies ;
				else {
					for (var i = 0 ; i < res.replies.length ; i++) {
						this.replyList.push(res.replies[i]);
					}
				}
			}).catch(err => {
				this.$u.toast('服务器异常')
			})
		},
		//回复当前评论
		toggleComment() {
			this.popShow = true ;
			this.type = 0;
		},
		//回复某条回复
		toggleReply(item , index) {
			this.popShow = true ;
			this.type = 1;
			this.currReply = item ;
			this.currIndex = index ;
		},
		close() {
			this.popShow = false ;
		},
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1)
		},
		// 新增图片
		async afterRead(event) {
			// console.log(event)
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = [].concat(event.file)
			let fileListLen = this[`fileList${event.name}`].length
			lists.map((item) => {
				this[`fileList${event.name}`].push({
					...item,
					status: 'uploading',
					message: '上传中'
				})
			})
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url)
				let item = this[`fileList${event.name}`][fileListLen]
				this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
					status: 'success',
					message: '',
					url: result
				}))
				fileListLen++
			}
		},
		uploadFilePromise(url) {
			// console.log(url)
			return new Promise((resolve, reject) => {
				let a = uni.uploadFile({
					// url: 'http://172.19.115.65:8081/upload', 
					url: 'http://localhost:8081/upload', 
					filePath: url,
					name: 'file',
					success: (res) => {
						setTimeout(() => {
							// console.log(res.data)
							// this.user.info.avator = res.data
							// console.log(this.user.info.avator)
							this.replyPic = res.data 
							resolve(res.data.data)
						}, 1000)
					}
				});
			})
		},
		previewImg(item) {
			var urls = []
			urls.push(item)
			uni.previewImage({
				current:item,
				urls:urls
			})
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
.comment {
	padding: 30rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	.top {
		display: flex;
		justify-content: space-between;
	}
	.left {
		display: flex;
		.heart-photo {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.user-info {
			margin-left: 10rpx;
			.name {
				color: #5677fc;
				font-size: 28rpx;
				margin-bottom: 4rpx;
			}
			.date {
				font-size: 20rpx;
				color: $u-light-color;
			}
		}
	}
	.right {
		display: flex;
		font-size: 20rpx;
		align-items: center;
		color: #9a9a9a;
		.like {
			margin-left: 6rpx;
		}
		.num{
			font-size: 26rpx;
			color: #9a9a9a;
		}
	}
	.highlight {
		color: #5677fc;
		.num{
			color: #5677fc;
		}
	}
	.bottom {
		display: flex;
		padding-top: 20rpx;
		justify-content: space-between;
		.reply {
			background-color: #f1f1f1;
			border-radius: 15%;
			color: #5677fc;
			padding: 10rpx;
			font-size: 25rpx;
			display: flex;
		}
		.delete {
			padding: 10rpx;
			font-size: 28rpx;
			color: #888888;
		}
	}
}
.all-reply {
	margin-top: 10rpx;
	padding-top: 20rpx;
	background-color: #ffffff;
	.all-reply-top {
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #5677fc;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		border-bottom: solid 2rpx $u-border-color;
		.bottom {
			display: flex;
			padding: 0 25rpx;
			justify-content: space-between;
			.reply {
				color: #5677fc;
				padding: 10rpx;
				font-size: 25rpx;
				display: flex;
			}
			.delete {
				padding: 10rpx;
				font-size: 28rpx;
				color: #888888;
			}
		}
	}
	.reply {
		padding: 20rpx;
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;
		margin: 10rpx 0;
		.username {
			font-size: 24rpx;
			color: #7a7a7a;
		}
	}
}
.popup-all {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		height: 350rpx;
		background-color: #fff;
		border-radius: 3%;
		.popup-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.input {
				background-color: #f4f4f4;
			}
			.buttons {
				.submitButton {
					/* width: 200rpx; */
					padding: 15rpx 10rpx;
				}
			}
		}
		.picUpload {
			padding: 20rpx;
			height: 10rpx;
		}
	}
	
	
	.popup-height {
		width: 200px;
	}
</style>
