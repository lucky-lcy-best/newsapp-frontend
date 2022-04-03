<template>
	<view>
		<u-navbar
			:title="newsinfo.author"
			@rightClick="rightClick"
			:autoBack="true"
			rightIcon="more-dot-fill"
		>
		</u-navbar>
		<view class="u-content">
			<strong><text class="title">{{newsinfo.title}}</text></strong>
			<view class="authorInfo">
				<u-avatar :src="newsinfo.avatorUrl" class="avator"></u-avatar>
				<view class="detail">
					<text class="name">{{newsinfo.author}}</text>
					<text class="cTime"><br>{{newsinfo.publishTime}}</text>
				</view>
				<u-button class = "focus" type="primary" text="关注" color="red"></u-button>
			</view>
			<u-parse :content="newsinfo.content" :selectable="true" :lazyLoad="true" class="newsInfo"></u-parse>
			
			<view class="declaration" v-if="newsinfo.srcUrl">
				本文转载至{{ newsinfo.srcUrl }}，
				<text @tap="copyText(newsinfo.srcUrl)">点此可查看原文链接。</text>
				如有侵权，请联系我们，我们将在最短的时间内处理。
			</view>
		</view>
		<text class="commentTitle">全部评论 ({{commentList.length}})</text>
		<view class="item-line"></view>
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
		<loading v-if="hasMoreData"></loading>
		<!-- <view class="no-comment" v-if="info.comment.count == 0">暂无评论，快来抢占沙发吧~</view> -->
		<view class="float-empty"></view>
		<!-- 底部评论栏 -->
		<view class="navigation">
			<view class="left">
				<!-- 写评论 -->
				<view class="comment_input" @click="toggle()">
					<u--input
					    placeholder="写评论"
					    border="surround"
						shape="circle"
						prefixIcon="edit-pen"
						disabled
						disabledColor="#f5f7fa"
						></u--input>
				</view>
				<!-- 评论数 点击可展开评论-->
				<view class="counts">
					<u-badge type="error" max="99" :value="newsinfo.commentCount" absolute="true" offset="[10 ,10]"></u-badge>
					<u-icon name="chat" size="35" color="#989898"></u-icon>
				</view>
				<!-- 点赞 -->
				<view class="counts" @click="digg()">
					<u-icon v-if="isdigg==false" name="thumb-up" size="35" color="#989898"></u-icon>
					<u-icon v-else name="thumb-up-fill" size="35" color="#989898"></u-icon>
				</view>
				
				<!-- 收藏 -->
				<view class="counts" @click="like()">
					<u-icon v-if="islike==false" name="star" size="35" color="#989898"></u-icon>
					<u-icon v-else name="star-fill" size="35" color="#989898"></u-icon>
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
		<!-- 评论的弹出框 -->
		<view class="popup" v-if="type==0">
			<u-popup :show="popShow" :round="10" mode="bottom" @close="close" @open="open">
				<view class="popup-all">
					<view class="popup-content">
						<u--textarea class="input" v-model="commentContent" placeholder="请输入内容" count maxlength="250">
						</u--textarea>
						<view class="buttons">
							<view class="submitButton">
								<u-button type="primary" size="small" text="发送" color="#ff4646" throttleTime="1000" shape="circle" @click="sendComment()"></u-button>
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
		<!-- 回复弹出框 -->
		<view class="popup" v-if="type==1">
			<u-popup :show="popShow" :round="10" mode="bottom" @close="close" @open="open">
				<view class="popup-all">
					<view class="popup-content">
						<u--textarea class="input" v-model="replyContent" placeholder="请输入内容" count maxlength="250">
						</u--textarea>
						<view class="buttons">
							<view class="submitButton">
								<u-button type="primary" size="small" text="发送" color="#ff4646" throttleTime="1000" shape="circle" @click="sendReply(curr)"></u-button>
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
	import { sendComment , commentDigg, sendReply} from '@/config/api.js';
	export default {
		data() {
			return {
				newsinfo: {
					
				},
				empty:'',
				isdigg:false,
				islike:false,
				showAddComment: false,
				showCommenBar: true,
				addCommentFocus: false,
				commentContent: '',
				replyContent: '',
				replyCommentId: 0,
				replyNickname: '',
				fileList1:[],
				popShow: false,
				commentPic:'',
				commentList: [],
				hasMoreData: false,
				commentPage: 1 ,
				totalPage: 0,
				currComment:{},
				currIndex: -1,
				type: 0 // 评论还是回复
			}
		},
		//评论触底 滚动到底部
		async onReachBottom() {
			if (this.commentPage <= this.totalPage) {
				this.hasMoreData = true ;
				this.commentPage++ ;
				// console.log(this.hasMoreData)
				setTimeout(() => {
					this.getComment();
					this.hasMoreData = false ;
				}, 1000)
				
			}
			
		},
		async onLoad(option) { //option为object类型，会序列化上个页面传递的参数	
			//根据id获取新闻信息
			this.newsinfo.id = option.id ;
			await uni.$u.http.get('/news/' + String(option.id)).then(res => {
				this.newsinfo = res 
				// console.log(this.newsinfo) ;
			}).catch(err => {
				this.$u.toast('服务器异常')
			})
			
			//加载页面时判断该用户是否已经点赞
			if (this.currentToken) {
				uni.$u.http.get('/news/isDigg/' + String(this.currentUser.user.id) + '/' + String(option.id) ,{ custom: { auth: true }}).then(res => {
					//直接修改isdigg
					this.isdigg = res ;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
				
				// 加载页面时判断该用户是否已经收藏
				uni.$u.http.get('/news/isLike/' + String(this.currentUser.user.id) + '/' + String(option.id) ,{ custom: { auth: true }}).then(res => {
					this.islike = res ;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			
			}
			else {
				//未登录 默认未点赞和未收藏
				this.isdigg = false ;
				this.islike = false ;
			}
			// console.log(this.newsinfo)
			//加载所有评论
			await this.getComment();
			
		},
		async onShow() {
			//每次刷新用户当前点开的评论 提升用户体验
			var index = uni.getStorageSync("index");
			//根据评论id先获取评论信息
			await uni.$u.http.get("/comment/getById/" + String(this.commentList[index].id) + '/' + String(this.currentUser.user.id), {custom : {auth: true}}).then(res=> {
				//刷新该评论 记住无法强制刷新 所以弄个临时评论  然后再修改commentList列表   uni-app的bug
				this.currComment = res ;
				this.commentList[index] = res ;
				uni.removeStorageSync("index")
				// this.$forceUpdate();
				// console.log(this.commentList[index])
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
			
		},
		methods: {
			//发表评论
			async sendComment() {
				//发表一条评论需要 用户id , 用户头像昵称，直接本地获取，新闻的news_id也是本页面获取
				const params = {
					newsId : this.newsinfo.id ,
					content : this.commentContent ,
					userId : this.currentUser.user.id ,
					commentPic : this.commentPic
				}
				await sendComment(params, {custom: {auth: true}}).then((res) => {
					this.commentPage = 1 ;
					// console.log(res)
					this.getComment()
					this.$u.toast("评论成功")
				}).catch(() =>{
					this.$u.toast('服务器异常')
				})
				//关闭弹窗
				this.close();
				//清空评论内容
				this.commentContent = '';
			},
			//删除评论
			async deleteById(index) {
				console.log(this.commentList[index])
				await uni.$u.http.get("/comment/deleteById/" + String(this.commentList[index].id), {custom : {auth: true}}).then(res=> {
					// console.log(res)
					//删除该评论及其回复
					setTimeout(() => {
						this.commentList.splice(index, 1)
					},300)
					
					// console.log(this.commentList)
					this.$u.toast('删除成功')
				})
				.catch(err => {
					this.$u.toast('服务器异常')
				})
			},
			//发表回复 这里的回复全是回复某条评论的
			toReply(res,index) {
				this.toggle() ;
				this.type = 1 ;
				this.currComment = res ;
				this.currIndex = index ;
			},
			async sendReply(res) {
				//发表一条回复需要 用户id , 用户头像昵称，直接本地获取，新闻的news_id也是本页面获取
				
				const params = {
					commentId : this.currComment.id ,
					content : this.replyContent ,
					fromUid : this.currentUser.user.id ,
					toUid : this.currComment.id
					// commentPic : this.commentPic
				}
				await sendReply(params, {custom: {auth: true}}).then((res) => {
					//发表回复之后刷新该评论的回复信息 
					this.$u.toast("回复成功")
				}).catch(() =>{
					this.$u.toast('服务器异常')
				})
				//根据评论id先获取评论信息
				await uni.$u.http.get("/comment/getById/" + String(this.currComment.id) + '/' + String(this.currentUser.user.id), {custom : {auth: true}}).then(res=> {
					console.log(res)
					this.commentList[this.currIndex] = res
				})
				.catch(err => {
					this.$u.toast('服务器异常')
				})
				this.empty = '';
				//关闭弹窗
				this.close();
				//清空回复内容
				this.replyContent = '';
			},
			// 跳转到全部回复
			toAllReply(res,index) {
				uni.$u.route('/pages/news-detail/reply', {
					id: res.id ,
					index: index 
				});
			},
			// 点赞
			commentLike(index) {
				this.commentList[index].isDigg = !this.commentList[index].isDigg;
				//进行点赞
				const params = {
					userId : this.currentUser.user.id ,
					commentId : this.commentList[index].id ,
					isDigg : this.commentList[index].isDigg
				}
				commentDigg(params, {custom: {auth: true}}).then((res) => {
					//缓存token
					if (res == true) {
						this.commentList[index].diggCount++;
					} else {
						this.commentList[index].diggCount--;
					}
				}).catch(() =>{
					this.$u.toast('服务器异常')
				})
			},
			// 评论列表
			async getComment() {
				//通过newsId来获取新闻评论同时获取这些新闻的回复
				
				//先获取所有评论
				await uni.$u.http.get('/comment/getAll/' + String(this.newsinfo.id) + '/' + String(this.commentPage) + '/' + String(this.currentUser.user.id),{ custom: { auth: true }}).then(res => {
					this.totalPage = res.pageNum ;
					if (this.commentPage == 1) this.commentList = res.comments ;
					else {
						for (var i = 0 ; i < res.comments.length ; i++) {
							this.commentList.push(res.comments[i]);
						}
					}
					// console.log(res.comments[1].pic)
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
				
			},
			rightClick() {
				console.log('right')
			},
			
			/*复制*/
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: res => {
						this.$u.toast('原文链接已复制')
					}
				});
			},
			
			collect(){
				this.$u.throttle(this.collectNot,1500)
			},
			digg() {
				this.isdigg = !this.isdigg ;
				//点赞数+1或者减1
				uni.$u.http.get('/news/clickDigg/' + String(this.currentUser.user.id) + '/' + String(this.newsinfo.id) + '/' + String(this.isdigg),{ custom: { auth: true }}).then(res => {
					//页面显示的数字也加1
					// if (res) this.newsinfo.diggCount++;
					// else this.newsinfo.diggCount--;
					// console.log(this.newsinfo.followerCount)
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			},
			like() {
				this.islike = !this.islike ;
				//收藏数+1或者-1
				uni.$u.http.get('/news/clickLike/' + String(this.currentUser.user.id) + '/' + String(this.newsinfo.id) + '/' + String(this.islike) ,{ custom: { auth: true }}).then(res => {
					// if (res) this.newsinfo.followerCount++;
					// else this.newsinfo.followerCount--;
				}).catch(err => {
					this.$u.toast('服务器异常')
				})
			},
			//弹起输入框 代表评论
			toggle() {
				this.popShow = true ;
				this.type = 0;
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
						url: 'http://172.19.115.65:8081/upload', 
						filePath: url,
						name: 'file',
						success: (res) => {
							setTimeout(() => {
								// console.log(res.data)
								// this.user.info.avator = res.data
								// console.log(this.user.info.avator)
								this.commentPic = res.data 
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
		padding: 160rpx 25rpx 100rpx;
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
		margin: 30rpx 0;
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
				padding: 5rpx 0 ;
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
	.commentTitle {
		padding: 30rpx 30rpx;
		font-size: 38rpx;
	}
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
	.item-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: #eeeeee;
	}
	.float-empty {
		height: 120rpx;
		width: 100%;
		display: block;
		background: #fff;
	}
	
</style>
