<template>
  <Loading v-loading="loading">
    <div class="row1">
      <div class="img box1">
        <el-image :src="data.coverUrl" fit="none">
          <div slot="error" class="image-slot">
            PICTURE
          </div>
        </el-image>
      </div>
      <div class="right1 box1">
        <span style="font-size: 12px">选择设备：</span>
        <el-select class="select" style="width:200px" v-model="deviceIdNum" placeholder="请选择" @change="changeDevices">
          <el-option v-for="item in devicesArr" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <br />
        <div class="title">机组-密封信息</div>
        <div class="content">
          <p>机组位号：{{ data.machineCode }}</p>
          <p>驱动端编号：{{ data.diverCode }}</p>
          <p>非驱动端编号：{{ data.udiverCode }}</p>
          <p>密封形式：{{ data.sealingForm }}</p>
        </div>
      </div>
      <div class="right2 box1">
        <el-image :src="data.rjmfUrl" fit="cover" :preview-src-list="[data.rjmfUrl]">
        </el-image>
      </div>
      <div class="right3 box1" style="cursor: pointer">
        <el-image :src="$store.state.piImgSrc" fit="cover" @click="lookPIBtn">
        </el-image>
      </div>
      <div class="right4 box1">
        <div class="info">
          <ul class="list" id="warnList" v-if="infoList.length">
            <li v-for="(item, index) in infoList" :key="index">
              <span>{{ item.notice_time }} </span>
              <span> {{ item.company_name }} </span>
              <span> {{ item.reason_info }} </span>
              <span> {{ item.warn_suggest }} </span>
            </li>
          </ul>
          <p class="normal" v-else>
            <i class="el-icon-circle-check icon"></i>
            设备运行正常
          </p>
        </div>
      </div>
    </div>
    <el-dialog v-if="showImg" :visible.sync="showImg" fullscreen>
      <img class="imgpage" src="../../assets/img/page.png" alt="" />
    </el-dialog>
    <el-dialog title="PID图" v-if="showPI" :visible.sync="showPI" v-loading.fullscreen.lock="loading1" @close="closePI" fullscreen>
      <div class="pibox">
        <img :src="$store.state.piImgSrc" alt="" />
        <div class="pi" v-for="item in piAllData" :key="item">
          <p :style="`left: ${item.selectLeft + 9}px; top: ${item.selectTop + 22}px;`">{{ item.name }} {{ item.unit }}</p>
          <span :style="`left: ${item.left - 7}px; top: ${item.top - 1}px;`">{{ item.val }}</span>
        </div>
      </div>
    </el-dialog>
  </Loading>
