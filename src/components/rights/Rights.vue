<template>
  <el-card class="box-card">
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <el-table class="table" :data="rightsList" border max-height="500px" style="width: 100%;">
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          {{ scope.row.level | fmtLevel }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get("rights/list");
      this.rightsList = res.data.data
    },
  },
  created() {
    this.getRightList();
  },
};
</script>

<style scoped>
.table {
  margin-top: 10px;
}
</style>