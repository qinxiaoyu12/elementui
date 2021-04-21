<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <el-table :data="powerList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else="scope.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  created() {
    this.getPowerList()
  },
  data() {
    return {
      powerList:[]
    }
  },
  methods: {
    async getPowerList() {
      const {data:res} = await this.$axios.get('rights/list')
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据列表失败')
      }
        // this.$message.success('获取权限数据列表成功')
        this.powerList = res.data
    }
  }
}
</script>

<style scoped>

</style>