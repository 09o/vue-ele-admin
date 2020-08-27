<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple logo">
            <img src="../assets/logo.png" alt />
          </div>
        </el-col>
        <el-col class="middle-title" :span="16">
          <h3>Vemanage后台管理系统</h3>
        </el-col>
        <el-col class="right-exit" :span="4">
          <div class="grid-content bg-purple">
            <a href="javascript:;">
              <i class="el-icon-remove"></i>
              退出登录
            </a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;

  .header {
    background-color: #333;
    color: #eee;

    .el-row {
      height: 100%;

      .el-col {
        height: 100%;
        display: flex;
        align-items: center;

        &.middle-title {
          justify-content: center;
        }

        &.right-exit {
          justify-content: flex-end;
          
          a {
            color: #eee;
            text-decoration: none;

            i {
              color: #b44f4f;
            }
          }
        }
      }
    }

    img {
      width: 100%;
    }
  }

  .aside {
    background-color: #999;
  }

  .main {
    background-color: #ccc;
  }
}
</style>