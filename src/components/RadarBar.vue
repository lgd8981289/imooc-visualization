<template>
	<div>
		<div>【云端报警风险】</div>
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

const target = ref(null)
let mChart = null
onMounted(() => {
	mChart = echarts.init(target.value)
	renderChart()
})

const renderChart = () => {
	const options = {
		// 雷达图坐标系配置
		radar: {
			// 坐标系名
			name: {
				textStyle: {
					color: '#05D5FF',
					fontSize: 14
				}
			},
			// 雷达绘制类型。polygon 多边形
			shape: 'polygon',
			// 居中
			center: ['50%', '50%'],
			// 边境
			radius: '80%',
			// 开始的角度（可以避免绘制到边框之外）
			startAngle: 120,
			// 轴线配置
			axisLine: {
				lineStyle: {
					color: 'rgba(5, 213, 255, .8)'
				}
			},
			// 网格线配置
			splitLine: {
				show: true,
				lineStyle: {
					width: 1,
					color: 'rgba(5, 213, 255, .8)' // 设置网格的颜色
				}
			},
			// 指示器文字
			indicator: props.data.risks.map((item) => ({
				name: item.name,
				max: 100
			})),
			// 不展示拆分区域
			splitArea: {
				show: false
			}
		},
		// 坐标居中
		polar: {
			center: ['50%', '50%'], // 默认全局居中
			radius: '0%'
		},
		// 坐标角度
		angleAxis: {
			// 坐标轴刻度最小值
			min: 0,
			// 坐标轴分割间隔
			interval: 5,
			// 刻度增长逆时针
			clockwise: false,
			// 不显示坐标轴刻度
			axisTick: {
				show: false
			},
			// 不显示坐标轴文字
			axisLabel: {
				show: false
			},
			// 不显示坐标轴线
			axisLine: {
				show: false
			},
			// 不显示分割线
			splitLine: {
				show: false
			}
		},
		// 径向轴
		radiusAxis: {
			// 最小值
			min: 0,
			// 间隔
			interval: 20,
			// 不显示分割线
			splitLine: {
				show: true
			}
		},
		// 图表核心配置
		series: [
			{
				// 雷达图
				type: 'radar',
				// 拐点的样式，还可以取值'rect','angle'等
				symbol: 'circle',
				// 拐点的大小
				symbolSize: 10,
				// 折线拐点标志的样式
				itemStyle: {
					normal: {
						color: '#05D5FF'
					}
				},
				// 区域填充样式
				areaStyle: {
					normal: {
						color: '#05D5FF',
						opacity: 0.5
					}
				},
				// 线条样式
				lineStyle: {
					width: 2,
					color: '#05D5FF'
				},
				// 图形上的文本标签
				label: {
					normal: {
						show: true,
						formatter: (params) => {
							return params.value
						},
						color: '#fff'
					}
				},
				// 数据
				data: [
					{
						value: props.data.risks.map((item) => item.value)
					}
				]
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
