<template>
  <div class="home4">
    <div class="top">
      <div class="svg">
        <img class="svg1" src="@img/svg/u95.svg" />
        <img class="svg2" src="@img/svg/u96.svg" />
        <img class="svg3" src="@img/svg/u97.svg" />
      </div>
      <p class="title">所有机组密封运行参数整体情况</p>
    </div>
    <Loading class="content home-box" :loading="loading">
      <div class="table-wrapper">
        <el-table :data="tableData" :show-header="false" stripe>
          <el-table-column prop="sort" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="week"></el-table-column>
          <el-table-column prop="month"></el-table-column>
          <el-table-column prop="quarter"></el-table-column>
          <el-table-column prop="halfy"></el-table-column>
          <el-table-column prop="year"></el-table-column>
        </el-table>
      </div>
    </Loading>
  </div>
</template>
<script>
import Loading from '@c/Loading';
export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: false,
      headData: {
        sort: '',
        week: '近一星期',
        month: '近一月',
        quarter: '近三月',
        halfy: '近六月',
        year: '近一年',
      },
      tableData: [],
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
  methods: {
    getTable() {
      this.loading = true;
      this.$axios
        .get(this.$axios.base1() + this.$api.statistics(), {
          company_id: this.currentOrgId || this.$GetStorage('currentOrgId'),
        })
        .then((res) => {
          const dataArr = res.value;
          this.tableData = [this.headData, ...dataArr];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.home4 {
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
    .svg3 {
      position: absolute;
    }
    .svg1 {
      width: 25px;
      height: 25px;
      left: 0px;
      top: 0px;
    }
    .svg2 {
      width: 18px;
      height: 17px;
      left: 4px;
      top: 4px;
    }
    .svg3 {
      width: 7px;
      height: 7px;
      left: 18px;
      top: 3px;
    }
  }
}
.content {
  height: 335px;
  .table-wrapper {
    height: 256px;
    overflow-y: auto;
    margin: 40px 20px;
    padding: 0px;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
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
</style>