</template>
<script>
import Loading from '@c/Loading';
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      loading1: false,
      data: {},
      devicesArr: [],
      deviceIdNum: null,
      infoList: [],
      showImg: false,
      showPI: false,
      piAllData: [],
      timer: null,
      deviceIdForNow: '',
      orgIdForNow: '',
    };
  },
  computed: {
    deviceId() {
      return this.$store.state.deviceId;
    },
    currentOrgId() {
      return this.$store.state.currentOrgId;
    },
  },
  watch: {
    deviceId: {
      handler: 'changeDeviceId',
      immediate: true,
    },
    currentOrgId: {
      handler: 'changeOrgId',
      immediate: true,
    },
  },
  methods: {
    lookPIBtn() {
      this.loading1 = true;
      this.showPI = true;
      this.piAllData = [];
      this.getPIData();
      this.timer = setInterval(() => {
        this.getPIData();
      }, 60000);
    },
    closePI() {
      clearInterval(this.timer);
    },
    getPIData() {
      Promise.all([
        new Promise((resolve, reject) => {
          this.$axios
            .get(this.$axios.base() + this.$api.natureList(), {
              deviceId: this.deviceId,
            })
            .then((res) => {
              resolve(res);
            })
            .catch(() => {
              reject();
            });
        }),
        new Promise((resolve, reject) => {
          this.$axios
            .get(this.$axios.base() + this.$api.queryNatureValues(), {
              deviceId: this.deviceId,
            })
            .then((res) => {
              resolve(res.data);
            })
            .catch(() => {
              reject();
            });
        }),
      ])
        .then((resArr) => {
          let res1 = resArr[0];
          let res2 = resArr[1];
          this.piAllData = [];
          this.$store.state.piData.forEach((item) => {
            for (let i = 0; i < res1.length; i++) {
              if (item.val === res1[i].code) {
                let val = res2[res1[i].code];
                this.piAllData.push({
                  name: res1[i].code,
                  left: item.left,
                  top: item.top,
                  selectLeft: item.selectLeft,
                  selectTop: item.selectTop,
                  val: Number(val).toFixed(1),
                  unit: res1[i].unit,
                });
              }
            }
          });
        })
        .catch(() => {
          this.$Notif({
            type: "error",
            title: "提示",
            message: "服务器或网络异常，未获取到PI图数据",
          });
        })
        .finally(() => {
          this.loading1 = false;
        });
    },
    changeDeviceId() {
      this.getInfo();
      this.init();
    },
    changeOrgId() {
      this.getInfo();
      this.getAllDevice();
    },
    init() {
      this.data = {};
      if (this.deviceId || this.$GetStorage("deviceId")) {
        this.loading = true;
        this.$axios
          .get(this.$axios.base() + this.$api.queryDeviceById(), {
            deviceId: this.deviceId || this.$GetStorage("deviceId"),
          })
          .then((res) => {
            this.data = res.data;
            this.$store.state.piImgSrc = this.data.piUrl;
            this.$store.state.piData = this.data.pjson ? JSON.parse(this.data.pjson) : [];
            this.convert();
            this.loading = false;
          });
      }
    },
    getAllDevice() {
      this.$axios
        .get(this.$axios.base() + this.$api.queryDevices(), {
          page: 1,
          rows: 1000,
          orgId: this.currentOrgId || this.$GetStorage("currentOrgId")
        })
        .then((res) => {
          this.devicesArr = res.data.rows;
          if (this.devicesArr.length) {
            this.$store.state.deviceId = this.devicesArr[0].id;
            this.$SetStorage('deviceId', this.$store.state.deviceId);
            this.deviceIdNum = this.devicesArr[0].id;
          }
        })
    },
    changeDevices(e) {
      this.$store.state.deviceId = e;
      this.$SetStorage('deviceId', this.$store.state.deviceId);
    },
    convert() {
      this.$axios
        .get(this.$axios.base() + this.$api.SEALING_FORM_TYPE())
        .then((res) => {
          var arr = res.filter(
            (item) => item.id == this.data.sealingForm
          );
          this.data.sealingForm = arr[0] && arr[0]["text"]
        });
    },
    link() {
      window.open("http://www.baidu.com")
    },
    getInfo() {
      var deviceId = this.deviceId || this.$GetStorage("deviceId");
      var orgId = this.currentOrgId || this.$GetStorage("currentOrgId");
      if (this.deviceIdForNow !== deviceId || this.orgIdForNow !== orgId) {
        this.deviceIdForNow = deviceId;
        this.orgIdForNow = orgId;
        this.$axios
          .get(this.$axios.base1() + this.$api.noticePage(), {
            company_id: this.orgIdForNow,
            device_id: this.deviceIdForNow,
            pageNum: 1,
            pageSize: 6,
          })
          .then((res) => {
            this.infoList = res.value.list;
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.box1:hover {
  background-color: rgba(13, 39, 45, 1);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.35);
}
.box1 {
  border: 1px solid rgba(0, 102, 153, 1);
  border-radius: 4px;
  background-color: rgba(8, 31, 37, 1);
  margin: 10px;
  padding: 10px;
}
.row1 {
  color: #fff;
  display: flex;
  margin: 10px;
  margin-bottom: 0;
  height: 302px;
  .img {
    min-width: 280px;
    width: 100%;
  }
  .right1 {
    min-width: 260px;
    max-width: 260px;
  }
  .right2 {
    min-width: 260px;
    max-width: 260px;
  }
  .right3 {
    min-width: 260px;
    max-width: 260px;
  }
  .right4 {
    min-width: 280px;
    width: 100%;
    font-size: 14px;
    .info {
      height: 260px;
      overflow: hidden;
      .list {
        line-height: 1.4;
        height: 100%;
        overflow: hidden;
        li {
          margin-bottom: 10px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      }
      .normal {
        text-align: center;
        line-height: 260px;
      }
    }
  }
  .title {
    padding-bottom: 15px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #bbb;
    margin: 25px 0 10px 0;
  }
  .content {
    p {
      line-height: 1.4;
      margin: 7px 0;
    }
  }
}
.pibox {
  overflow: auto;
  position: relative;
  .pi {
    text-align: center;
    font-size: 12px;
    color: #303133;
    p {
      position: absolute;
      width: fit-content;
    }
    span {
      position: absolute;
      background: #303133;
      color: #fff;
      display: block;
      padding: 5px 0;
      min-width: 80px;
    }
  }
}
</style>
