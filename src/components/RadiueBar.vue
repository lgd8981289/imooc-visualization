<template>
	<div>
		<div>【大区异常处理】</div>
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

/**
 * 双环形图绘制原理：
 * 1. 环形图通过饼图绘制。内外边距的距离减小，即为环形。环形中心点需要不断改变，否则会重叠
 * 2. 环形图绘制分为 上层和底层 两部分。上层作为绘制进度，底层作为背景图
 * 3. 依据 getSeriesData 生成对应的 上层和底层 series 数据，进行渲染
 */
const getSeriesData = () => {
	const series = []

	props.data.abnormals.forEach((item, index) => {
		// 上层环形绘制
		series.push({
			name: item.name,
			// 使用饼图绘制，减少饼图宽度即为环形图
			type: 'pie',
			// 逆时针排布
			clockWise: false,
			// 不展示鼠标移入动画
			hoverAnimation: false,
			// 半径位置，需要依次递减，否则会重复在一处进行展示
			radius: [73 - index * 15 + '%', 68 - index * 15 + '%'],
			// 中心点
			center: ['55%', '55%'],
			// 不展示 label
			label: { show: false },
			// 数据配置
			data: [
				// 设置数据与名称
				{ value: item.value, name: item.name },
				// 最大数据，展示比例
				{
					value: 1000,
					name: '',
					itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
					tooltip: { show: false },
					hoverAnimation: false
				}
			]
		})

		// 底层图
		series.push({
			name: item.name,
			type: 'pie',
			// 图形不响应事件
			silent: true,
			// z-index: 置于底层
			z: 1,
			// 逆时针排布
			clockWise: false,
			// 不展示鼠标移入动画
			hoverAnimation: false,
			// 半径位置，需要依次递减，否则会重复在一处进行展示
			radius: [73 - index * 15 + '%', 68 - index * 15 + '%'],
			// 中心点
			center: ['55%', '55%'],
			// 不展示 label
			label: { show: false },
			// 数据
			data: [
				// 绘制底线 75%
				{
					value: 7.5,
					itemStyle: { color: 'rgb(3, 31, 62)', borderWidth: 0 },
					tooltip: { show: false },
					hoverAnimation: false
				},
				// 绘制底线 25% 透明区域
				{
					value: 2.5,
					name: '',
					itemStyle: { color: 'rgba(0,0,0,0)', borderWidth: 0 },
					tooltip: { show: false },
					hoverAnimation: false
				}
			]
		})
	})

	return series
}

const renderChart = () => {
	const options = {
		// 图例配置
		legend: {
			show: true,
			// 图例色块
			icon: 'circle',
			// 位置
			top: '14%',
			left: '60%',
			// 展示数据
			data: props.data.abnormals.map((item) => item.name),
			// 总宽度（一列）
			width: -5,
			// 每个色块的宽
			itemWidth: 10,
			// 每个色块的高度
			itemHeight: 10,
			// item 间距
			itemGap: 6,
			// 展示内容
			formatter: function (name) {
				return '{title|' + name + '}'
			},
			// 字体配置
			textStyle: {
				rich: {
					title: {
						fontSize: 12,
						lineHeight: 5,
						color: 'rgba(255,255,255,0.8)'
					}
				}
			}
		},
		// 提示层
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: '{a}<br>{b}:{c}({d}%)'
		},
		// Y 轴展示选项
		yAxis: [
			{
				type: 'category',
				// 反向展示
				inverse: true,
				// 不展示轴线
				axisLine: {
					show: false
				},
				// 不展示刻度
				axisTick: {
					show: false
				}
			}
		],
		// X 轴不展示
		xAxis: [
			{
				show: false
			}
		],
		// 每两个标记一条线
		series: getSeriesData()
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
