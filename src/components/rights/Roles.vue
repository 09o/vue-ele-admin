<template>
  <el-card class="box-card">
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-row>
      <el-col>
        <el-button @click="addRole($event)" class="addBtn" plain type="info">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item in scope.row.children" :key="item.id">
            <el-col :span="4">
              <el-tag type="danger">{{ item.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag type="success">{{ item2.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag v-for="item3 in item2.children" :key="item3.id">{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini" type="success" icon="el-icon-check" circle></el-button>
          <el-button size="mini" type="warning" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
    };
  },
  methods: {
    addRole(e) {
      this.$btnBlur(e);
    },
    async getRoleList() {
      const res = await this.$http.get("roles");
      this.roleList = res.data.data;
      console.log(res)
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style scoped>
.addBtn {
  margin: 10px 0;
}

.el-tag {
  margin: 5px;
}
</style>