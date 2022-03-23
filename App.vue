<script>
	import { version } from '@/uni_modules/z-paging/package.json'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	page {
		background-color: white;
	}
	/* #endif */
	.content{
		background-color: white;
	}
	
</style>
