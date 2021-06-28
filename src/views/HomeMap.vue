<template>
  <div class="home-map">
    <div class="left-box">
      <ul class="hexagon">
        <li class="hexagon1">
          <img class="img" src="@img/svg/u23.svg" />
          <p class="text-zh">五高品质</p>
          <p class="text-en">Five Top Quality</p>
        </li>
        <li class="hexagon2">
          <img class="img" src="@img/svg/u16.svg" />
          <p class="text-zh">产品定制</p>
          <p class="text-en">product customization</p>
        </li>
        <li class="hexagon3">
          <img class="img" src="@img/svg/u24.svg" />
          <p class="text-zh">智能制造</p>
          <p class="text-en">Intelligent Manufacturing</p>
        </li>
      </ul>
      <div class="intro">
        <div class="title">
          <p class="title-zh">中密简介</p>
          <p class="title-en">Company Profile</p>
        </div>
        <div class="content">
          <p>
            公司销售网络遍布全国各地，可为客户提供基于长周期、高可靠的密封应用规划和整体解决方案，为客户提供各种层次的技术培训。公司在全国各地设立了24个办事处办事处，7个快修服务中心维修中心，其中海外服务中心2个，覆盖国内主要的省、市、自治区和欧洲、中亚、东南亚等地区，以专业、迅捷的服务保证企业安全生产。
          </p>
          <p>
            公司秉承“以技术占领市场，以服务留住客户”的理念，始终以客户的关注为焦点，用真诚和实力承载您的信任。
          </p>
        </div>
      </div>
    </div>
    <Echarts :option="echartOption" height="1000px" width="1000px" class="right-box"></Echarts>
  </div>
</template>

<script>
import Echarts from '@c/Echarts';
let toolTipClickCallback = {};
document.onmousedown = function (event) {
  if (event.target.id === 'btn-tooltip') {
    toolTipClickCallback.fun(Number(event.target.className));
  }
};
export default {
  components: {
    Echarts,
  },
  data() {
    return {
      echartOption: {},
      activeSeries: '',
    };
  },
  beforeCreate() {
    document
      .querySelector('body')
      .setAttribute('style', 'background-color: #081f25');
  },
  created() {
    this.init();
    let that = this;
    toolTipClickCallback.fun = function (id) {
      that.$store.state.currentOrgId = id;
      that.$SetStorage('currentOrgId', Number(id));
      that.$SetStorage('inHome', true);
      that.$router.replace("/home");
    };
  },
  methods: {
    init() {
      this.setOptionsValue();
      this.$axios.post(this.$axios.base() + this.$api.orgAll(), {}).then((res) => {
        let series = [];
        res.rows.forEach((item, index) => {
          series[index] = {
            name: item.name,
            value: item.position.split(','),
            description: item.description,
            url: item.url,
            id: item.id,
          };
        });
        this.echartOption.series[0].data = series;
        this.$store.state.orgAllArr = res.rows;
        this.$SetStorage('orgAllArr', this.$store.state.orgAllArr);
        if (!this.$store.state.currentOrgId) {
          this.$store.state.currentOrgId = res.rows[0].id;
          this.$SetStorage('currentOrgId', this.$store.state.currentOrgId);
        }
      });
    },
    setOptionsValue() {
      this.echartOption = {
        geo: {
          map: 'china',
          itemStyle: {
            normal: {
              areaColor: 'rgba(118,120,142,1)',
              borderColor: '#243440',
            },
            emphasis: {
              areaColor: 'rgba(93,93,102,1)',
              color: '#fff',
            },
          },
        },
        tooltip: {
          enterable: true,
          // 触发方式 mousemove, click, none, mousemove|click
          triggerOn: 'mousemove',
          // item 图形触发， axis 坐标轴触发， none 不触发
          trigger: 'item',
          // 浮层隐藏的延迟
          hideDelay: 800,
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            var x = 0; // x坐标位置
            var y = 0; // y坐标位置

            // 当前鼠标位置
            var pointX = point[0];
            var pointY = point[1];

            // 提示框大小
            var boxWidth = size.contentSize[0];
            var boxHeight = size.contentSize[1];

            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = 5;
            } else {
              // 左边放的下
              x = pointX - boxWidth;
            }

            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5;
            } else {
              // 上边放得下
              y = pointY - boxHeight;
            }

            return [x, y];
          },
          // 背景色
          backgroundColor: 'rgba(0,0,0,0,0.8)',
          formatter: function (params) {
            return `<div class="chartLabel">
								<img src="${params.data.url}" class="img" />
								<div>
									<div class="title">${params.name}</div>
									<div class="label">${params.data.description}</div>
									<button id="btn-tooltip" class="${params.data.id}">进入首页</button>
								</div>
							</div>`;
          },
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [''],
        },
        series: [
          {
            name: '',
            type: 'scatter',
            coordinateSystem: 'geo', //表明坐标系
            symbolSize: [26, 32],
            symbol:
              'path://M512 93.672727c192.791273 0 349.090909 157.742545 349.090909 352.302546 0 126.650182-110.941091 298.728727-332.8 516.189091a23.272727 23.272727 0 0 1-32.581818 0l-10.472727-10.309819C270.359273 739.258182 162.909091 570.647273 162.909091 445.975273c0-194.56 156.299636-352.302545 349.090909-352.302546zM512 302.545455a116.363636 116.363636 0 1 0 0 232.727272 116.363636 116.363636 0 0 0 0-232.727272z',
            data: [],
          },
        ],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.home-map {
  overflow: hidden;
  background-color: rgba(8, 31, 37, 1);
  position: relative;
  padding-bottom: 50px;
  color: #fff;
}
.home-map .left-box {
  position: relative;
  padding-left: 70px;
  padding-top: 50px;
}
.hexagon {
  width: 400px;
  height: 370px;
  position: relative;
}
.hexagon li {
  position: absolute;
}
.hexagon li .img {
  position: absolute;
}
.hexagon li.hexagon1 p.text-zh {
  margin-top: 57px;
}
.hexagon li.hexagon2 {
  left: 160px;
  top: 92px;
}
.hexagon li.hexagon3 {
  top: 178px;
}
.hexagon li p {
  width: 198px;
  font-weight: bold;
  text-align: center;
  word-wrap: break-word;
  position: relative;
}
.hexagon li p.text-zh {
  font-size: 28px;
  margin-top: 43px;
  margin-bottom: 5px;
}
.hexagon li p.text-en {
  font-size: 20px;
  line-height: normal;
}

.intro {
  width: 640px;
  background-color: rgba(204, 204, 204, 0.74);
  margin-bottom: 40px;
}
.intro .title {
  display: inline-block;
  padding: 20px 40px 8px 15px;
  margin-left: 20px;
  border-bottom: 3px solid rgba(51, 51, 51, 1);
}
.intro .title p {
  color: #333;
}
.intro .title p.title-zh {
  font-weight: bold;
  font-size: 28px;
}
.intro .title p.title-en {
  font-size: 18px;
  font-weight: 700;
}
.intro .content {
  color: #666;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  margin: 10px 15px;
  text-indent: 2em;
}
.intro .content p {
  padding-bottom: 1.5em;
}

.right-box {
  width: 900px !important;
  position: absolute;
  right: 70px;
  top: -60px;
  /deep/ {
    .echart-tooltip-wrap {
      background-color: #0a3f54;
      padding: 12px/0.833;
      display: inline-block;
      transform: scale(0.833);
      transform-origin: 0% 0%;
    }
  }
}
</style>
