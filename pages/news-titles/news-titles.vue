<template>
	<view>
		hello
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: 'uni-app'
			}
		},
		onLoad: function (options) {
			setTimeout(function () {
				console.log('start pulldown');
			}, 1000);
			uni.startPullDownRefresh();
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style>

</style>
