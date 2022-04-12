<template>
	<view class="n-table-title">
		<view class="header-item"
			v-for="(item, index) in columns"
			:key="index"
			:class="{'header-sticky': stickSide && index === 0}"
			:style="{background:opt.bg, color:opt.color, fontWeight:opt.bold ? 'bold' : 'normal'}">
			<titleColumn
				:isOpenAll="isOpenAll"
				:item="item"
				:height="opt.height"
				:fontSize="opt.fontSize"
				:titleTextAlign="opt.align"
				:textColor="opt.color"
				:bg="opt.bg"
				:nowSortKey="nowSortKey"
				:sortType="sortType"
				@sort="onSort"
				@toggleTree="onToggleTree"
				:isTree="isTree"
				:firstCol="index === 0"
				:colKey="colKey"></titleColumn>
		</view>
	</view>
</template>

<script>
	import titleColumn from "./title-column.vue"
	export default {
		name: 'tableHeader',
		components: { titleColumn },
		props: {
			nowSortKey: { type: String, default: '' },
			sortType: { type: String, default: '' },
			colKey: { type: String, default: 'key' },
			isOpenAll: { type: Boolean, default: false },
			isTree: { type: Boolean, default: false },
			columns: {
				type: [Array, Boolean],
				default: () => []
			},
			stickSide: {
				type: Boolean,
				default: true
			},
			opt: {
				type: Object,
				default: () => {}
			},

		},
		methods: {
			onSort(item) {
				this.$emit('rowSort', {
					sortKey: item[this.colKey]
				})
			},
			// 展开全部/收起全部 树
			onToggleTree(oldStatus) {
				this.$emit('toggleTree', oldStatus)
			},
		}
	}
</script>

<style scoped lang="scss">
	.n-table-title {
		position: sticky;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		display: flex;
		justify-content: flex-start;
	}

	.border-right {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			height: 100%;
			right: 0;
			top: 0;
			width: 1rpx;
			background-color: #dbdbdb;
		}
	}

	.header-sticky {
		position: sticky;
		left: 0;
		z-index: 2;
	}
</style>
