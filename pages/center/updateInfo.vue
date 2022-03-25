<template>
	<view class="update">
		<view class="uploadAvator">
			<view class="updateav">
				<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						multiple
						:maxCount="1"
						:previewFullImage="true"
						width="200rpx"
						height="200rpx"
				>
				<u-avatar :src="currentUser.user.avator" size="100" shape="square"></u-avatar>
				</u-upload>
			</view>
		</view>
		<!-- <image src="https://newsapp-lucky.oss-cn-hangzhou.aliyuncs.com/avator/2022/03/5e53b43cd1004ad8ab98b42af641dd301648042688(1).png"></image> -->
		<u--form labelPosition="left" :model="user" :rules="rules" ref="form1">
			<!-- 昵称 -->
			<u-form-item label="昵称" prop="info.name" borderBottom ref="item1">
				<u--input v-model="user.info.name" border="none"></u--input>
			</u-form-item>
			<!-- 简介 -->
			<u-form-item label="简介" prop="info.desc" borderBottom ref="item1">
				<u--textarea v-model="user.info.desc" placeholder="请输入内容" 
				border="bottom" count maxlength="100"></u--textarea>
			</u-form-item>
			<!-- 性别 -->
			<u-form-item label="性别" prop="info.sex" borderBottom 
			@click="showSex = true" ref="item1">
				<u-picker v-model="user.info.sex" :show="showSex" :columns="sexs" 
				@confirm="confirmSex" @cancel="cancelSex" :closeOnClickOverlay="true"></u-picker>
				<u-icon slot="right" name="arrow-right" :label="user.info.sex" labelPos="left"></u-icon>
			</u-form-item>
			<!-- 地区 -->
			<u-form-item label="地区" prop="info.area" borderBottom ref="item1" 
			@click="showArea = true">
				<u-picker v-model="user.info.area" ref="uPicker" :show="showArea" :columns="provinces"
				@confirm="confirmArea" @cancel="cancelArea" @change="changeHandler" :closeOnClickOverlay="true"></u-picker>
				<u-icon slot="right" name="arrow-right" :label="user.info.area" labelPos="left"></u-icon>
			</u-form-item>
			<!-- 生日 -->
			<u-form-item label="生日" prop="info.bitrh" borderBottom ref="item1"
			@click="showDate = true">
				<u-datetime-picker :show="showDate" v-model="nowTime" mode="date"
				@confirm="confirmDate" @cancel="cancelDate":minDate="-2209017600000" :maxDate="nowTime" :closeOnClickOverlay="true"></u-datetime-picker>
				<u-icon v-if="user.info.birth" slot="right" name="arrow-right" :label="user.info.birth | formatDate" labelPos="left"></u-icon>
				<u-icon v-else slot="right" name="arrow-right" :label="user.info.birth" labelPos="left"></u-icon>
			</u-form-item>
		</u--form>
		<view class="submitButton">
			<u-button size="normal" type="primary" text="提交" color="#ff4646" @click="submit()" throttleTime="1000"></u-button>
		</view>
	</view>
</template>

