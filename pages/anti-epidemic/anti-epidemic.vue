<template>
	<view>
		<!-- <view class="anti">
			<image src="../../static/anti.png">
				
			</image>
		</view> -->
		<uni-card title="全国疫情数据(含港澳台)" extra="每整点实时更新" cover="/static/anti.png">
			<u-grid :border="true" col="3">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex">
					<view class="box">
						<text class="grid-text">{{listItem.title}}</text>
						<text class="count1">{{listItem.total}}</text>
						<text class="grid-text">{{listItem.title2}}</text>
						<text v-if="listItem.today < 0" class="count2">{{listItem.today}}</text>
						<text v-else class="count2">+{{listItem.today}}</text>
					</view>
					
				</u-grid-item>
			</u-grid>
		</uni-card>
		<view class="sub">
			<u-subsection :list="area" :current="curNow" @change="sectionChange" active-color="#f56c6c"></u-subsection>
		</view>
		<!-- 中国疫情 -->
		<view v-if="curNow==0">
			<!-- <uni-card title="中国病例" extra="每整点实时更新"> -->
			<view class="tabel">
				<n-table
					:headerOpt="headerOpt"
					:nameOpt="{isShow:false,needMenu:false}"
					:tableOpt="{}"
					:tableHeight="0"
					:tableData="tableDataTree"
					:columns="columns"
					colKey="dataIndex"
					idKey="id"
					@clickMenu="onClickMenu"
					@onSort="doSort"
					@onClick="rowClick">
				</n-table>
			</view>
				
			<!-- </uni-card> -->
		</view>
		<view v-if="curNow==1">
			<!-- <uni-card title="中国病例" extra="每整点实时更新"> -->
			<view class="tabel">
				<n-table
					:headerOpt="headerOpt"
					:nameOpt="{isShow:false,needMenu:false}"
					:tableOpt="{}"
					:tableHeight="0"
					:tableData="tableDataTree2"
					:columns="columns2"
					colKey="dataIndex"
					idKey="id"
					@clickMenu="onClickMenu"
					@onSort="doSort"
					@onClick="rowClick">
				</n-table>
			</view>
				
			<!-- </uni-card> -->
		</view>
	</view>
</template>

<script>
	import {baseColumns, baseColumnsWorld} from "./tableData.js"
	export default {
		data() {
			return {
				list: [{
						title: '境外输入',
						title2: '较昨日',
						total: 0,
						today: 0
					},
					{
						title: '无症状感染者',
						title2: '较昨日',
						total: 0,
						today: 0
					},
					{
						title: '现有确诊',
						title2: '较昨日',
						total: 0,
						today: 0
					},
					{
						title: '累计确诊',
						title2: '较昨日',
						total: 0,
						today: 0
					},
					{
						title: '累计死亡',
						title2: '较昨日',
						total: 0,
						today: 0
					},
					{
						title: '累计治愈',
						title2: '较昨日',
						total: 0,
						today: 0
					},
				],
				area:['中国疫情' , '世界疫情' , '实时播报'],
				curNow : 0,
				allProvinces : [],

				columns: false,
				columns2: false,
				headerOpt: {},
				tableDataTree: [],
				tableDataTree2: [],
				currentPage: 1,
				totalPage: 10,
			}
		},
		async onLoad() {
		
			//每次打开该页面请求接口也返回全国疫情数据
			uni.$u.http.get("http://localhost:5000/epidemic/china").then(res=> {
				// console.log(res)
				this.list[0].total = res.input ;
				this.list[0].today = res.input_yesterday ;
				this.list[1].total = res.noasympto ;
				this.list[1].today = res.noasympto_yesterday ;
				this.list[2].total = res.today_confirm ;
				this.list[2].today = res.today_confirm_yesterday ;
				this.list[3].total = res.total_confirm ;
				this.list[3].today = res.total_confirm_yesterday ;
				this.list[4].total = res.total_dead ;
				this.list[4].today = res.total_dead_yesterday ;
				this.list[5].total = res.total_heal ;
				this.list[5].today = res.total_heal_yesterday ;
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
			//先将数据写入tabelData.js中
			uni.$u.http.get("http://localhost:5000/epidemic/allProvinces").then(res=> {
				// console.log(res)
				this.columns = baseColumns
				for (var i = 0 ; i < res.length ; i++) {
					var temp = {}
					temp.id = res[i].id
					temp.name = res[i].name
					temp.now_confirm = res[i].total.confirm - res[i].total.dead - res[i].total.heal
					temp.all_confirm = String(res[i].total.confirm)  + '\n(+' + String(res[i].today.confirm) + ')'
					temp.dead = res[i].total.dead
					temp.heal = res[i].total.heal
					
					//更新每个市的疫情数据
					temp.children = []
					for (var j = 0 ; j < res[i].children.length ;j++) {
						var temp1 = {}
						temp1.id = res[i].children[j].id
						temp1.name = res[i].children[j].name
						temp1.now_confirm = res[i].children[j].total.confirm - res[i].children[j].total.dead - res[i].children[j].total.heal
						temp1.all_confirm = res[i].children[j].total.confirm
						temp1.dead = res[i].children[j].total.dead
						temp1.heal = res[i].children[j].total.heal
						temp.children.push(temp1)
					}
					// this.tableDataTree[i].children = res[i].children
					this.tableDataTree.push(temp)
				}
				// console.log(this.tableDataTree)
				
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
			
			//获取世界各个国家的疫情
			uni.$u.http.get("/epidemic/world").then(res=> {
				// console.log(res)
				this.columns2 = baseColumnsWorld
				this.tableDataTree2 = res
			})
			.catch(err => {
				this.$u.toast('服务器异常')
			})
		},
		methods: {
			click(name) {
				this.$refs.uToast.success(`点击了第${name}个`)
			},
			sectionChange(index) {
				this.curNow = index;
			},
			open(e) {
			  // console.log('open', e)
			},
			close(e) {
			  // console.log('close', e)
			},
			change(e) {
			  // console.log('change', e)
			},
			onNextPage(page) {
				this.currentPage++
				this.tableData = false
				setTimeout(() => {
					this.tableData = baseColumnsData
				}, 2000)
			},
			onPrevPage(page) {
				this.currentPage--
				this.tableData = false
				setTimeout(() => {
					this.tableData = baseColumnsData
				}, 2000)
			},
			// 排序时间
			doSort(res) {
				uni.showToast({
					title: `点击了${res.sortKey}的排序, 排序方式为${res.sortType}`,
					icon: "none"
				})
			},
			
			rowClick(row, col) {
				console.log(' =====> row', row);
				console.log(' =====> col', col);
				uni.showToast({
					// title: `数据被点击`,
					icon: 'none'
				})
			},
			
			onClickMenu() {
				uni.showToast({
					title: '点击菜单',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.anti {
	padding: 0 25rpx;
}
.box {
	display: flex;
	flex-direction: column;
	position: relative;
	// height: 275rpx;
	align-items: center;
	justify-content: space-between;
	.grid-text {
		font-size: 10rpx;
		color: #000000;
		// padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
	.count1 {
		font-size: 40rpx;
		color: #00aa00;
		// padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
	.count2 {
		font-size: 20rpx;
		color: #ff0000;
		// padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
}	
.sub {
	padding: 20rpx;
}
.tabel {
	padding: 20rpx;
}
</style>
