<template>
  <header v-if="$route.fullPath !== '/login'">
    <div class="logo" @click="goHomeMap">
      <img src="@img/logo.png" alt="" />
    </div>
    <ul class="menu">
      <router-link tag="li" to="/home" @click.native="goHome">首页</router-link>
      <router-link tag="li" to="/equipment">设备监控</router-link>
      <router-link tag="li" to="/report">报告管理</router-link>
    </ul>
    <div class="right">
      <el-select class="select" v-model="currentOrgIdData" placeholder="请选择" @change="changeOrg">
        <el-option v-for="item in orgAllArrData" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-popover placement="bottom" v-model="visible" trigger="hover">
        <div style="text-align: right;">
          <el-button @click="update" type="primary">修改密码</el-button>
          <br /><br />
          <el-button @click="logOut" type="primary">退出登录</el-button>
        </div>
        <div slot="reference" class="btn">
          <img src="@img/svg/user.svg" alt="" class="userSvg" />
          <span style="width:4em">个人中心</span>
        </div>
      </el-popover>
    </div>
    <el-dialog title="修改密码" v-if="showDialog" :visible.sync="showDialog">
      <el-form label-position="left" label-width="130px">
        <el-form-item label="旧密码：">
          <el-input type="password" v-model="oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码：">
          <el-input type="password" v-model="password1"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="saveBtn" type="primary">确定修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </header>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      showDialog: false,
      oldPassword: null,
      password: null,
      password1: null,
      currentOrgIdData: null,
      orgAllArrData: []
    };
  },
  computed: {
    currentOrgId() {
      return this.$store.state.currentOrgId;
    },
    orgAllArr() {
      return this.$store.state.orgAllArr;
    }
  },
  watch: {
    currentOrgId: {
      handler: "getCurrentOrgIdData",
      immediate: true,
    },
    orgAllArr: {
      handler: 'getOrgAllArrData',
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getCurrentOrgIdData() {
      this.currentOrgIdData = this.currentOrgId || this.$GetStorage("currentOrgId");
    },
    getOrgAllArrData() {
      this.orgAllArrData = this.orgAllArr.length ? this.orgAllArr : this.$GetStorage("orgAllArr");
    },
    changeOrg() {
      this.$store.state.currentOrgId = this.currentOrgIdData;
      this.$SetStorage('currentOrgId', this.currentOrgIdData);
    },
    logOut() {
      this.visible = false;
      this.$MessageBox.confirm('确认退出登录？').then(() => {
        this.$axios.post(this.$axios.base() + this.$api.logout(), {}).then(() => {
          this.out();
        });
      })
        .catch(() => { });
    },
    update() {
      this.oldPassword = null;
      this.password = null;
      this.password1 = null;
      this.showDialog = true;
    },
    saveBtn() {
      if (!(this.oldPassword && this.password && this.password)) {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '请输入完整',
        });
        return;
      } else if (this.password !== this.password1) {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '两次输入不一致',
        });
        return;
      }
      this.$axios
        .post(this.$axios.base() + this.$api.updatePassword(), {
          oldPassword: this.oldPassword,
          newPassword: this.password,
        })
        .then(() => {
          this.$Notif({
            type: 'success',
            title: '提示',
            message: '密码修改成功！',
          });
          this.out();
        });
    },
    out() {
      this.$RemoveStorage('token');
      this.$router.replace('/login');
    },
    goHomeMap() {
      if (this.$route.path !== "/homeMap") {
        this.$router.replace('/homeMap');
      }
    },
    goHome() {
      if (this.$route.path !== "/home") {
        this.$router.replace('/home');
      }
    }
  },
};
</script>
<style lang="scss" scoped>
header {
  background: #fff;
  font-size: 14px;
  height: 65px;
  line-height: 65px;
  display: flex;
  overflow: hidden;
  .logo {
    margin-top: 5px;
    margin-left: 5px;
    cursor: pointer;
  }
  .logo img {
    width: 197px;
  }
  .menu {
    margin-left: 100px;
    display: flex;
  }
  .menu li {
    width: 150px;
    text-align: center;
    cursor: pointer;
  }
  .menu li.router-link-exact-active {
    color: #fff;
    background-color: #0090e1;
  }
  .right {
    margin-left: auto;
    margin-right: 10px;
    display: flex;
    .select {
      margin-right: 20px;
    }
    .btn {
      display: flex;
    }
    .userSvg {
      margin-right: 10px;
    }
  }
}
</style>
