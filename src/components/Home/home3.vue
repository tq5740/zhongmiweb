<template>
  <div class="home3 home-box">
    <div class="top">
      <img class="title-svg" src="@img/svg/u200.svg" />
      <p class="title">预警信息</p>
      <a class="click" @click="more">更多</a>
    </div>
    <div class="content">
      <ul class="list" id="warnList" v-if="dataList.length">
        <li v-for="(item, index) in dataList" :key="index">
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
    <el-dialog title="预警信息" v-if="showMore" :visible.sync="showMore" :before-close="close">
      <div>
        <el-table :data="dataListAll" style="width: 100%">
          <el-table-column prop="notice_time" label="预警时间"></el-table-column>
          <el-table-column prop="company_name" label="预警公司"></el-table-column>
          <el-table-column prop="reason_info" label="预警原因"></el-table-column>
          <el-table-column prop="warn_suggest" label="处理建议"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination background @size-change="getTable" @current-change="getTable" :current-page.sync="pageNum" :page-sizes="[10, 20, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: 0 20px">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
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
      handler: "getTable",
      immediate: true,
    },
    currentOrgId: {
      handler: 'getTable',
    },
  },
  data() {
    return {
      dataListAll: [],
      dataList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      showMore: false,
      timer: null,
    };
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    getTable() {
      if (this.deviceId || this.$GetStorage("deviceId")) {
        if (!this.showMore) {
          this.pageNum = 1;
          this.pageSize = 100;
        } else {
          this.pageNum = 1;
          this.pageSize = 10;
        }
        this.$axios
          .get(this.$axios.base1() + this.$api.noticePage(), {
            company_id: this.currentOrgId || this.$GetStorage("currentOrgId"),
            device_id: this.deviceId || this.$GetStorage("deviceId"),
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          })
          .then((res) => {
            this.total = res.value.total;
            this.showMore
              ? (this.dataListAll = res.value.list)
              : (this.dataList = res.value.list);
            this.$nextTick(() => {
              this.dataList.length && this.scrollList();
            })
          });
      }
    },
    scrollList() {
      const node = document.getElementById("warnList");
      const val = node.scrollHeight - node.offsetHeight;
      this.timer && clearInterval(this.timer);
      if (node.scrollHeight > node.offsetHeight) {
        this.timer = setInterval(() => {
          if (node.scrollTop >= val) {
            node.scrollTop = 0;
            console.log("到底");
          } else {
            node.scrollTop += 1;
          }
        }, 50);
      }
    },
    more() {
      this.showMore = true;
      this.getTable();
    },
    close() {
      this.showMore = false;
      this.getTable();
    },
  },
};
</script>
<style lang="scss" scoped>
.home3 {
  position: relative;
  .top {
    font-size: 16px;
    padding: 20px;
    overflow: hidden;
    .click {
      cursor: pointer;
      float: right;
      margin-top: 3px;
    }
    .title {
      color: #b6d7ff;
      float: left;
      margin: 3px 0 0 10px;
    }
    .title-svg {
      float: left;
    }
  }
  .content {
    .list {
      color: #b6d7ff;
      margin: 5px 30px;
      display: inline-block;
      font-size: 14px;
      overflow-y: auto;
      height: 250px;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      li {
        line-height: normal;
        margin-bottom: 15px;
        span {
          margin-right: 10px;
        }
      }
    }
    .normal {
      text-align: center;
      margin-top: 80px;
      color: #ddd;
      .icon {
        font-size: 30px;
        margin-bottom: 10px;
        display: block;
        color: rgb(93, 241, 88);
      }
    }
  }
}
.warnlist {
  li {
    line-height: normal;
    margin-bottom: 15px;
  }
}
</style>
