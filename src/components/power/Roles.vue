<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--添加角色-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <!--展开列-->
        <el-table-column type="expand"></el-table-column>

        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-tooltip class="item" effect="dark" content="设置用户权限" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  created() {
    this.getRolesList()
  },
  data() {
    return {
      rolesList:[]
    }
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$axios.get('roles')
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表数据失败');
      }
      this.rolesList = res.data;
    }
  }
}
</script>

<style scoped>

</style>