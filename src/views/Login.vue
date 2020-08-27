<template>
  <div class="wrapper">
    <el-form class="demo-ruleForm" :model="loginfo">
      <div class="form-title">vue后台管理系统</div>
      <el-form-item label="用户名">
        <el-input type="text" v-model="loginfo.username" placeholder="用户名/邮箱" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input
          type="password"
          @keyup.enter.native="handleLogin"
          v-model="loginfo.password"
          show-password
          placeholder="密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <div class="btns">
        <el-button type="primary" @click.prevent="handleLogin">登录</el-button>
        <el-button>清空</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginfo: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    // ES7 async+await 使异步操作更方便
    async handleLogin() {
      const res = await this.$http.post("login", this.loginfo)
      const {
        data,
        meta: { msg, status },
      } = res.data;
      // 登录成功：保存token，跳转home
      if (status === 200) {
        this.$message.success(msg);
        setTimeout(() => {
          this.$router.push("/");
        }, 1500);
      // 登录失败，提示信息
      } else {
        this.$message.error(msg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #303744;

  .form-title {
    text-align: center;
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .demo-ruleForm {
    width: 300px;
    padding: 20px 40px 30px;
    background: rgba(243, 243, 243, 0.86);
    border-radius: 10px;

    .btns {
      display: flex;

      button {
        flex: 1;
      }
    }
  }
}
</style>