<template>
	<div>
		<div>【大区数据信息】</div>
		<div ref="target" class="w-full h-full"></div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
	data: {
		type: Object,
		required: true
	}
})

// 获取 dom 实例
const target = ref(null)

// echarts 实例变量
let mChart = null
// 在 mounted 生命周期之后，实例化 echarts
onMounted(() => {
	mChart = echarts.init(target.value)
	// 渲染 echarts
	renderChart()
})

// 渲染图表
const renderChart = () => {
	const options = {
		// X 轴展示数据
		xAxis: {
			// 数据展示
			type: 'value',
			// 不显示轴
			show: false,
			// 最大值（防止触顶）
			max: function (value) {
				// 取整
				return parseInt(value.max * 1.2)
			}
		},
		// Y 轴展示选项
		yAxis: {
			type: 'category',
			// 根据根据服务端数据筛选
			data: props.data.regions.map((item) => item.name),
			// 反向展示
			inverse: true,
			// 不展示轴线
			axisLine: {
				show: false
			},
			// 不展示刻度
			axisTick: {
				show: false // 取消 Y 轴刻度
			},
			// 文字色值
			axisLabel: {
				color: '#9EB1C8'
			}
		},
		// echarts 网格绘制的位置，对应 上、右、下、左
		grid: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			// 计算边距时，包含标签
			containLabel: true
		},
		// 柱形图核心配置
		series: [
			{
				// 图表类型
				type: 'bar',
				// 数据筛选
				data: props.data.regions.map((item) => ({
					name: item.name,
					value: item.value
				})),
				// 显示背景
				showBackground: true,
				// 背景色
				backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)'
				},
				// 每个轴的样式
				itemStyle: {
					color: '#479AD3', // 设置柱子的颜色
					barBorderRadius: 5, // 设置柱子的圆角
					shadowColor: 'rgba(0, 0, 0, 0.3)', // 设置柱子的阴影颜色
					shadowBlur: 5 // 设置柱子的阴影模糊大小
				},
				// 轴宽度
				barWidth: 12,
				// 轴上的字体
				label: {
					show: true,
					// 设置标签位置为右侧
					position: 'right',
					textStyle: {
						// 设置标签文本颜色
						color: '#fff'
					}
				}
			}
		]
	}

	mChart.setOption(options)
}

// 监听数据的变化，重新渲染图表
watch(
	() => props.data,
	() => {
		renderChart()
	}
)
</script>

<style lang="scss" scoped></style>
