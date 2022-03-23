import Vue from 'vue'
import App from './App'
import request from '@/http/request.js'

Vue.config.productionTip = false
Vue.prototype.$request = request
App.mpType = 'app'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

const app = new Vue({
	store,
    ...App
})

//自定义工具
import utils from '@/config/utils.js';
Vue.use(utils,app)

// 引入请求封装，将app参数传递到配置中
require('@/config/request.js')(app)

app.$mount()
