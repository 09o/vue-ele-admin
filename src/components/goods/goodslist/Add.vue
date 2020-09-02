<template>
  <el-card class="box-card">
    <el-page-header @back="goBack" content="添加商品信息" class="pageheader"></el-page-header>
    <el-steps :active="parseInt(activeTab)" simple finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeTab" :tab-position="tabPosition" style="height: 200px; margin: 20px 0;">
      <el-tab-pane name="0" label="基本信息">基本信息</el-tab-pane>
      <el-tab-pane name="1" label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane name="3" label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane name="4" label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      tabPosition: "right",
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "goods" });
    },
  },
};
</script>

<style scoped>
.pageheader {
  margin: 10px 0;
}
</style>