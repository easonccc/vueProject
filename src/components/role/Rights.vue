<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb slot1="权限管理" slot2="权限列表"></breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe ref="rightsListRef">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取到的列表数据
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('请求数据失败')
      this.rightsList = res.data
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>
<style lang="less" scoped></style>
