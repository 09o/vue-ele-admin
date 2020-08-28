<template>
  <el-card class="box-card">
    <div class="text item">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="searchRow">
        <el-col>
          <el-input placeholder="查找用户" v-model="query" class="inputSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="info">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <!-- 使用过滤器来处理时间的格式 -->
        <!-- template内部要使用数据 设置slot-scope属性
             该属性的值为要使用数据的源数据
             slot-scope属性中的值会自动匹配源数据
        -->
        <!-- 
          userList.row 数组中的每个对象
        -->
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.create_time | fmtDate }}</template>
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip content="查看" placement="top">
              <el-button size="mini" plain type="success" icon="el-icon-view" circle></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 
        当一个子组件改变了一个带 .sync 的 prop 的值时，
        这个变化也会同步到父组件中所绑定的值 -->
      <el-pagination
        class="pagination"
        @current-change="handleCurrentChange"
        :current-page.sync="pagenum"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      userList: [],
    };
  },
  methods: {
    async getUsersList() {
      // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
      const AUTH_TOKEN = localStorage.getItem("token");
      // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // | 参数名   | 参数说明     | 备注    |
      // | -------- | ------------| ------- |
      // | query    | 查询参数     | 可以为空 |
      // | pagenum  | 当前页码     | 不能为空 |
      // | pagesize | 每页显示条数 | 不能为空 |
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // id: 500
      // username: "admin"
      // email: "adsfad@qq.com"
      // mobile: "12345678"
      // create_time: 1486720211
      // mg_state: true
      // role_name: "超级管理员"
      const {
        meta: { msg, status },
        data: { total, users },
      } = res.data;
      if (status === 200) {
        this.$message({
          message: msg,
          type: "success",
          duration: 1000,
        });
        this.total = total
        this.userList = users;
      }
    },
    // 页码改变时触发
    handleCurrentChange(val) {
      this.getUsersList()
    }
  },
  created() {
    this.getUsersList();
  },
};
</script>

<style scoped>
.searchRow {
  margin: 10px 0;
}
.inputSearch {
  width: 300px;
}
.box-card {
  height: 100%;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
}
</style>