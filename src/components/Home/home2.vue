<template>
  <div class="home2 home-box">
    <div class="top">
      <p class="title">设备列表</p>
    </div>
    <Loading class="table-wrapper table-box" :loading="loading">
      <el-table :data="tableData" :key="changeData" height="230" stripe highlight-current-row @current-change="handleCurrentChange">
        <el-table-column prop="name" label="设备名称" width="100" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="machineCode" label="机组位号" width="78" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="diverCode" label="驱动端编号" width="93" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="udiverCode" label="非驱动端编号" width="106" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sealingCode" label="密封编号" width="78" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button class="handle" type="text" size="small" @click="handleClick(scope.row, 1)">查看 </el-button>
            <el-button class="handle" type="text" size="small" @click="handleClick(scope.row, 2)" v-if="!scope.row.isdefault"> | 设置默认</el-button>
            <el-button class="handle" type="text" size="small" @click="handleClick(scope.row, 3)" v-if="scope.row.reserve3 == 2"> | 处理</el-button>
            <el-button class="handle" type="text" size="small" @click="handleClick(scope.row, 4)" v-if="scope.row.reserve3 == 1 || scope.row.reserve3 == 2"> | 日志</el-button>
            <img v-if="scope.row.reserve3 == 2" class="stateImg" src="@img/svg/u200red.svg" />
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination :hide-on-single-page="total < pageSize" background @size-change="getTable" @current-change="getTable" :current-page.sync="pageNum" :page-sizes="[10, 20, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: 0 20px">
        </el-pagination>
      </div>
    </Loading>
    <el-dialog title="预警处理" v-if="showReason" :visible.sync="showReason" width="80%">
      <el-table :data="reasonArr" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="reason_info" label="预警原因"> </el-table-column>
        <el-table-column prop="suggest" label="建议操作"> </el-table-column>
      </el-table>
      <div style="text-align: right;width: 100%; margin-top: 20px">
        <el-button @click="saveBtn" type="primary">确认处理</el-button>
      </div>
    </el-dialog>
    <el-dialog title="日志" v-if="showLog" :visible.sync="showLog" width="80%">
      <el-table :data="logArr">
        <el-table-column prop="device_name" label="设备名称"> </el-table-column>
        <el-table-column prop="reason_info" label="预警原因"> </el-table-column>
        <el-table-column prop="option_time" label="操作时间"> </el-table-column>
        <el-table-column prop="USER_NAME" label="操作人"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Loading from '@c/Loading';
export default {
  data() {
    return {
      loading: false,
      headData: {
        name: '设备名称',
        machineCode: '机组位号',
        diverCode: '驱动端编号',
        udiverCode: '非驱动端编号',
        type: '密封类型',
        sealingForm: '密封形式',
        sealingCode: '密封编号',
        flushingScheme: '冲洗方案',
        total: 0,
      },
      pageNum: 1,
      pageSize: 10,
      changeData: false,
      reasonArr: [],
      showReason: false,
      multipleSelection: [],
      deviceId: "",
      logArr: [],
      showLog: false,
    };
  },
  components: {
    Loading,
  },
  computed: {
    currentOrgId() {
      return this.$store.state.currentOrgId;
    },
  },
  watch: {
    currentOrgId: {
      handler: 'getTable',
      immediate: true,
    },
  },
  methods: {
    getTable() {
      this.loading = true;
      this.$axios
        .get(this.$axios.base() + this.$api.queryDevices(), {
          page: this.pageNum,
          rows: this.pageSize,
          orgId: this.currentOrgId || this.$GetStorage('currentOrgId'),
        })
        .then((res) => {
          const dataArr = res.data.rows;
          this.total = res.data.total;
          this.tableData = dataArr;
          this.changeData = !this.changeData;
          var len = dataArr.length;
          for (var i = 0; i < len; i++) {
            if (dataArr[i].isdefault) {
              this.$store.state.deviceId = dataArr[i].id;
              return;
            }
          }
          this.$store.state.deviceId = dataArr[0].id;
          this.$SetStorage('deviceId', this.$store.state.deviceId);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      if (val && 'id' in val) {
        this.$store.state.deviceId = val.id;
        this.$SetStorage('deviceId', this.$store.state.deviceId);
      }
    },
    handleClick(row, type) {
      this.deviceId = row.id;
      if (type === 1) {
        this.$store.state.deviceId = row.id;
        this.$SetStorage('deviceId', this.$store.state.deviceId);
        this.$router.replace('/equipment');
      }
      if (type === 2) {
        this.loading = true;
        this.$axios
          .post(this.$axios.base() + this.$api.saveDefault(), {
            deviceId: row.id,
          })
          .then(() => {
            this.getTable();
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (type === 3) {
        this.loading = true;
        this.$axios
          .get(this.$axios.base1() + this.$api.reason(), {
            deviceId: row.id,
          })
          .then((res) => {
            this.reasonArr = res.value;
            this.showReason = true;
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (type === 4) {
        this.loading = true;
        this.$axios
          .get(this.$axios.base1() + this.$api.log(), {
            device_id: row.id,
          })
          .then((res) => {
            this.logArr = res.value;
            this.showLog = true;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    saveBtn() {
      if (this.multipleSelection.length) {
        this.$confirm('确认处理?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idArr = [];
          this.multipleSelection.forEach(item => {
            idArr.push(item.reason_id)
          })
          this.$axios
            .get(this.$axios.base1() + this.$api.deal(), {
              company_id: this.currentOrgId || this.$GetStorage('currentOrgId'),
              device_id: this.deviceId,
              user_id: this.$GetStorage('userId'),
              reason: idArr.join(","),
            })
            .then(() => {
              this.showReason = false;
              this.getTable();
            })
        })
      } else {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '请勾选已处理的预警',
        });
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.home2 {
  position: relative;
  .top {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    .click {
      cursor: pointer;
    }
  }
  .handle {
    margin: 0;
    color: #fff;
  }
  .stateImg {
    float: right;
    margin-top: 5px;
  }
}
</style>
