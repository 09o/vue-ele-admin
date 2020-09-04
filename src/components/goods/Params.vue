<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert title="当前只允许为第三级分类设置参数" type="warning" close-text="知道了" class="alert-el"></el-alert>
    <el-row style="margin: 10px 0">
      <el-col>
        <div class="block">
          <span>商品分类</span>
          <el-cascader
            v-model="selectedValue"
            :props="defaultProps"
            :options="goodsCategories"
            :show-all-levels="false"
            clearable
            @change="handleChangeSelect"
          ></el-cascader>
        </div>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin: 20px 0 0;">
      <el-tab-pane label="动态参数" name="first">
        <el-table :data="attrMany" style="width: 100%">
          <el-table-column type="expand" width="50">
            <template slot-scope="scope">
              <el-tag
                closable
                @close="handleClose(scope.row, item)"
                v-for="item in scope.row.attr_vals"
                :key="item"
              >{{ item }}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新建</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column label="操作">
            <el-button size="mini" plain type="success" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete">删除</el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-table :data="attrOnly" height="350px" style="width: 100%">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称"></el-table-column>
          <el-table-column prop="attr_vals" label="属性参数"></el-table-column>
          <el-table-column label="操作">
            <el-button size="mini" plain type="success" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete">删除</el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      attrMany: [],
      attrVals: [],
      attrOnly: [],
      goodsCategories: [],
      activeName: "first",
      inputVisible: false,
      inputValue: "",
    };
  },
  methods: {
    // 获取三级分类数据
    async getCategories() {
      const res = await this.$http.get("categories?type=3");
      this.goodsCategories = res.data.data;
    },
    // 获取参数
    async getAttrMany() {
      const res = await this.$http.get(
        `categories/${
          this.selectedValue[this.selectedValue.length - 1]
        }/attributes?sel=many`
      );
      this.attrMany = res.data.data;
      this.attrMany.forEach((item) => {
        const vals = item.attr_vals.split(",");
        item.attr_vals = vals;
      });
      // console.log(this.attrMany);
    },
    async getAttrOnly() {
      const res = await this.$http.get(
        `categories/${
          this.selectedValue[this.selectedValue.length - 1]
        }/attributes?sel=only`
      );
      this.attrOnly = res.data.data;
    },
    // 改变级联选择器触发
    handleChangeSelect() {
      this.getAttrMany();
      this.getAttrOnly();
    },
    handleClick() {},
    // ####           note          ####
    // #### 由于数据库中未给定编辑权限 ####
    // ####      该操作请求不可用     ####
    async handleClose(arr, tag) {
      arr.attr_vals.splice(arr.attr_vals.indexOf(tag), 1);
      const res = await this.$http.put(
        `categories/${
          this.selectedValue[this.selectedValue.length - 1]
        }/attributes/${arr.attr_id}`,
        {
          attr_name: arr.attr_name,
          attr_sel: "many",
          attr_vals: arr.attr_vals.join(","),
        }
      );
      console.log(res);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 新建参数回车提交
    handleInputConfirm(arr) {
      let inputValue = this.inputValue;
      // 用于判断新输入的参数是否已经存在
      const flag = arr.some((im) => {
        return im === inputValue;
      });
      if (inputValue && !flag) {
        arr.push(inputValue);
        this.inputVisible = false;
        this.inputValue = "";
      } else {
        this.$message.error("该参数已经存在");
      }
    },
  },
  created() {
    this.getCategories();
  },
};
</script>

<style scoped>
.alert-el {
  margin: 10px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>