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
    <el-form label-position="left" label-width="80px" :model="goodsInfo">
      <el-tabs v-model="activeTab" tab-position="right" style="margin: 20px 0;">
        <el-tab-pane name="0" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="goodsInfo.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsInfo.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsInfo.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsInfo.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="block">
              <el-cascader
                v-model="selectedValue"
                :props="defaultProps"
                :options="goodsCategories"
                @change="handleChange"
                :show-all-levels="false"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane name="1" label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane name="2" label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane name="3" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="4" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      selectedValue: [],
      goodsCategories: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      goodsInfo: {
        goods_name: "",
        goods_cat: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
        attrs: "",
      },
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "goods" });
    },
    // 获取三级分类
    async getCategories() {
      const res = await this.$http.get("categories");
      this.goodsCategories = res.data.data;
    },
    next() {
      +this.activeTab++;
      this.activeTab = this.activeTab.toString();
    },
    handleChange() {},
  },
  created() {
    this.getCategories();
  },
};
</script>

<style scoped>
.pageheader {
  margin: 10px 0;
}
</style>