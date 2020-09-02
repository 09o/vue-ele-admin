<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="查找商品" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="info" @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 商品列表 -->
    <el-table :data="goodsList" max-height="500px" style="width: 100%">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="重量"></el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">{{ scope.row.upd_time | fmtDate }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button size="mini" type="warning" icon="el-icon-edit" circle></el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: 0,
      goodsList: [],
    };
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status === 200) {
        this.goodsList = data.goods;
        this.total = data.total;
      }
    },
    // 切换页码
    handleCurrentChange() {
      this.getGoodsList();
    },
    // 添加商品
    addGoods() {
      this.$router.push({ name: "addgoods" });
    },
  },
  created() {
    this.getGoodsList();
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
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
}
</style>