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
    <el-form
      label-position="left"
      label-width="80px"
      :model="goodsInfo"
      style="height: 450px; overflow: auto; position: relative;"
    >
      <el-tabs
        @tab-click="tabChange"
        v-model="activeTab"
        tab-position="right"
        style="margin: 20px 0;"
      >
        <el-tab-pane name="0" label="基本信息">
          <el-form-item label="名称">
            <el-input v-model="goodsInfo.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="goodsInfo.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="重量">
            <el-input v-model="goodsInfo.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="goodsInfo.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="block">
              <el-cascader
                v-model="selectedValue"
                :props="defaultProps"
                :options="goodsCategories"
                :show-all-levels="false"
                clearable
              ></el-cascader>
            </div>
          </el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane name="1" label="商品参数">
          <div v-if="attr.length!==0">
            <el-form-item
              label-width="100px"
              v-for="item in attr"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="checkdAttr" @change="checkboxUpdate(item.attr_id)">
                <el-checkbox
                  v-for="(val,i) in item.attr_vals.split(',')"
                  :key="i"
                  :label="val"
                  border
                  size="medium"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <!-- 无参数可用时显示状态 -->
          <div v-else style="margin: 10px 0;">{{ '该商品无可用参数可选' }}</div>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品属性">
          <el-form-item
            v-for="item in attrOnly"
            :key="item.attr_id"
            :label="item.attr_name"
            label-width="150px"
          >
            <el-input v-model="item.attr_vals" class="attrOnlyInput"></el-input>
          </el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品图片">
          <el-form-item label-width="0">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="header"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              list-type="picture"
              style="padding: 0 0 20px;"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-divider>
              <el-button type="primary" @click="next">下一步</el-button>
            </el-divider>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品内容">
          <el-form-item label="商品描述">
            <quill-editor v-model="goodsInfo.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-button
        v-show="activeTab == 4"
        type="success"
        @click="submitAddGoods"
        class="submitAddBtn"
      >提交</el-button>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本工具
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      activeTab: 0,
      // 已选分类
      selectedValue: [],
      goodsCategories: [],
      // 勾选的参数
      checkdAttr: [],
      attrId: -1,
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 动态参数
      attr: [],
      // 静态参数
      attrOnly: [],
      // 上传图片的请求头部
      header: {
        Authorization: localStorage.getItem("token"),
      },
      goodsInfo: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
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
    // 下一步操作
    async next() {
      const value = this.selectedValue;
      if (value.length !== 0) {
        // 获取动态参数列表信息
        if (this.activeTab == 0) {
          const res = await this.$http.get(
            `categories/${value[value.length - 1]}/attributes?sel=many`
          );
          this.attr = res.data.data;
        } else if (this.activeTab == 1) {
          const res = await this.$http.get(
            `categories/${value[value.length - 1]}/attributes?sel=only`
          );
          this.attrOnly = res.data.data;
        }
        +this.activeTab++;
        this.activeTab = this.activeTab.toString();
      } else {
        this.$message.warning("请先选择商品分类");
      }
    },
    // 切换商品参数tab时判断上一步是否完成
    tabChange() {
      if (this.activeTab == 1 || this.activeTab == 2) {
        if (this.selectedValue.length === 0) {
          this.activeTab = "0";
          this.attr = [];
          this.$message.warning("请先选择商品分类");
        }
      }
    },
    // 参数选择勾选取消触发事件
    checkboxUpdate(id) {
      this.attrId = id;
    },
    // 图片上传的一些方法
    handleRemove(file) {
      const idx = this.goodsInfo.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.goodsInfo.pics.splice(idx, 1);
    },
    handleSuccess(file) {
      this.goodsInfo.pics.push({ pic: file.data.tmp_path });
    },
    // 提交添加商品信息
    async submitAddGoods() {
      // goods_cat  以为','分割的分类列表
      this.goodsInfo.goods_cat = this.selectedValue.join(",");
      if (this.checkdAttr.length > 0) {
        const attrManyValue = this.checkdAttr.join(",");
        const attrMany = {
          attr_id: this.attrId,
          attr_value: attrManyValue,
        };
        const attrOnlyList = this.attrOnly.map((item) => {
          return {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
        });
        this.goodsInfo.attrs = [attrMany, ...attrOnlyList];
      }
      // pics  上传的图片临时路径（对象）
      const res = await this.$http.post("goods", this.goodsInfo);
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status === 201) {
        this.$message({
          type: "success",
          message: msg,
          duration: 1500,
        });
        this.$router.push({ name: "goods" });
      } else {
        this.$message({
          type: "warning",
          message: msg,
          duration: 1500,
        });
      }
    },
  },
  created() {
    this.getCategories();
  },
};
</script>

<style>
.pageheader {
  margin: 10px 0;
}
.ql-editor {
  height: 300px;
}
.submitAddBtn {
  position: absolute;
  right: 10px;
  bottom: 20px;
}
</style>