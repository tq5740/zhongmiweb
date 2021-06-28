<template>
  <div class="home6">
    <div class="top">
      <div class="svg">
        <img class="svg1" src="@img/svg/u202.svg" />
        <img class="svg2" src="@img/svg/u203.svg" />
        <img class="svg3" src="@img/svg/u204.svg" />
        <img class="svg4" src="@img/svg/u205.svg" />
        <img class="svg5" src="@img/svg/u206.svg" />
        <img class="svg6" src="@img/svg/u207.svg" />
      </div>
      <p class="title">密封关键运行数据和特征值对比情况</p>
    </div>
    <Loading class="content home-box" :loading="loading">
      <div class="legend">
        <div class="kuai" v-for="(item, index) in color" :key="index" :style="{borderColor: item}">{{typeArr[index]}}</div>
      </div>
      <Echarts v-for="(item, index) in echartOptionArr" :key="index" :option="item" height="340px" width="100%" />
    </Loading>
  </div>
</template>
<script>
import Echarts from '@c/Echarts';
import Loading from '@c/Loading';
export default {
  components: {
    Echarts,
    Loading,
  },
  data() {
    return {
      loading: false,
      echartOptionArr: [],
      color: [
        'rgb(248, 84, 84)',
        'rgb(248, 219, 84)',
        'rgb(99, 248, 84)',
      ],
      typeArr: ['报警区域', '预警区域', '正常区域', '预警区域', '报警区域'],
      nameArr: ["驱动端一级泄漏气温度", "非驱动端一级泄漏气温度", "驱动端一级泄漏气流量", "非驱动端一级泄漏气流量", "驱动端一级泄漏气压力", "非驱动端一级泄漏气压力"],
      echartOption: {
        color: [
          'rgb(248, 84, 84)',
          'rgb(248, 219, 84)',
          'rgb(99, 248, 84)',
          'rgb(248, 219, 84)',
          'rgb(248, 84, 84)',
        ],
        // tooltip: {
        //   trigger: 'axis',
        // },
        grid: {
          bottom: 100,
          left: 80,
          right: 20,
          top: 40,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#999',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#999',
            },
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#999',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#999',
            },
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
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
    deviceId() {
      return this.$store.state.deviceId;
    },
  },
  watch: {
    deviceId: {
      immediate: true,
      handler: 'init',
    },
  },
  methods: {
    init() {
      if (this.deviceId || this.$GetStorage("deviceId")) {
        this.loading = true;
        this.$axios
          .get(this.$axios.base() + this.$api.queryMfkeyNatures(), {
            deviceId: this.deviceId || this.$GetStorage("deviceId"),
          })
          .then((res) => {
            this.echartOptionArr = [];
            for (let name of this.nameArr) {
              const item = res.data[name];
              let option = JSON.parse(JSON.stringify(this.echartOption));
              this.typeArr.forEach((el, ind) => {
                if (item) {
                  option.series[ind] = {
                    name: el,
                    type: 'bar',
                    barWidth: "100%",
                    emphasis: {
                      focus: 'series'
                    },
                    stack: '1',
                    data: [],
                    markLine: {
                      data: [
                        {
                          name: '实际值',
                          yAxis: Number(item.value).toFixed(2),
                        }
                      ]
                    },
                  }
                  if (ind === 0) {
                    option.series[ind].data = [{ value: item.lower - item.supertlower, unit: item.unit }];
                  } else if (ind === 1) {
                    option.series[ind].data = [{ value: item.upper - item.lower, unit: item.unit }];
                  } else if (ind === 2) {
                    option.series[ind].data = [{ value: item.high - item.upper, unit: item.unit }];
                  } else if (ind === 3) {
                    option.series[ind].data = [{ value: item.higher - item.high, unit: item.unit }];
                  } else if (ind === 4) {
                    option.series[ind].data = [{ value: item.supertoper - item.higher, unit: item.unit }];
                  }
                } else {
                  option.series[ind] = {
                    name: el,
                    type: 'bar',
                    emphasis: {
                      focus: 'series'
                    },
                    stack: '1',
                    data: [100],
                  }
                }
                option.xAxis.data = [name]
              })
              this.echartOptionArr.push(option);
            }
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
.home6 {
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
}
.content {
  height: 335px;
  display: flex;
  position: relative;
  .table-wrapper {
    margin: 20px 0;
  }
  .list {
    color: #b6d7ff;
    margin: 10px 30px;
    display: inline-block;
    li {
      line-height: normal;
      margin-bottom: 15px;
    }
  }
}
.legend {
  position: absolute;
  width: 360px;
  left: 50%;
  margin-left: -180px;
  bottom: 30px;
  z-index: 11;
  .kuai {
    border-left: 30px solid;
    float: left;
    padding-left: 5px;
    margin-right: 15px;
  }
}
</style>
