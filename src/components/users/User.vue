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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="name" label="邮箱"></el-table-column>
        <el-table-column prop="name" label="电话"></el-table-column>
        <el-table-column prop="name" label="创建时间"></el-table-column>
        <el-table-column prop="name" label="用户状态"></el-table-column>
        <el-table-column prop="address" label="操作"></el-table-column>
      </el-table>
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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        }
      ],
    };
  },
  methods: {
// | 参数名   | 参数说明     | 备注     |
// | -------- | ------------ | -------- |
// | query    | 查询参数     | 可以为空 |
// | pagenum  | 当前页码     | 不能为空 |
// | pagesize | 每页显示条数 | 不能为空 |
    async getUsersList() {

      // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
      const AUTH_TOKEN = localStorage.getItem('token')
      // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
    }
  },
  created() {
    this.getUsersList()
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
</style>