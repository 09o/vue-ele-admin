<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col class="left-logo" :span="6">
          <img src="../assets/logo.png" alt />
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="setCollapse"></i>
        </el-col>
        <el-col class="middle-title" :span="12">
          <h3>Ve后台管理系统</h3>
        </el-col>
        <el-col class="right-exit" :span="6">
          <div class="grid-content bg-purple">
            <a href="javascript:;" @click.prevent="logout">
              <i class="el-icon-remove"></i>
              退出登录
            </a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? 'auto' : '200px'" class="aside">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="#eee"
          text-color="#333"
          unique-opened
          router
        >
          <el-submenu :index="item.order.toString()" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i v-if="item.order===1" class="el-icon-user-solid"></i>
              <i v-if="item.order===2" class="el-icon-error"></i>
              <i v-if="item.order===3" class="el-icon-s-goods"></i>
              <i v-if="item.order===4" class="el-icon-s-order"></i>
              <i v-if="item.order===5" class="el-icon-s-data"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item-group v-for="item2 in item.children" :key="item2.id">
              <el-menu-item :index="item2.path">{{ item2.authName }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-error"></i>
              <span slot="title">权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="roles">角色列表</el-menu-item>
              <el-menu-item index="rights">权限列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span slot="title">商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">商品列表</el-menu-item>
              <el-menu-item index="3-2">分类参数</el-menu-item>
              <el-menu-item index="3-3">商品分类</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">订单列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="5-1">统计信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
      isCollapse: false,
    };
  },
  methods: {
    // 获取导航数据
    async getMenus() {
      const res = await this.$http.get('menus')
      this.menus = res.data.data
    },
    // 左侧导航栏展开
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 退出登录
    logout() {
      // 清除token
      localStorage.removeItem("token");
      // 提示信息
      this.$message({
        message: '退出成功',
        type: 'success',
        duration: 1500
      });
      setTimeout(() => {
        this.$router.push("/login");
      }, 1000);
    },
  },
  // 进入首页的验证
  beforeCreate() {
    // 获取token
    const token = localStorage.getItem("token");
    // 如果有token，继续渲染组件
    if (!token) {
      this.$router.push("/login");
    }
  },
  created() {
    this.getMenus()
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;

  .header {
    background-color: #333;
    color: #eee;
    height: 60px;
    line-height: 60px;
    padding-right: 0;

    .left-logo {
      height: 60px;
      display: flex;
      align-items: center;

      img {
        height: 30px;
        margin-right: 10px;
      }

      i {
        cursor: pointer;
        font-size: 20px;
        line-height: 60px;
        padding: 0 20px;

        &:hover {
          background: #3d3c3c;
        }
      }
    }

    .middle-title {
      text-align: center;
    }

    .right-exit {
      display: flex;
      justify-content: flex-end;
      a {
        display: block;
        min-width: 120px;
        line-height: 60px;
        color: #eee;
        text-decoration: none;
        text-align: center;

        &:hover {
          background: #3d3c3c;
        }
      }
    }
  }

  .aside {
    background-color: #eee;

    .el-menu {
      border-right: none;

      i {
        color: #333 !important;
      }
    }
  }

  .main {
    background-color: #dfdfdf;
  }
}
</style>