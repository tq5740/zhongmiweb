<template>
  <Loading class="table-box" :loading="loading">
    <h2 class="title">
      设备指标
    </h2>
    <div class="menuList">
      <el-radio-group v-model="typeId" @change="getTable">
        <el-radio-button v-for="item in typeArr" :key="item.id" :label="item.id">{{item.text}}</el-radio-button>
      </el-radio-group>
      <el-button @click="showImg = true" type="primary" class="btn">数据分析</el-button>
    </div>
    <div class="table-wrapper2">
      <el-table :data="tableData" max-height="500" border>
        <el-table-column prop="name" label="名称" min-width="100px"></el-table-column>
        <el-table-column prop="code" label="标识" min-width="100px"></el-table-column>
        <el-table-column prop="value" label="当前值" min-width="100px"></el-table-column>
        <el-table-column prop="lower" label="低低报"></el-table-column>
        <el-table-column prop="upper" label="低报"></el-table-column>
        <el-table-column prop="high" label="高报"></el-table-column>
        <el-table-column prop="higher" label="高高报"></el-table-column>
      </el-table>
    </div>
    <el-dialog v-if="showImg" :visible.sync="showImg" fullscreen>
      <img class="imgpage" src="../../assets/img/page.png" alt="" />
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
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      typeId: 1,
      typeArr: [],
      showImg: false,
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
      handler: "getTable",
    },
  },
  created() {
    this.getTypeArr();
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    getTypeArr() {
      this.$axios
        .get(this.$axios.base() + this.$api.NATURE_GROUP())
        .then((res) => {
          this.typeArr = res;
        })
    },
    getTable() {
      if (this.deviceId) {
        this.loading = true;
        this.$axios
          .get(this.$axios.base() + this.$api.queryNaturesByPage(), {
            reserve1: this.typeId,
            deviceId: this.deviceId,
          })
          .then((res) => {
            const dataArr = res.data.rows;
            this.total = res.data.total || dataArr.length;
            this.tableData = dataArr;
            let natureId = [];
            this.tableData.forEach((item) => {
              natureId.push(item.id);
            });
            this.$store.state.natureIdArr = natureId;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    // change(e, row) {
    //   this.loading = true;
    //   this.$axios
    //     .post(this.$axios.base() + this.$api.saveVisible(), {
    //       deviceId: this.deviceId,
    //       natureId: row.id,
    //       isvisible: e,
    //     })
    //     .finally(() => {
    //       this.getTable();
    //     });
    // },
    getLeft(index, left) {
      const dom = document.getElementsByClassName("pi")[index];
      return dom && left + 25 - dom.offsetWidth / 2;
    },
  },
};
</script>
<style lang="scss" scoped>
.table-box:hover {
  background-color: rgba(13, 39, 45, 1);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.35);
}
.table-box {
  padding: 0 3% 40px 3%;
  overflow: hidden;
  border: 1px solid rgba(0, 102, 153, 1);
  border-radius: 4px;
  background-color: rgba(8, 31, 37, 1);
  margin: 20px;
  .title {
    font-size: 18px;
    color: #3d81fd;
    font-weight: bold;
    padding: 30px 0px 15px 0px;
  }
  .menuList {
    margin-bottom: 20px;
    overflow: hidden;
    .btn {
      padding-left: 30px;
      padding-right: 30px;
      float: right;
    }
  }
  /deep/ {
    .el-table td,
    .el-table th.is-leaf {
      border-color: rgb(204, 204, 204);
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      border-color: rgb(204, 204, 204);
      background-color: rgb(204, 204, 204);
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
.imgpage {
  width: 100%;
}
</style>
