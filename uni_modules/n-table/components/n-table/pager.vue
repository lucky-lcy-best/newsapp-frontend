<template>
	<view class="pager-wrap border-top" v-if="totalPage > 0">
		<view
			class="pager-prev pager-btn border"
			:style="{fontSize:btnStyle.fontSize, color:btnStyle.color, fontWeight: btnFontBold ? 'bold' : 'normal' }"
			:class="[btnCustomClass, {disabled: curPage <= 1}]"
			@click="onPrevPage">
			上一页
		</view>
		<view
			class="pager-num"
			:style="{fontSize:numStyle.fontSize, color:numStyle.color , fontWeight: numFontBold ? 'bold' : 'normal'}">
			<text class="cur-num"> {{curPage}} </text>
			<text> / </text>
			<text class="total-num"> {{totalPage}} </text>
		</view>
		<view
			class="pager-next pager-btn border"
			:style="{fontSize:btnStyle.fontSize, color:btnStyle.color,fontWeight: btnFontBold ? 'bold' : 'normal' }"
			:class="[btnCustomClass, {disabled: curPage >= totalPage}]"
			@click="onNextPage">
			下一页
		</view>
	</view>
</template>

<script>
	export default {
		name: 'pager',
		props: {
			curPage: {
				type: Number,
				default: 1
			},
			totalPage: {
				type: Number,
				default: 0
			},
			btnFontSize: {
				type: Number,
				default: 26
			},
			btnFontColor: {
				type: String,
				default: '#333'
			},
			btnFontBold: {
				type: Boolean,
				default: false
			},
			numFontSize: {
				type: [Number, String],
				default: 26
			},
			numFontColor: {
				type: String,
				default: '#333'
			},
			numFontBold: {
				type: Boolean,
				default: false
			},
			btnCustomClass: {
				type: String,
				default: ''
			}
		},
		computed: {
			btnStyle() {
				let fontSize = typeof this.btnFontSize == 'string' ? this.btnFontSize : uni.upx2px(this.btnFontSize) + 'px'
				return {
					fontSize,
					color: this.btnFontColor
				}
			},
			numStyle() {
				let fontSize = typeof this.numFontSize == 'string' ? this.numFontSize : uni.upx2px(this.numFontSize) + 'px'
				return {
					fontSize,
					color: this.numFontColor
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {
			onPrevPage() {
				if (this.curPage <= 1) return
				this.$emit('prevPage')
			},
			onNextPage() {
				if (this.curPage >= this.totalPage) return
				this.$emit('nextPage')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pager-wrap {
		height: 64rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0rpx 20rpx;
		z-index: 112;
	}

	.pager-btn {
		// padding: 10rpx 20rpx;
		background-color: #f8f8f8;
		padding: 5rpx 10rpx;
		font-size: 26rpx;
		border-radius: 3px;
		// border: .5rpx solid #999999;
		color: #19191b;
	}

	.pager-btn.disabled {
		opacity: .6;
	}

	.border-top {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			width: 200%;
			height: 1rpx;
			transform-origin: left top;
			transform: scale(.5);
			left: 0;
			top: 0;
			background-color: #c0c4cc;
		}
	}

	.border {
		position: relative;

		&::after {
			border-radius: 3px;
			content: '';
			position: absolute;
			width: 200%;
			height: 200%;
			transform-origin: left top;
			transform: scale(.5);
			left: 0;
			top: 0;
			border: 1rpx solid #c0c4cc;
			pointer-events: none;
		}
	}
</style>
