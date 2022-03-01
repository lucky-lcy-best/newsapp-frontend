import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
    ...App
})

// // 引入请求封装，将app参数传递到配置中
// require('/config/request.js')(app)

app.$mount()
