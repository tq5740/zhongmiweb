<template>
  <transition name="fade">
    <div class="login">
      <div class="login-box">
        <img src="@img/logo.png" class="logo" />
        <el-form>
          <el-form-item>
            <el-input type="text" v-model="phoneNum" placeholder="请输入账号" prefix-icon="el-icon-s-custom" :class="phoneNumError ? 'isError' : ''"></el-input>
            <p v-if="phoneNumError" class="warn">{{phoneNumTip}}</p>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="password" placeholder="请输入密码" :class="passwordError ? 'isError' : ''" @keyup.enter.native="loginBtn">
              <i slot="prefix">
                <img class="icon" src="@img/svg/password.svg" alt="" />
              </i>
            </el-input>
            <p v-if="passwordError" class="warn">{{passwordTip}}</p>
          </el-form-item>
          <!-- <el-form-item class="remember">
						<el-checkbox v-model="isRemember">记住密码</el-checkbox>
					</el-form-item> -->
          <el-form-item>
            <el-button class="btn" type="primary" @click="loginBtn" v-loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      phoneNum: '',
      password: '',
      isRemember: '',
      phoneNumError: false,
      passwordError: false,
      phoneNumTip: "",
      passwordTip: "",
      loading: false,
    };
  },
  methods: {
    format() {
      if (!this.phoneNum) {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '请填写账号',
        });
        return false;
      }
      if (!this.password) {
        this.$Notif({
          type: 'error',
          title: '提示',
          message: '请填写密码',
        });
        return false;
      }
      return true;
    },
    loginBtn() {
      if (!this.format()) return;
      this.loading = true;
      this.clearData();
      this.$axios
        .post(this.$axios.base() + this.$api.login(), {
          phoneNum: this.phoneNum,
          password: this.password,
        })
        .then(res => {
          this.$SetStorage('token', res.data.token);
          this.$SetStorage('userId', res.data.userId);
          if (res.data.userCode && res.data.userCode === "superAdmin") {
            this.$SetStorage('superAdmin', true);
          }
          this.$router.replace('/homeMap');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clearData() {
      this.$RemoveStorage('inHome');
      this.$RemoveStorage('currentOrgId');
      this.$RemoveStorage('superAdmin');
      this.$RemoveStorage('deviceId');
      this.$RemoveStorage('orgAllArr');
      this.$store.state.deviceId = "";
      this.$store.state.natureIdArr = [];
      this.$store.state.currentOrgId = null;
      this.$store.state.equipmentId = "";
      this.$store.state.piImgSrc = "";
      this.$store.state.deviceImgSrc = "";
      this.$store.state.piData = [];
      this.$store.state.orgAllArr = [];
    }
  },
};
</script>
<style lang="scss" scoped>
.login {
  min-height: 100vh;
  position: relative;
  width: 100%;
  // background-image: linear-gradient(to bottom right, rgb(21, 73, 154), rgb(37, 152, 209), rgb(21, 73, 154));
  background-color: rgb(37, 152, 209);
}
.login-box {
  width: 340px;
  height: 254px;
  padding: 30px;
  margin-left: -200px;
  margin-top: -152px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  .logo {
    width: 120px;
    margin-bottom: 20px;
  }
  .warn {
    position: absolute;
    left: 2px;
    bottom: -18px;
    line-height: normal;
    color: red;
    font-size: 12px;
  }
  .remember {
    margin: -18px 0 4px 0px;
  }
  .btn {
    width: 100%;
  }
  .isError {
    /deep/ .el-input__inner {
      border-color: red;
    }
  }
}
/deep/ {
  .el-input__prefix {
    .icon {
      width: 15px;
      position: absolute;
      top: 13px;
      left: 5px;
    }
  }
}
</style>
