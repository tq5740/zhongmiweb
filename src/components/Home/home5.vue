<template>
	<div class="home5">
		<div class="top">
			<div class="svg">
				<img class="svg1" src="@img/svg/u202.svg" />
				<img class="svg2" src="@img/svg/u203.svg" />
				<img class="svg3" src="@img/svg/u204.svg" />
				<img class="svg4" src="@img/svg/u205.svg" />
				<img class="svg5" src="@img/svg/u206.svg" />
				<img class="svg6" src="@img/svg/u207.svg" />
			</div>
			<p class="title">过滤器滤芯运行时间概况</p>
			<el-button class="top-btn" type="text" @click="showFilter = true">滤芯管理</el-button>
		</div>
		<Loading class="content home-box" :loading="loading">
			<Echarts :option="echartOption" height="340px" width="100%" />
		</Loading>
		<el-dialog
			title="滤芯管理"
			v-if="showFilter"
			:visible.sync="showFilter"
			width="80%"
			@close="init"
		>
			<Filters />
		</el-dialog>
	</div>
</template>
<script>
import Echarts from '@c/Echarts';
import Loading from '@c/Loading';
import Filters from '@views/Filter';
export default {
	components: {
		Echarts,
		Loading,
		Filters,
	},
	data() {
		return {
			loading: false,
			showFilter: false,
			echartOption: {
				color: ['rgb(97, 165, 232)', 'rgb(255, 153, 0)'],
				legend: {
					data: ['已运行时间', '剩余运行时间'],
					textStyle: {
						color: '#999',
						fontSize: 14,
					},
					top: '40',
					itemWidth: 12,
					itemHeight: 12,
					icon: 'rect',
				},
				grid: {
					top: '70',
					left: '120',
					right: '30',
				},
				tooltip: {
					trigger: 'axis',
				},
				xAxis: {
					type: 'value',
					axisLabel: {
						textStyle: {
							color: '#999',
							fontSize: 14,
						},
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: '#999',
						},
					},
					splitLine: {
						lineStyle: {
							type: 'dashed',
						},
					},
					axisTick: {
						show: false,
					},
				},
				yAxis: {
					type: 'category',
					axisLabel: {
						textStyle: {
							color: '#999',
							fontSize: 14,
						},
						formatter: function(params) {
							var newParamsName = "";
							var paramsNameNumber = params.length;
							var provideNumber = 7;
							var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
							if (paramsNameNumber > provideNumber) {
									for (var p = 0; p < rowNumber; p++) {
											var tempStr = "";
											var start = p * provideNumber;
											var end = start + provideNumber;
											if (p == rowNumber - 1) {
													tempStr = params.substring(start, paramsNameNumber);
											} else {
													tempStr = params.substring(start, end) + "\n";
											}
											newParamsName += tempStr;
									}
							} else {
									newParamsName = params;
							}
							return newParamsName
						}
					},
					axisLine: {
						lineStyle: {
							color: '#999',
						},
					},
					axisTick: {
						show: false,
					},
					data: [],
				},
				series: [
					{
						name: '已运行时间',
						type: 'bar',
						barWidth: '16',
						stack: '总量',
						label: {
							position: 'insideRight',
						},
						data: [],
					},
					{
						name: '剩余运行时间',
						type: 'bar',
						barWidth: '16',
						stack: '总量',
						label: {
							position: 'insideRight',
						},
						data: [],
					},
				],
			},
		};
	},
	computed: {
		currentOrgId() {
			return this.$store.state.currentOrgId;
		},
	},
	watch: {
		currentOrgId: {
			handler: 'init',
			immediate: true,
		},
	},
	methods: {
		init() {
			let orgId = this.currentOrgId || this.$GetStorage('currentOrgId');
			if (orgId) {
				this.loading = true;
				this.$axios
					.post(this.$axios.base() + this.$api.queryFilter(), {
						orgId: orgId,
					})
					.then((res) => {
						let yAxis = [],
							series0 = [],
							series1 = [];
						res.data.forEach((item, index) => {
							yAxis[index] = item.name;
							series0[index] = item.useTime;
							series1[index] = item.leaveTime;
						});
						this.echartOption.yAxis.data = yAxis;
						this.echartOption.series[0].data = series0;
						this.echartOption.series[1].data = series1;
					})
					.finally(() => {
						this.loading = false;
					});
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.home5 {
	position: relative;
}
.top {
	font-size: 16px;
	padding: 20px 0 10px 20px;
	overflow: hidden;
	.title {
		color: #b6d7ff;
		float: left;
		margin: 5px 0 0 10px;
	}
	.svg {
		width: 25px;
		height: 25px;
		float: left;
		position: relative;
		.svg1,
		.svg2,
		.svg3,
		.svg4,
		.svg5,
		.svg6 {
			position: absolute;
		}
		.svg1 {
			left: 8px;
			top: -2px;
		}
		.svg2 {
			left: 14px;
			top: -2px;
		}
		.svg3 {
			left: 10px;
			top: 2px;
		}
		.svg4 {
			left: 0px;
			top: 0px;
		}
		.svg5 {
			left: 4px;
			top: 5px;
		}
		.svg6 {
			left: 15px;
			top: 5px;
		}
	}
	.top-btn {
		float: right;
		padding: 0;
		margin: 8px 20px 0 0;
	}
}
.content {
	height: 335px;
}
</style>
