<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ slot1 }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ slot2 }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  props: ['slot1', 'slot2']
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
