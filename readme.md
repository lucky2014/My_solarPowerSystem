# 修改记录

1. 大屏地图：

	（1）百度地图采用白色底，与白底配合弹框依然采用白色底（直角，与左边统计相匹配）、透明。

	（2）增加功能：鼠标移到标识物弹框出来（右边的电站信息没变），移开弹框不隐藏，防止将点击的弹框隐藏掉。点击时弹框出来，右边电站信息相应变化。

	（3）弹框增加字段：地址，位置在第三行。

	（4）增加显示功能：地图放大时，具体的路名显示出来。

	（5）增加地图最小放大倍数为8。

2. 组件发电详情图表：

	（1）修复了没有发电的通道也显示发电量的问题。

	（2）功率和年选项时，SMU项靠右对齐。

3. 修复脚部版权问题。

4. 电站详情页：增加收缩展开按钮，收缩天气和电站基本详情。

5. 所有图表：修复了电站图表单位大小写不统一的情况。

6. 首页新需求：

	（1）首页显示120秒后，banner大图自动展开播放大图，有返回按钮。 

	（2）大图播放间隔30秒。 

	（3）大图播放一遍后，返回首页。优化了返回时加载过慢的问题。将最后一次刷新的接口返回数据保存在sessionStorage，第一次先去sessionStorage里的值，然后再刷新。这样解决了所有刷新都在一个页面引起内存泄露的问题，但最终不是解决方案，很多浏览器不支持。是不是将最后一次刷新的数据保存到一个文档里？然后读取数据流呢?