<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb slot1="权限管理" slot2="角色列表"></breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button type="warning">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table stripe :data="rolesList" style="width: 100%" border row-key="id" :tree-props="{ hasChildren: null, children: null }">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="[in1 == 0 ? 'bor_top' : '', 'bor_bot', 'df']" v-for="(item, in1) in scope.row.children" :key="item.id">
              <!-- 渲染一级 -->
              <el-col :span="5">
                <el-tag closable @close="removeTag(scope.row.id, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级 -->
              <el-col :span="19">
                <el-row :class="[in2 == 0 ? '' : 'bor_top', 'df']" v-for="(val, in2) in item.children" :key="val.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeTag(scope.row.id, val.id)">{{ val.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" @close="removeTag(scope.row.id, v.id)" closable v-for="v in val.children" :key="v.id">{{ v.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="showEditForm(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-button type="warning" size="mini" @click="showConfigRights(scope.row)" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 展示分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="rightDialogVisible" width="50%" @close="closeRightDialog">
      <el-tree ref="treeRefs" :data="rightsList" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" :props="defalProps"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      rightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      defalProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的数组
      defKeys: [],
      // 当前权限的ID
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取数据失败')
      this.rolesList = res.data
    },
    // 当点击移除标签时
    async removeTag(roleId, id) {
      // 弹框提示是否确认删除
      const isResult = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (isResult !== 'confirm') return this.$msg.info('已取消删除')
      // 向服务器发送请求
      const { data: res } = await this.$http.delete(`roles/${roleId}/rights/${id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('删除角色权限失败')
      this.$msg.success('已删除该角色权限')
      this.getRolesList()
    },
    // 点击分配权限按钮
    async showConfigRights(role) {
      // 将该权限的ID保存
      this.roleId = role.id
      // 向服务器发送请求 获取权限列表信息
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取列表失败')
      this.rightsList = res.data

      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defKeys)

      // 显示对话框
      this.rightDialogVisible = true
    },
    // 定义一个递归函数 获取所有三级权限的ID,并保存到数组中(已选中的)
    getLeafKeys(node, arr) {
      // node表示节点 首先判断它是否为第三级节点
      // 如果node不包含children就代表是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭分配权限的对话框
    closeRightDialog() {
      // 将定义的已选中的数组清空
      this.defKeys = []
    },
    // 点击分配权限对话框的确定按钮
    async editRight() {
      // 调用树形控件里的方法获取选中和半选的ID
      const keys = [...this.$refs.treeRefs.getCheckedKeys(), ...this.$refs.treeRefs.getHalfCheckedKeys()]
      console.log(keys)
      // 因为需要的请求参数是以逗号分隔的字符串 所以将数组进行字符串拼接
      const idStr = keys.join(',')
      //  向服务器发起请求 修改用户权限
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('修改失败！')
      this.$msg.success('修改成功！')
      // 修改成功后需要刷新列表
      this.getRolesList()
      // 将对话框关闭
      this.rightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.bor_top {
  border-top: 1px solid #ccc;
}
.bor_bot {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin: 7px;
}
.df {
  display: flex;
  align-items: center;
}
</style>
