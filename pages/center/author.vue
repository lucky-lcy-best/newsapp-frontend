<template>
	<view class="u-page">
			<u-list
				@scrolltolower="scrolltolower"
			>
				<u-list-item
					v-for="(item, index) in authorList"
					:key="index"
				>
					<u-cell
						:title="item.author"
						@click="goDetail(item.creatorUid)"
					>
						<u-avatar
							slot="icon"
							shape="circle"
							size="35"
							:src="item.avatorUrl"
							customStyle="margin: -3px 5px -3px 0"
						></u-avatar>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				authorList: [],
			};
		},
		onLoad() {
			//获取用户关注列表
			uni.$u.http.get("/news/getUserFollowAuthor/" + String(this.currentUser.user.id), {custom : {auth: true}}).then(res=> {
				console.log(res)
				this.authorList = res ;
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
		},
		methods: {
			scrolltolower() {
				this.loadmore()
			},
			goDetail(uid) {
				uni.$u.route('/pages/news-detail/author', {
					creatorUid: uid ,
				});
			}
			
			
		},
	}
</script>

<style lang="scss">

</style>
