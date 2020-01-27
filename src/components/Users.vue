<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb slot1="用户管理" slot2="用户列表"></breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="7">
          <el-row>
            <el-col :span="20"><el-input placeholder="请输入搜索的内容" v-model="page.query" clearable @clear="getUserList" class="search-input"></el-input></el-col>
            <el-col :span="4"><el-button class="search-btn" type="warning" @click="getUserList" icon="el-icon-search"></el-button></el-col>
          </el-row>
        </el-col>
        <el-col :span="3">
          <el-button class="add-btn" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#ffdc00" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="showEditForm(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showRoleDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="page.pagenum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[3, 5, 10, 20]"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddUserDialog">
      <!-- 主体内容 -->
      <el-form ref="addFormRef" :model="addUserForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditUserDialog">
      <!-- 主体表单区域 -->
      <el-form ref="editFormRef" :model="editUserForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" label-width="80px" prop="username">
          <el-input v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="80px">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="editForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%" @close="closeRoleDialog">
      <!-- 主体表单区域 -->
      <span class="inlb">当前的用户：{{ userInfo.username }}</span
      ><br />
      <span class="inlb">当前的角色：{{ userInfo.role_name }}</span
      ><br />
      <div>
        分配新角色：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option v-for="item in roleDta" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="warning" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取到的列表数据
      userList: [],
      // 发送请求的页码参数
      // 默认当前页码
      // 默认每页显示条数
      page: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12个字符', trigger: 'blur' }
        ]
      },
      // 编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      // 根据ID请求到的数据
      editUserForm: {},
      // 控制分配权限对话框的显示与隐藏
      roleDialogVisible: false,
      // 当前选择到的用户权限
      userInfo: {},
      // 获取到的所有的用户权限信息
      roleDta: [],
      // 已选中的角色ID值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户的数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.page })
      if (res.meta.status !== 200) {
        this.$msg.error('获取列表失败')
      }
      this.userList = res.data.users
      // console.log(this.userList)
      this.total = res.data.total
    },
    // 当每页条数发生改变时
    handleSizeChange(v) {
      this.page.pagesize = v
      this.getUserList()
    },
    // 当当前页面发生变化时
    handleCurrentChange(v) {
      this.page.pagenum = v
      this.getUserList()
    },
    // 当点击添加用户按钮时 弹出对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 发送添加用户请求
    addUser() {
      // 发送请求之前先进行预效验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$msg.error('请输入合法的内容')
        const { data: res } = await this.$http.post('users', this.addUserForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$msg.error('添加用户失败！')
        this.$msg.success('添加用户成功')
        // 将对话框关闭
        this.addDialogVisible = false
      })
    },
    // 当关闭对话框时
    closeAddUserDialog() {
      // 将表单重置
      this.$refs.addFormRef.resetFields()
    },
    // 当用户状态发生改变时
    async stateChange(v) {
      // 向服务器发送请求更改状态
      const { data: res } = await this.$http.put(`users/${v.id}/state/${v.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('修改用户状态失败！')
      this.$msg.success('修改状态成功')
    },
    async showEditForm(id) {
      // 向服务器发送请求
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取数据失败')
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    // 点击确认修改按钮
    editForm() {
      // 先进行预效验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$msg.error('请输入合法信息')
        // 向服务器发送修改信息请求
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, this.editUserForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$msg.error('更新数据失败')
        this.$msg.success('更新数据成功')
        this.editDialogVisible = false
      })
    },
    // 关闭编辑用户对话框时将表单验证重置
    closeEditUserDialog() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击删除按钮时
    async deleteUser(id) {
      // 弹出确认删除对话框
      const isConfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (isConfirm !== 'confirm') return this.$msg.info('已取消删除')
      this.$msg.success('删除成功')
      const { data: res } = await this.$http.delete('users/' + id)
      // console.log(res)
      this.getUserList()
    },
    // 展开分配角色对话框
    async showRoleDialog(role) {
      // 将当前项保存
      this.userInfo = role
      console.log(this.userInfo)

      // 在对话框展示之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取数据失败！')
      this.roleDta = res.data
      // 显示对话框
      this.roleDialogVisible = true
    },
    // 点击确定分配角色
    async saveRoleInfo() {
      // 如果没有选中角色
      if (!this.selectedRoleId) return this.$msg.error('请选择要分配的角色')
      // 向服务器发送请求
      const { data: res } = await this.$http.put(`roles/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$msg.error('更新角色失败！')
      this.$msg.success('更新角色成功')
      this.getUserList()
      // 将对话框关闭
      this.roleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    closeRoleDialog() {
      // 将存储的选中的角色ID删除
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
.search-input /deep/ .el-input__inner {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.search-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  height: 40px;
  background-color: #ebb563;
}
.add-btn {
  display: inline-block;
  margin-left: 40px;
  background-color: #ffdc00;
  height: 40px;
  box-sizing: border-box;
  border: 0;
}
.el-table {
  margin: 10px 0;
}
.inlb {
  display: inline-block;
  margin: 10px 0;
}
</style>
