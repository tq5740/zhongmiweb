<template>
  <div class="filter">
    <el-button @click="create" type="primary" style="margin: 20px 0">创建</el-button>
    <el-table :data="tableData" style="width: 100%" border v-loading="loading">
      <el-table-column label="过滤芯名称" prop="name"></el-table-column>
      <el-table-column label="开始运行时间" prop="startTime"></el-table-column>
      <el-table-column label="结束运行时间" prop="endTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="superAdmin">
      <el-pagination background @size-change="getTable" @current-change="getTable" :current-page.sync="pageNum" :page-sizes="[10, 20, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: 0 20px">
      </el-pagination>
    </div>
    <el-dialog :title="typeText + '过滤芯'" v-if="showDialog" :visible.sync="showDialog" v-loading="loading1" append-to-body>
      <el-form label-position="left" label-width="100px">
        <el-form-item label="过滤芯名称：">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="时间段：">
          <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="saveBtn" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      showDialog: false,
      name: '',
      time: '',
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      orgId: null,
      typeText: '创建',
      id: null,
      superAdmin: false,
    };
  },
  created() {
    this.superAdmin = this.$GetStorage('superAdmin');
    this.getTable();
  },
  methods: {
    getTable() {
      this.loading = true;
      if (this.superAdmin) {
        this.$axios
          .post(this.$axios.base() + this.$api.queryFilterByPage(), {
            page: this.pageNum,
            rows: this.pageSize,
          })
          .then((res) => {
            this.total = res.total;
            this.tableData = res.rows;
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.orgId = this.$GetStorage('currentOrgId');
        this.$axios
          .post(this.$axios.base() + this.$api.queryFilter(), {
            orgId: this.orgId,
          })
          .then((res) => {
            this.tableData = res.data;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    create() {
      this.typeText = '创建';
      this.id = null;
      this.name = '';
      this.time = '';
      this.showDialog = true;
    },
    edit(row) {
      this.typeText = '编辑';
      this.id = row.id;
      this.name = row.name;
      this.time = [row.startTime, row.endTime];
      this.showDialog = true;
    },
    del(row) {
      this.$MessageBox.confirm('确认删除？').then(() => {
        this.loading = true;
        this.$axios
          .post(this.$axios.base() + this.$api.deleteFilter(), {
            id: row.id,
          })
          .then((res) => {
            if (res.success) {
              this.$Notif({
                type: 'success',
                title: '提示',
                message: '删除成功！',
              });
              this.getTable();
            }
          })
          .finally(() => {
            this.loading = false;
          });
      })
        .catch(() => { });
    },
    saveBtn() {
      if (!this.format()) return;
      this.loading1 = true;
      let params = {
        orgId: this.orgId,
        name: this.name,
        startTime: this.time[0],
        endTime: this.time[1],
      };
      let api = '';
      if (this.typeText === '编辑') {
        params.id = this.id;
        api = this.$api.updateFilter();
      } else {
        api = this.$api.saveFilter();
      }
      this.$axios
        .post(this.$axios.base() + api, params)
        .then((res) => {
          if (res.success) {
            this.$Notif({
              type: 'success',
              title: '提示',
              message: this.typeText + '成功！',
            });
            this.showDialog = false;
            this.getTable();
          }
        })
        .finally(() => {
          this.loading1 = false;
        });
    },
    format() {
      if (!this.name) {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '请填写过滤芯名字',
        });
        return false;
      }
      if (!this.time) {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '请填写开始时间和结束时间',
        });
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
