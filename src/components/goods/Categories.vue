<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row style="margin: 10px 0;">
      <el-col>
        <el-button type="info" @click="addCat">添加分类</el-button>
      </el-col>
    </el-row>
    <el-table :data="catData" max-height="500px" style="width: 100%;">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        file-icon=""
        folder-icon=""
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
    </el-table> -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="100px">
          <el-cascader
            v-model="selectedValue"
            :props="defaultProps"
            :options="catData"
            @change="handleChange"
          ></el-cascader>
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
export default {
  data() {
    return {
      form: {},
      // 级联选择器当前选中值
      selectedValue: [],
      // 级联选择器配置选项
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择器分类数据
      catData: [],
      dialogFormVisible: false,
    };
  },
  methods: {
    // 获取分类数据
    async getCat() {
      const res = await this.$http.get("categories");
      this.catData = res.data.data;
    },
    addCat() {
      this.dialogFormVisible = true;
    },
    handleChange() {},
  },
  created() {
    this.getCat();
  },
};
</script>

<style scoped>
</style>