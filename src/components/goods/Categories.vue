<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row style="margin: 10px 0;">
      <el-col>
        <el-button type="info" @click="addCat">添加分类</el-button>
      </el-col>
    </el-row>
    <el-table :data="catDataFull" max-height="500px" style="width: 100%;">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        file-icon
        folder-icon
      ></el-table-tree-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">{{ scope.row.cat_level | fmtLevel }}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <div v-if="scope.row.cat_deleted === false">有效</div>
          <div v-else>无效</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button size="mini" plain type="success" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>
    <!-- 
      树形表格使用插件element-tree-grid
      elelment自带表格树有卡顿现象
    -->
    <!-- <el-table
      row-key="cat_id"
      :tree-props="{children: 'children'}"
      :data="catData"
      max-height="500px"
      style="width: 100%"
    >
      <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
      <el-table-column label="级别" width="180">
        <template slot-scope="scope">{{ scope.row.cat_level | fmtLevel }}</template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <div v-if="scope.row.cat_deleted === false">有效</div>
          <div v-else>无效</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button size="mini" plain type="success" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
    ></el-pagination>
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="100px">
          <el-cascader
            v-model="form.selectedValue"
            :props="defaultProps"
            :options="catData"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCat">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 5,
      total: 0,
      form: {
        name: "",
        // 级联选择器当前选中值
        selectedValue: [],
      },
      // 级联选择器配置选项
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 级联选择器分类数据
      catData: [],
      catDataFull: [],
      dialogFormVisible: false,
    };
  },
  methods: {
    // 获取分类数据
    async getCat() {
      const res = await this.$http.get("categories?type=2");
      this.catData = res.data.data;
    },
    async getCatFull() {
      const res = await this.$http.get(
        `categories?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.catDataFull = res.data.data.result;
      this.total = res.data.data.total;
    },
    // 添加分类btn
    addCat() {
      this.dialogFormVisible = true;
    },
    // 提交添加分类信息
    async submitAddCat() {
      // 涉及三种情况
      // 1. 一级分类 selectedValue.length === 0   cat_pid = 0  cat_level = 1
      // 1. 二级分类 selectedValue.length === 1   cat_pid = slectedValue[0]  cat_level = 2
      // 1. 三级分类 selectedValue.length === 2   cat_pid = selectedValue[1]  cat_level = 3
      if (this.form.selectedValue.length === 0) {
        var catPid = 0;
        var catLevel = 0;
      } else if (this.form.selectedValue.length === 1) {
        var catPid = this.form.selectedValue[0];
        var catLevel = 1;
      } else if (this.form.selectedValue.length === 2) {
        var catPid = this.form.selectedValue[1];
        var catLevel = 2;
      }
      const res = await this.$http.post("categories", {
        cat_pid: catPid,
        cat_name: this.form.name,
        cat_level: catLevel,
      });
      const {
        meta: { msg, status },
      } = res.data;
      if (status === 201) {
        this.dialogFormVisible = false;
        this.form = {};
        this.$message.success(msg);
        this.getCatFull();
        this.getCat();
      } else {
        this.$message.warning(msg);
      }
      // console.log(res);
    },
    // 修改当前页显示数量
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCatFull();
    },
    // 改变页码
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getCatFull();
    },
  },
  created() {
    this.getCat();
    this.getCatFull();
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
}
</style>