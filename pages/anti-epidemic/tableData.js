// 中国疫情的表头
export const baseColumns = [
	{ "title": "地区", "dataIndex": "name" , width: 150},
	{ "title": "现有确诊", "dataIndex": "now_confirm", "color": "#ca1610" , "bodyColor": '#ca1610', height: 100,width: 150 ,formatNum: false},
	{ "title": "确诊(较昨日)", "dataIndex": "all_confirm" , width: 160,formatNum: false},
	{ "title": "死亡", "dataIndex": "dead" , width: 120,formatNum: false},
	{ "title": "治愈", "dataIndex": "heal" , width: 150,formatNum: false,"color": "green" , "bodyColor": 'green'},

]
// 世界疫情的表头
export const baseColumnsWorld = [
	{ "title": "地区", "dataIndex": "name" , width: 150},
	{ "title": "新增确诊", "dataIndex": "incConfirm", "color": "#ca1610" , "bodyColor": '#ca1610', height: 100,width: 150 ,formatNum: false},
	{ "title": "累计确诊", "dataIndex": "allConfirm" , width: 160,formatNum: false},
	{ "title": "死亡", "dataIndex": "dead" , width: 120,formatNum: false},
	{ "title": "治愈", "dataIndex": "heal" , width: 150,formatNum: false,"color": "green" , "bodyColor": 'green'},

]
