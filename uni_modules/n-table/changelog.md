## 1.0.5（2022-04-08）

1. fix: 修复内部分页上一页失效 *[2022年4月8日]*  
2. fix: 修复报错 `Right-hand side of 'instanceof' is not an object`。组件部分`props`格式写错了 *[2022年4月8日]*  
3. add: 增加分页组件样式配置(config.js -> defaultPagerOpt 新增对应默认配置 ): *[2022年4月8日]*  
	 1. `pagerOpt -> btnFontSize` 按钮文字大小  
	 2. `pagerOpt -> btnFontColor` 按钮文字颜色  
	 3. `pagerOpt -> btnFontBold` 按钮文字是否加粗
	 4. `pagerOpt -> btnCustomClass` 按钮自定义类
	 5. `pagerOpt -> numFontSize` 页码字体大小
	 6. `pagerOpt -> numFontColor` 页码字体颜色
	 7. `pagerOpt -> numFontBold` 页码字体是否加粗
5. other: **感谢@gzakay的反馈**

> 示例、文档已同步更新
## 1.0.4（2022-04-07）
1. remove:  tableOpt -> itemHeight 配置,表格内部单元格高度自动撑开（文字超出自动换行）[2022年4月7日]
2. change：首列非树形结构对齐方式与 tableOpt -> textAlign 对齐，树形结构固定作对齐 [2022年4月7日]
3. add: 分页对外开放（可在外部处理），具体影响： [2022年4月7日]
	 1. props -> currentPage 当前页  参数类型：Boolean | Number；Boolean类型表示内部处理分页，Number类型表示外部处理，内部不做处理
	 2. props -> totalPage 总页数  
	 3. event  @onNextPage(currentPage) -> 下一页方法 返回当前页码
	 4. event  @onPrevPage(currentPage) -> 上一页方法 返回当前页码
4. change: 调整Loading样式，Loading过程中（tableData = false时会触发loading状态）无法点击其他 [2022年4月7日]
5. fix: 修复树形结构折叠无法折叠三层子集以下的bug [2022年4月7日]
6. other： **感谢@gzakay提的建议**

> 文档相关已更新
## 1.0.3（2022-04-01）
1. fix: 修复 headerOpt -> color 不生效 [2022年4月1日]
2. 新增分页功能，详细请看文档相关配置 [2022年4月1日]

## 1.0.2（2022-04-01）
1. add: 新增 columns 配置： customName , 别名；如果 customName 存在 则优先显示，否则显示 title
2. fix: 修复表格名称居中显示实际没有居中的问题
3. fix: 修复事件冒泡处理点击无反应的问题：click.native.stop --> click.stop(感谢 463***@qq.com 指出)

## 1.0.1 (2022-03-25)
1. fix: 修复tableHeight 高度计算不正确问题，现在这个高度会包括表格名称高度   
2. add: 新增 `props -> autoSort : Boolean default: true;` 组件内自动响应排序，默认true 详细请看文档
3. update: 移除数据错误提示

## 1.0.0（2022-03-22）
版本发布