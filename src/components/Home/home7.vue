<template>
  <div class="home7">
    <div class="top">
      <img class="svg" src="@img/svg/u418.svg" />
      <p class="title">密封健康指数</p>
    </div>
    <Loading class="content home-box" :loading="loading">
      <swiper :options="swiperOption" v-if="!loading">
        <swiper-slide v-for="(item, index) in dataArr" :key="index" class="box">
          <div class="name">{{item.name}}</div>
          <div class="nr">
            <div class="left">
              <p class="health">
                <span class="aqi">EHI</span><br>
                <span class="value">{{item.health}}</span>
                <span class="text">健康指数</span>
              </p>
              <el-image class="image" :src="require('../../assets/img/img1.png')" fit="contain">
                <div slot="error" class="image-slot">
                  PICTURE
                </div>
              </el-image>
            </div>
            <div class="dataList">
              <p v-for="(el, ind) in item.data" :key="ind">{{ el }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </Loading>
  </div>
</template>
<script>
import Loading from '@c/Loading';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
export default {
  components: {
    Loading,
    swiper,
    swiperSlide,
  },
  data() {
    return {
      loading: false,
      dataArr: [],
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 40,
        // slidesPerGroup: 6,
        loopFillGroupWithBlank: true,
        autoplay: 4000,
        speed: 1000,
        disableOnInteraction: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        on: {
          slideChange: function () {
            console.log(this);
          },
        },
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
      this.loading = true;
      this.$axios
        .get(this.$axios.base() + this.$api.queryKeyNatures(), {
          orgId: this.currentOrgId || this.$GetStorage('currentOrgId')
        })
        .then((res) => {
          this.dataArr = [];
          console.log(res.data)
          res.data.forEach(item => {
            const name = Object.keys(item)[0];
            let data1 = [], data2 = [];
            item[name].one.forEach(el => {
              data1.push(el.name + (Number(el.value).toFixed(2) || "") + (el.unit || ""))
            })
            item[name].two.forEach(el => {
              data2.push(el.name + (Number(el.value).toFixed(2) || "") + (el.unit || ""))
            })
            this.dataArr.push({
              name: name + '驱动端',
              data: data1,
              health: 70,
              coverUrl: item[name].coverUrl
            }, {
              name: name + '非驱动端',
              data: data2,
              health: 75,
              coverUrl: item[name].coverUrl
            })
          });
        })
        .catch(() => {
          this.dataArr = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.home7 {
  width: 100%;
}
.top {
  font-size: 16px;
  padding: 20px 0 10px 20px;
  overflow: hidden;
  .title {
    color: #b6d7ff;
    float: left;
    margin: 1px 0 0 10px;
  }
  .svg {
    width: 18px;
    height: 18px;
    float: left;
  }
}
.content {
  display: flex;
  height: 335px;
  .name {
    text-align: center;
    line-height: 40px;
    font-size: 22px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    margin: 20px 50px;
    border: 1px solid rgb(39, 126, 127);
  }
  .nr {
    overflow: hidden;
    display: flex;
    padding: 0 35px;
    .left {
      width: 50%;
      .health {
        margin: 0 auto;
        margin-bottom: 10px;
        height: 95px;
        width: 120px;
        background: url("../../assets/img/bg1.png") no-repeat;
        text-align: center;
        position: relative;
        .aqi {
          color: rgb(39, 126, 127);
          padding-top: 10px;
          position: absolute;
          top: 10px;
          left: 35px;
        }
        .value {
          font-weight: bold;
          font-size: 20px;
          line-height: 1.5;
          color: rgb(29, 238, 227);
          display: block;
          position: absolute;
          top: 40px;
          left: 35px;
        }
        .text {
          position: absolute;
          right: -52px;
          font-size: 13px;
        }
      }
      .image {
        height: 150px;
      }
    }
    .dataList {
      margin: 0 auto;
      p {
        width: 100%;
        line-height: 30px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        margin: 10px;
        border: 1px solid rgb(39, 126, 127);
        padding: 0 10px;
      }
    }
  }
}
</style>
