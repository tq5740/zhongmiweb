<template>
  <Loading class="chart-box" :loading="loading">
    <div class="head">
      <h2 class="title">历史数据监测</h2>
      <div class="select">
        时间维度：
        <el-select v-model="currentType" placeholder="请选择" @change="init">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <Echarts v-if="haveData" :option="echartOption" height="340px" width="100%" />
    <p v-else class="noData">暂无数据</p>
  </Loading>
</template>
<script>
import Echarts from '@c/Echarts';
import Loading from '@c/Loading';
export default {
  components: {
    Echarts,
    Loading
  },
  data() {
    return {
      loading: false,
      haveData: true,
      currentType: "week",
      options: [
        {
          name: '2小时',
          id: 'hour',
        },
        {
          name: '日',
          id: 'day',
        },
        {
          name: '周',
          id: 'week',
        },
        {
          name: '月',
          id: 'month',
        },
        {
          name: '季度',
          id: 'quarter',
        },
      ],
      echartOption: {
        color: [
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5',
          '#f5994e',
          '#c05050',
          '#59678c',
          '#c9ab00',
          '#7eb00a',
          '#6f5553',
          '#c14089',
        ],
        legend: {
          data: [],
          textStyle: {
            color: 'rgb(150, 150, 150)',
            fontSize: 14,
          },
          itemWidth: 12,
          itemHeight: 12,
          icon: 'circle',
          right: '40',
          bottom: '0',
        },
        grid: {
          top: '20',
          bottom: '100',
          left: '100',
          right: '80',
        },
        tooltip: {
          trigger: 'axis',
          position: function (point, params, dom, rect, size) {
            const y = -(size.viewSize[1] / 4), point0 = point[0];
            if (point0 < size.viewSize[0] / 2) {
              return [point0 + 20, y]
            }
            return [point0 - size.contentSize[0] - 20, y];
          }
        },
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        xAxis: {
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: 'rgb(200, 200, 200)',
              fontSize: 14,
            },
            // interval: 25,
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(200, 200, 200)',
            },
          },
          splitLine: {
            show: false,
          },
          data: [],
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLabel: {
            textStyle: {
              color: 'rgb(200, 200, 200)',
              fontSize: 14,
            },
            // interval: 25,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [],
      },
    };
  },
  computed: {
    natureIdArr() {
      return this.$store.state.natureIdArr;
    },
  },
  watch: {
    natureIdArr: {
      handler: 'init',
    },
  },
  methods: {
    init() {
      if (this.natureIdArr.length) {
        this.loading = this.haveData = true;
        this.$axios
          .get(this.$axios.base() + this.$api.queryLines(), {
            type: this.currentType,
            ids: this.natureIdArr.join(','),
          })
          .then((res) => {
            let series = [],
              legend = [],
              showSymbol = this.$store.state.currentOrgId == 101215 && this.currentType === "hour" ? true : false;
            res.data.lines.forEach((item, index) => {
              let arr = [];
              item.points.forEach(el => {
                if (el && el.indexOf(".") === -1) {
                  arr.push(el)
                } else {
                  arr.push(Number(Number(el).toFixed(2)))
                }
              })
              series[index] = {
                symbol: 'circle',
                showSymbol: showSymbol,
                name: item.name,
                type: 'line',
                data: arr,
              };
              legend[index] = item.name;
            });
            this.echartOption.legend.data = legend;
            this.echartOption.series = series;
            this.echartOption.xAxis.data = res.data.time;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.echartOption.legend.data = [];
        this.echartOption.series = [];
        this.echartOption.xAxis.data = [];
        this.haveData = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-box:hover {
  background-color: rgba(13, 39, 45, 1);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.35);
}
.chart-box {
  padding: 20px 3%;
  border: 1px solid rgba(0, 102, 153, 1);
  border-radius: 4px;
  background-color: rgba(8, 31, 37, 1);
  margin: 20px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    color: #fff;
    font-weight: bold;
  }
  .select {
    font-size: 14px;
    color: #fff;
  }
}
.noData {
  text-align: center;
  height: 100px;
  line-height: 100px;
  color: #909399;
}
</style>
