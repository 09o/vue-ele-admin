<template>
  <el-card class="box-card">
    <div class="text item">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="searchRow">
        <el-col>
          <el-input
            @clear="loadUsers"
            clearable
            placeholder="查找用户"
            v-model="query"
            class="inputSearch"
          >
            <el-button @click="searchUsers" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="info" @click="dialogFormVisibleAdd = true">添加用户</el-button>
          <!-- 新增用户对话框 -->
          <el-dialog
            title="用户添加"
            @close="clearForm('userForm')"
            :visible.sync="dialogFormVisibleAdd"
            width="500px"
          >
            <el-form label-position="right" label-width="80px" :model="userForm">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  show-password
                  v-model="userForm.password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userForm.email" autocomplete="new-password"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="userForm.mobile" autocomplete="new-password"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <!-- 使用过滤器来处理时间的格式 -->
        <!-- template内部要使用数据 设置slot-scope属性
             该属性的值为要使用数据的源数据
             slot-scope属性中的值会自动匹配源数据
        -->
        <!-- 
          userList.row 数组中的每个对象
        -->
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.create_time | fmtDate }}</template>
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch
              @change="changeMgState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top">
              <el-button
                @click="previewTheUser($event, scope.row)"
                size="mini"
                plain
                type="success"
                icon="el-icon-view"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button
                @click="editTheUser($event, scope.row)"
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="权限角色" placement="top">
              <el-button
                @click="assignPermission($event, scope.row)"
                size="mini"
                plain
                type="warning"
                icon="el-icon-check"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                @click="deleteTheUser($event, scope.row.id)"
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看用户 -->
      <el-dialog
        @close="clearForm('userForm')"
        title="用户信息"
        :visible.sync="dialogFormVisiblePreview"
        width="500px"
      >
        <el-form label-position="left" label-width="120px" :model="userForm">
          <el-form-item label="用户id">
            <template>{{ userForm.id }}</template>
          </el-form-item>
          <el-form-item label="用户名">
            <template>{{ userForm.username }}</template>
          </el-form-item>
          <el-form-item label="邮箱">
            <template>{{ userForm.email }}</template>
          </el-form-item>
          <el-form-item label="电话">
            <template>{{ userForm.mobile }}</template>
          </el-form-item>
          <el-form-item label="创建时间">
            <template>{{ userForm.create_time | fmtDate }}</template>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="userForm.mg_state"
              disabled
            ></el-switch>
          </el-form-item>
          <el-form-item label="权限信息">
            <template>{{ userForm.role_name }}</template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="dialogFormVisiblePreview = false">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog
        title="编辑用户"
        @close="clearForm('userForm')"
        :visible.sync="dialogFormVisibleEdit"
        width="500px"
      >
        <el-form label-position="right" label-width="80px" :model="userForm">
          <el-form-item label="用户名">
            <el-input disabled v-model="userForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userForm.mobile" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="submitEditUser(userForm.id)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色权限 -->
      <el-dialog
        title="分配角色权限"
        @close="clearForm('userForm')"
        :visible.sync="dialogFormVisibleAssign"
        width="500px"
      >
        <el-form label-position="right" label-width="80px">
          <el-form-item label="用户名">{{ currentUsername }}</el-form-item>
          <el-form-item label="用户权限">
            <el-select v-model="currentRoleId">
              <!-- 当新增用户未分配角色时执行此选项 -->
              <el-option label="请选择" :value="-1"></el-option>
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAssign = false">取 消</el-button>
          <el-button type="primary" @click="submitAssign(currentUserId)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 
        当一个子组件改变了一个带 .sync 的 prop 的值时，
      这个变化也会同步到父组件中所绑定的值-->
      <el-pagination
        class="pagination"
        @current-change="handleCurrentChange"
        :current-page.sync="pagenum"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 5,
      total: 0,
      userList: [],
      currentUsername: "",
      currentRoleId: -1,
      currentUserId: -1,
      userForm: {
        id: -1,
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      roles: [],
      value: "管理员",
      dialogFormVisibleAdd: false,
      dialogFormVisiblePreview: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleAssign: false,
      // 用于新增用户表单格式的验证
      // rules: {
      //   username: [
      //     {
      //       required: true,
      //       message: "请输入用户名",
      //       trigger: "blur",
      //     },
      //     {
      //       min: 3,
      //       max: 12,
      //       message: "长度在 3 到 12个字符",
      //       trigger: "blur",
      //     },
      //   ],
      //   password: [
      //     {
      //       required: true,
      //       message: "请输入密码",
      //       trigger: "blur",
      //     },
      //     {
      //       min: 6,
      //       max: 16,
      //       message: "长度在 6 到 16个字符",
      //       trigger: "blur",
      //     },
      //   ],
      // },
    };
  },
  methods: {
    // 获取列表数据
    async getUsersList() {
      // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
      const AUTH_TOKEN = localStorage.getItem("token");
      // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      // | 参数名   | 参数说明     | 备注    |
      // | -------- | ------------| ------- |
      // | query    | 查询参数     | 可以为空 |
      // | pagenum  | 当前页码     | 不能为空 |
      // | pagesize | 每页显示条数 | 不能为空 |
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // id: 500
      // username: "admin"
      // email: "adsfad@qq.com"
      // mobile: "12345678"
      // create_time: 1486720211
      // mg_state: true
      // role_name: "超级管理员"
      const {
        meta: { msg, status },
        data: { total, users },
      } = res.data;
      if (status === 200) {
        // this.$message({
        //   message: msg,
        //   type: "success",
        //   duration: 1000,
        // });
        this.total = total;
        this.userList = users;
      }
    },
    // 获取角色列表
    async getRolesList() {
      const res = await this.$http.get("roles");
      this.roles = res.data.data;
    },
    // 页码改变时重新获取列表数据
    handleCurrentChange(val) {
      this.getUsersList();
    },
    // 列表搜索功能
    loadUsers() {
      this.getUsersList();
    },
    searchUsers() {
      this.getUsersList();
    },
    // 关闭表单对话框后清空表单内容
    clearForm(formName) {
      for (let key in this.userForm) {
        if (this.userForm.hasOwnProperty(key)) {
          this.userForm[key] = "";
        }
      }
    },
    // 添加用户提交
    async addUser() {
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post("users", this.userForm);
      // console.log(res);
      const {
        meta: { msg, status },
        data,
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.getUsersList();
      } else {
        this.$message.warning(msg);
      }
    },
    // 修改用户状态
    async changeMgState(user) {
      await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
    },
    // 预览用户信息
    previewTheUser(e, user) {
      this.btnBlur(e);
      this.dialogFormVisiblePreview = true;
      this.userForm = { ...user };
    },
    // 打开编辑用户信息框
    editTheUser(e, user) {
      this.btnBlur(e);
      this.dialogFormVisibleEdit = true;
      this.userForm = { ...user };
      this.currentUserId = user.id;
    },
    // 提交编辑信息
    async submitEditUser(userId) {
      this.dialogFormVisibleEdit = false;
      const res = await this.$http.put(`users/${userId}`, this.userForm);
      const {
        meta: { msg, status },
      } = res.data;
      if (status === 200) {
        this.$message({
          message: msg,
          type: "success",
          duration: 1000,
        });
        this.getUsersList();
      } else {
        this.$message({
          message: msg,
          type: "warning",
          duration: 1000,
        });
      }
    },
    // 获取分配角色权限相关信息
    async assignPermission(e, user) {
      this.btnBlur(e);
      this.currentUsername = user.username;
      this.currentUserId = user.id;
      this.dialogFormVisibleAssign = true;
      const res = await this.$http.get(`users/${user.id}`);
      const {
        data: { rid },
      } = res.data;
      this.currentRoleId = rid;
    },
    // 提交分配
    submitAssign(uid) {
      this.$http.put(`users/${uid}/role`, {
        rid: this.currentRoleId
      });
      this.dialogFormVisibleAssign = false;
    },
    // 删除用户
    deleteTheUser(e, userId) {
      // 点击按钮后失去焦点
      this.btnBlur(e);
      this.$confirm("确定删除该用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除请求
          const res = await this.$http.delete(`users/${userId}`);
          const {
            meta: { status, msg },
          } = res.data;
          if (status === 200) {
            this.getUsersList();
            this.$message({
              type: "success",
              message: msg,
              duration: 1000,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 500,
          });
        });
    },
    // 点击button后让其失去焦点
    btnBlur(e) {
      let target = e.target;
      if (target.nodeName == "I") {
        target = e.target.parentNode;
      }
      target.blur();
    },
  },
  created() {
    this.getUsersList();
    this.getRolesList();
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
.box-card {
  height: 100%;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0 0;
}
</style>