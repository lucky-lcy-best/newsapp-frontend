<template>
	<view>
		<template v-for="(row, iIndex) in dataList">
			<view class="n-table-container-row"
				v-if="row.level === 0 || checkOpen(row.parentIds[row.parentIds.length - 1])"
				:key="iIndex">
				<view
					:class="['n-table-container-col', { 'head-row': jIndex == 0,  'n-table-stick-side': stickSide && jIndex == 0 , 'text-left': textAlign === 'left' && !isTree, 'text-center': textAlign === 'center' && !isTree, 'text-right': textAlign === 'right' && !isTree }]"
					:style="{ 
						width: getItemStyle(col).width,
					  paddingLeft: jIndex == 0 ? ( isTree ? (row.level + 1) : row.level  )*16 + 'rpx' : '16rpx',
					 }"
					v-for="(col, jIndex) in dataIndexs"
					:key="jIndex" @click.stop="itemClick(row, col)">
					<!-- 展开 -->
					<!-- 	height: height ? height + 'rpx' : '64rpx',
						lineHeight:height ? height + 'rpx' : '64rpx', -->
					<view
						class="open-child"
						v-if="jIndex === 0"
						@click.stop="toggleOpen(row)">
						<view
							v-if="row.hasChildren"
							class="iconfont"
							style="font-size: 12px;"
							:class="checkOpen(row[idKey]) ? 'icon-arrow-up' : 'icon-arrow-down'"></view>
						<view class="" v-else style="padding-left:20rpx;"> </view>
					</view>

					<view
						:class="['n-table-col-text', {'text-left': textAlign === 'left' || jIndex === 0 , 'text-center': textAlign === 'center' && jIndex !== 0, 'text-right': textAlign === 'right' && jIndex !== 0}]"
						:style="{color: col.bodyColor || color, fontSize: fontSize + 'rpx'}">
						<view class="tx-content" v-if="!col.isLink && !col.isImage" v-html="getRowContent(row, col)">
						</view>

						<!-- 图片 -->
						<view v-if="col.isImage" class="n-table-col-img">
							<image
								v-if="row[col[colKey]]"
								@click="preViewImg(row[col[colKey]])"
								:src="row[col[colKey]]" mode="heightFix"
								:style="{width: col.width ? col.width + 'rpx' : '64rpx', height:col.height ? col.height + 'rpx' : '64rpx'}">
							</image>
							<view class="" v-else>
								-
							</view>
						</view>

						<!-- 链接 -->
						<template v-if="col.isLink">
							<!-- #ifdef H5 -->
							<router-link v-if="setUrl(row, col).indexOf('http') != 0"
								:to="setUrl(row, col)" v-html="getRowContent(row, col)"></router-link>
							<a v-else :href="setUrl(row, col)"
								v-html="getRowContent(row, col)"></a>
							<!-- #endif -->

							<!-- #ifndef H5 -->
							<navigator :url="setUrl(row, col)"
								v-html="getRowContent(row, col)"></navigator>
							<!-- #endif -->
						</template>

					</view>

				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'tableBody',
		props: {
			// 单元格高度
			// height: { type: Number, default: 64 },
			colKey: { type: String, default: 'key' },
			idKey: { type: String, default: 'id' },
			dataIndexs: { type: Array, default: () => [] },
			stickSide: { type: Boolean, default: false },
			textAlign: { type: String, default: 'center' },
			fontSize: { type: [Number, String], default: 24 },
			color: { type: String, default: '#333' },
			// 是否展开全部
			isOpenAll: { type: Boolean, default: false },
			isTree: { type: Boolean, default: false },
			dataList: {
				type: [Array, Boolean],
				default: () => []
			}
		},
		data() {
			return {
				openList: [],
				canOpenObj: {}, // 保存所有能展开的列Id
				needToogleTree: true
			}
		},
		watch: {
			isOpenAll(val) {
				if (!this.needToogleTree) return
				if (val) {
					this.openAll()
				} else {
					this.closeAll()
				}
			},
			dataList: {
				handler(val) {
					this.updataCanOpen(val)
				},
				deep: true,
				immidate: true
			}
		},
		methods: {
			// 计算宽度
			getItemStyle(item) {
				let { width, children } = item
				width = width || 200
				if (typeof width != "number") {
					width = 200
				}
				let height = '64rpx'
				let lineHeight = '64rpx'
				if (children && children.length) {
					width = children.length * width
				}
				return { width: width + 'rpx', height, lineHeight }
			},

			// 更新可展开id对象
			updataCanOpen(list) {
				if (!list || !list.length) {
					this.canOpenObj = {}
					return
				}
				this.canOpenObj = Object.assign({},
					list.reduce((obj, item) => {
						// 保存子列id
						if (item.hasChildren) obj[item[this.idKey]] = item.children.reduce((ls, item) => ls.concat(
							item[this.idKey]), [])
						return obj
					}, {}))
			},

			// 点击行展开、收起时触发
			// 判断是否全部已展开/收起
			checkIsAll() {
				this.needToogleTree = false
				if (this.isOpenAll) {
					// 判断是否已全部关闭 -- 通知 title-column 改变按钮状态
					if (this.openList.length === 0) this.$emit('toggleTree', true)
				} else {
					// 判断是否已全部打开 -- 通知 title-column 改变按钮状态
					let hasOpenAll = true
					let idx
					Object.keys(this.canOpenObj).forEach(key => {
						idx = this.openList.findIndex(item => item === key)
						if (idx <= -1) hasOpenAll = false
					})
					if (hasOpenAll) this.$emit('toggleTree', false)
				}
				this.$nextTick(() => {
					this.needToogleTree = true
				})
			},

			// 打开所有
			openAll() {
				this.openList = this.dataList.reduce((ls, item) => {
					return item.hasChildren ? ls.concat(item[this.idKey]) : ls
				}, [])
			},

			// 关闭所有
			closeAll() {
				this.openList = []
			},

			// 点击 展开/收起
			toggleOpen(row) {
				if (!this.checkOpen(row[this.idKey])) {
					// 展开
					this.openList.push(row[this.idKey]);
				} else {
					// 收起
					this.closeChild(row[this.idKey])
				}
				// 判断更新是否已经全部关闭/打开了
				this.checkIsAll()
			},

			// 收起所有子行
			closeChild(id) {
				let idx = this.openList.findIndex(item => item == id)
				// 移除自身
				this.openList.splice(idx, 1)
				// 移除子项
				this.canOpenObj[id] && this.canOpenObj[id].forEach(item => {
					idx = this.openList.findIndex(key => key == item)
					if (idx >= 0) this.openList.splice(idx, 1)
				})
			},

			// 格式化数字
			numTransform(n) {
				if (Number.isNaN(n - 0)) {
					return n
				}
				if (Math.abs(n) >= 100000000) {
					n = Number((n / 100000000).toFixed(1)) + '亿'
				} else if (Math.abs(n) >= 10000) {
					n = Number((n / 10000).toFixed(1)) + '万'
				}
				return n.toString()
			},

			// 获取当前显示文本
			getRowContent(row, col) {
				// 表格值处理函数
				// 如果columns带了key则显示对应的key
				// 如果columns带的format则按规定返回format后的html
				// format规定: params names <Array> 对应tableData的键名,作为匹配template中两个#之间动态内容的名字
				//			   params template <String> html字符串模版
				let tempHTML = ''
				let rowKey = row[col[this.colKey]]
				if (!rowKey) return '-'
				if ([null, ''].includes(rowKey)) {
					rowKey = '-'
				}
				let { formatNum = true } = col
				if (rowKey || rowKey === 0) {
					tempHTML = isNaN(rowKey - 0) || !formatNum ?
						rowKey :
						this.numTransform(rowKey - 0)
					// tempHTML = tempHTML == 0 ? "-" : tempHTML
				} else if (!!col.format) {
					let tempFormat = col.format.template
					col.format.names.map(item => {
						let regexp = new RegExp(`\#${item}\#`, 'mg')
						tempFormat = tempFormat.replace(regexp, row[item])
					})
					tempHTML = tempFormat
				} else if (!col.render) {
					let error = new Error('数据的key或format值至少一个不为空')
					throw error
				}
				return tempHTML.toString()
			},

			// 图片预览 
			preViewImg(src) {
				uni.previewImage({
					urls: [src],
					current: src
				})
			},

			// 判断是否展开子列
			checkOpen(id) {
				return ~this.openList.findIndex(o => o === id);
			},

			// 行点击
			itemClick(row, col) {
				this.$emit('onClick', row, col)
			},

			setUrl(row, col) {
				if (!col.isLink) return
				let urlParam = {}
				let { isLink: { url, params = [] } } = col
				params.forEach(item => {
					if (~item.indexOf('|')) {
						let temp = item.split('|')
						urlParam[temp[0]] = row[temp[1]]
					} else {
						urlParam[item] = row[item]
					}
				})
				url = this.setUrlParams(url, urlParam)
				return url
			},

			setUrlParams(url, params) {
				let tempUrl = url
				Object.keys(params).forEach(item => {
					tempUrl += `&${item}=${params[item]}`
				})
				tempUrl = tempUrl.replace(/\&/, '?')
				return tempUrl
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "./iconfont.scss";

	.n-table-container-row {
		display: flex;
		width: fit-content;
		white-space: nowrap;
		box-sizing: border-box;
		z-index: 0;
		border-bottom: solid 1rpx #f4f4f4;
		box-sizing: border-box;

	}

	.n-table-container-col {
		// @include ellipsis();
		display: inline-flex;
		padding: 16rpx 10rpx;
		// height: 64rpx;
		align-items: center;
		// line-height: 64rpx;
		box-sizing: border-box;
	}

	.n-table-stick-side {
		position: sticky;
		left: 0;
		background: #f7f9ff;
		border-right: solid 1rpx #dbdbdb;
		box-sizing: border-box;
	}

	.head-row .n-table-col-text {
		width: auto;
		flex: unset;
	}

	.n-table-col-text {
		display: flex;
		width: 100%;
		flex: 1;
		justify-content: flex-start;
		align-content: center;

	}

	.text-left {
		justify-content: flex-start;
	}

	.text-center {
		justify-content: center;
	}

	.text-right {
		justify-content: flex-end;
	}

	.n-table-col-img {
		display: flex;
		justify-content: center;
	}

	.open-child {
		position: relative;

		&::after {
			z-index: 2;
			position: absolute;
			content: '';
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			padding-right: 30rpx;
		}
	}

	.tx-content {
		max-width: 100%;
		white-space: pre-wrap;
		overflow: hidden;
	}
</style>
