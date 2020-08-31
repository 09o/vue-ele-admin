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
            <el-col :span="5">
              <el-tag
                @close="deleteRight(scope.row, item.id)"
                type="danger"
                closable
              >{{ item.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="item2 in item.children" :key="item2.id">
                <el-col :span="5">
                  <el-tag
                    @close="deleteRight(scope.row, item2.id)"
                    type="success"
                    closable
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    @close="deleteRight(scope.row, item3.id)"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">未分配权限</el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="updateRole(scope.row)" size="mini" type="success">修改</el-button>
          <el-button size="mini" type="warning">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改权限 -->
    <el-dialog title="修改权限" @closed="clearUpdateData" :visible.sync="dialogFormVisibleUpdate">
      <el-tree
        :data="roleTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="assignedRole"
        :props="defaultProps"
        ref="treeRole"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      roleTree: [],
      assignedRole: [],
      currentId: -1,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      dialogFormVisibleUpdate: false,
    };
  },
  methods: {
    addRole(e) {
      this.$btnBlur(e);
    },
    async getRoleList() {
      const res = await this.$http.get("roles");
      this.roleList = res.data.data;
    },
    // 删除角色指定权限
    async deleteRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // console.log(res);
      const {
        data,
        meta: { msg, status },
      } = res.data;
      if (status === 200) {
        this.$message({
          message: msg,
          type: "success",
          duration: 1500,
        });
        role.children = data;
        // 会刷新整个表格
        // this.getRoleList()
      } else {
        this.$message({
          message: msg,
          type: "warning",
          duration: 1500,
        });
      }
    },
    // 初始化权限表单
    clearUpdateData() {
      this.assignedRole = [];
    },
    // 修改权限
    async updateRole(roles) {
      this.currentId = roles.id;
      // 获取树形结构权限
      const { data } = await this.$http.get("rights/tree");
      this.roleTree = data.data;
      // 获取已经授权选项id
      roles.children.forEach((r) => {
        r.children.forEach((i) => {
          i.children.forEach((c) => {
            this.assignedRole.push(c.id);
          });
        });
      });
      this.dialogFormVisibleUpdate = true;
    },
    // 提交权限修改结果
    async submitUpdateRights() {
      this.dialogFormVisibleUpdate = false;
      // eUI文档提供的方法
      const node1 = this.$refs.treeRole.getCheckedKeys()
      const node2 = this.$refs.treeRole.getHalfCheckedKeys()
      const allKeys = [...node1, ...node2]
      const checkedRight = allKeys.join(",");
      const res = await this.$http.post(`roles/${this.currentId}/rights`, {
        rids: checkedRight,
      });
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.$message({
          message: msg,
          type: 'success',
          duration: 1500
        })
        this.getRoleList()
      } else {
        this.$message({
          message: msg,
          type: 'warning',
          duration: 2000
        })
      }
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