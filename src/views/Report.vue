<template>
  <Loading class="report" :loading="loading">
    <div class="search">
      <span class="title">公司名称/设备名称</span>
      <el-input class="input" v-model="searchKey" />
      <el-button type="primary" @click="searchHandle">搜索</el-button>
    </div>
    <div class="table-box table-wrapper2">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="report_num" label="报告编号"></el-table-column>
        <el-table-column label="设备名称">
          <template slot-scope="scope">
            <span class="blue">{{ scope.row.device_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司名称">
          <template slot-scope="scope">
            <span class="blue">{{ scope.row.company_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报告类型">
          <template slot-scope="scope">
            <span class="yellow">{{ typeObj[scope.row.report_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="report_time" label="报告时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="downLoad(scope.row)" :loading="scope.row.downLoadLoading">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination background @size-change="getTable" @current-change="getTable" :current-page.sync="pageNum" :page-sizes="[10, 20, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: 0 20px">
        </el-pagination>
      </div>
    </div>
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
      pageSize: 10,
      pageNum: 1,
      total: 0,
      tableData: [],
      loading: false,
      searchKey: '',
      typeObj: {
        month: '月度报告',
        year: '年度报告',
        quarter: '季度报告',
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
      handler: 'getTable',
      immediate: true,
    },
  },
  beforeCreate() {
    document
      .querySelector('body')
      .setAttribute('style', 'background-color: #081f25');
  },
  methods: {
    getTable() {
      this.loading = true;
      this.$axios
        .get(this.$axios.base1() + this.$api.reportList(), {
          search_name: this.searchKey,
          company_id:
            this.currentOrgId || this.$GetStorage('currentOrgId'),
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.total = res.value.total;
          this.tableData = res.value.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchHandle() {
      this.pageNum = 1;
      this.getTable();
    },
    downLoad(row) {
      this.$Notif({
        type: "info",
        title: "提示",
        message: "报告开始下载",
      });
      this.$set(row, 'downLoadLoading', true)
      this.$axios
        .get(this.$axios.base1() + this.$api.reportDownload(), {
          report_id: row.report_id,
        })
        .then((res) => {
          let blob = new Blob([res]);
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, row.report_name);
          } else {
            const blobUrl = URL.createObjectURL(blob)
            const eleLink = document.createElement('a')
            eleLink.download = row.report_name + ".doc";
            eleLink.style.display = 'none'
            eleLink.href = blobUrl
            // 触发点击
            document.body.appendChild(eleLink)
            eleLink.click()
            // 然后移除
            document.body.removeChild(eleLink)
          }
          this.$Notif({
            type: "success",
            title: "提示",
            message: "报告下载成功",
          });
          this.$set(row, 'downLoadLoading', false);
        })
        .catch(() => {
          this.$Notif({
            type: "error",
            title: "提示",
            message: "服务器或网络异常，下载失败",
          });
          this.$set(row, 'downLoadLoading', false);
        })
      // } else {
      //   let url =
      //     this.$axios.base1() +
      //     this.$api.reportDownload() +
      //     '?report_id=' +
      //     row.report_id;
      //   var divFrame = document.getElementById('downLoadListFrame');
      //   if (divFrame != null) {
      //     document.body.removeChild(divFrame);
      //   }
      //   var iframe = document.createElement('iframe');
      //   iframe.setAttribute('id', 'downLoadListFrame');
      //   iframe.style.display = 'none';
      //   iframe.src = url;
      //   document.body.appendChild(iframe);
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
.report {
  padding: 0 3%;
}
.search {
  padding: 20px 0;
  color: #fff;
  .input {
    margin: 0 10px;
    width: 200px;
  }
}
.table-box {
  overflow: hidden;
  /deep/ {
    .el-table thead {
      color: #fff;
      font-weight: bold;
    }
    .el-table th,
    .el-table tr {
      background-color: transparent;
      padding: 23px 0;
    }
    .el-table td,
    .el-table th {
      border-color: rgb(215, 215, 215);
    }
    .el-table__footer-wrapper,
    .el-table__header-wrapper {
      background-color: rgb(245, 245, 245);
    }
  }
}
</style>