<script>
import { updateUserInfo , getUserInfo} from '@/config/api.js';
export default {
	data() {
		return {
			fileList1: [] ,
			showSex: false,
			showDate: false,
			nowTime: Number(new Date()),
			sexs: [
				['男', '女', '保密']
			],
			showArea: false,
			provinces: [
				['北京市','安徽省','上海市','江苏省','广东省','山东省','河南省','河北省','浙江省',
			    '陕西省','湖南省','重庆市','福建省','天津市','云南省','四川省',
				'广西壮族自治区','海南省','江西省','湖北省','山西省','辽宁省','黑龙江省',
				'内蒙古自治区','贵州省','甘肃省','青海省',
				'新疆维吾尔自治区','西藏自治区','吉林省','宁夏回族自治区'],["东城区","西城区","朝阳区","丰台区","石景山区","海淀区","门头沟区","房山区","通州区","顺义区","昌平区","大兴区","怀柔区","平谷区","密云区","延庆区"],
			],
			cities: [],
			user: {
				info: {
					name: '',
					sex: '',
					desc: '',
					area: '',
					birth:'',
					avator:''
				},
			},
			rules: {
				'info.name': {
					type: 'string',
					required: true,
					message: '请填写昵称',
					trigger: ['blur', 'change']
				},
			},
			radio: '',
			switchVal: false,
			localPic:""
		};
	},
	onLoad() {
		//获取当前用户信息
		if (this.currentUser.user.nickname == undefined) this.user.info.name = ''
		else this.user.info.name = this.currentUser.user.nickname
		if (this.currentUser.user.sex == 0) this.user.info.sex = '女'
		else if (this.currentUser.user.sex == 1) this.user.info.sex = '男'
		else if (this.currentUser.user.sex == 2) this.user.info.sex = '保密'
		else this.user.info.sex = '保密'
		if (this.currentUser.user.birthday == undefined) this.user.info.birth = ''
		else this.user.info.birth = this.currentUser.user.birthday
		if (this.currentUser.user.area == undefined) this.user.info.area = ''
		else this.user.info.area = this.currentUser.user.area
		if (this.currentUser.user.avator == undefined) this.user.info.avator = ''
		else this.user.info.avator = this.currentUser.user.avator
		if (this.currentUser.user.description == undefined) this.user.info.desc = ''
		else this.user.info.desc = this.currentUser.user.description
		
		//读取省市信息
		var areas = require('./areas.json');
		var pros = this.provinces[0]
		for (var i = 0 ; i < pros.length ; i++) {
			this.cities.push(areas[pros[i]]);
		}
	},
	methods: {
		confirmSex(e){
			this.showSex = false
			this.user.info.sex = e.value[0]
		},
		cancelSex(e) {
			this.showSex = false
		},
		changeHandler(e) {
			const {
				columnIndex,
				value,
				values, // values为当前变化列的数组内容
				index,
				// 微信小程序无法将picker实例传出来，只能通过ref操作
				picker = this.$refs.uPicker
			} = e
			// 当第一列值发生变化时，变化第二列(后一列)对应的选项
			if (columnIndex === 0) {
				// picker为选择器this实例，变化第二列对应的选项
				picker.setColumnValues(1, this.cities[index])
			}
		},
		confirmArea(e){
			this.showArea = false
			this.user.info.area = e.value[0]+e.value[1]
		},
		cancelArea(e) {
			this.showArea = false
		},
		confirmDate(e){
			// console.log(e)
			this.showDate = false
			this.user.info.birth = e.value
		},
		cancelDate(e) {
			this.showDate = false
		},
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1)
		},
		// 新增图片
		async afterRead(event) {
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
					url: 'http://172.19.115.65:8081/upload', // 仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					success: (res) => {
						setTimeout(() => {
							// console.log(res.data)
							this.user.info.avator = res.data
							console.log(this.user.info.avator)
							resolve(res.data.data)
						}, 1000)
					}
				});
			})
		},
		async submit() {
			//将性别用数字替换
			var currntSex ;
			if (this.user.info.sex == '男') currntSex = 1;
			else if (this.user.info.sex == '女') currntSex = 0 ;
			else currntSex = 2;
			const params = {
				nickname : this.user.info.name ,
				sex: currntSex,
				description : this.user.info.desc ,
				area: this.user.info.area ,
				birthday: this.user.info.birth,
				avator: this.user.info.avator
			}
			console.log("123")
			//执行修改请求
			await updateUserInfo(params, { custom: { auth: true }}).then((res) => {
				// console.log(res)
				this.$u.toast('提交成功')
			}).catch(() =>{
				console.log(res)
			})
			
			//修改成功后， 也需要刷新token  然后获取新的用户信息
			await uni.$u.http.get('/user/refreshToken/' + String(this.currentUser.user.id)).then(res => {
				this.$u.vuex('currentToken' , res.token) ;
			}).catch(err => {
				this.$u.toast('服务器异常')
			})
			//获取新的用户信息
			await getUserInfo({ custom: { auth: true }}).then((res) => {
				//保存用户信息
				this.$u.vuex('currentUser' , res) ;
				console.log(res)
			}).catch(() =>{
				this.$u.toast('服务器异常')
			})
			
		}
	},
	filters: {
	   formatDate: function (value) {
		var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		var D = date.getDate() + ' ';
		var h = date.getHours() + ':';
		var m = date.getMinutes() + ':';
		var s = date.getSeconds();
		return Y+M+D;
	  }
	},
};
</script>

<style>
.update {
	padding: 10rpx 20rpx;
}
.uploadAvator {
	display: flex;
    justify-content: center;
    align-items: center;
	padding: 60rpx 0;
	
}
.submitButton {
	/* width: 200rpx; */
	padding: 60rpx 200rpx;
}
</style>
