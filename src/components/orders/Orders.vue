<template>
  <el-card class="box-card">
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <el-table :data="ordersData" border max-height="500px" style="width: 100%; margin: 10px 0;">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <el-table-column label="是否付款" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status == 0">未付款</el-tag>
          <el-tag v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="80"></el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">{{ scope.row.update_time | fmtDate }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button
          size="mini"
          type="primary"
          plain
          icon="el-icon-edit"
          circle
          @click="editOrder($event)"
        ></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
    ></el-pagination>
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" label-position="right" label-width="80px">
        <el-form-item label="城市">
          <el-cascader
            clearable
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" autocomplate="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引用中国省市区级联数据
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode,
} from "element-china-area-data";
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      ordersData: [],
      form: {
        address: "",
      },
      dialogFormVisible: false,
      options: regionData,
      selectedOptions: [],
      selectedOptionsToText: [],
    };
  },
  methods: {
    async getOrderList() {
      const res = await this.$http.get(
        `orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.total = res.data.data.total;
      this.ordersData = res.data.data.goods;
      console.log(res);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getOrderList();
    },
    // 修改订单
    editOrder(e) {
      this.$btnBlur(e);
      this.dialogFormVisible = true;
    },
    handleChange() {
      this.selectedOptionsToText = [];
      this.selectedOptions.forEach((item) => {
        return this.selectedOptionsToText.push(CodeToText[item]);
      });
    },
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style scoped>
</style>