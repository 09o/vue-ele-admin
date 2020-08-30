<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理列表</el-breadcrumb-item>
      </el-breadcrumb>
  </el-card>
</template>

<script>
export default {};
</script>

<style scoped>
.box-card {
  height: 100%;
}
</style>