<template>
    <!--面包屑-->
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片-->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="7">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
export default {
  name: "User",
  created() {
    this.getUserData();
  },
  data() {
    return {
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList:[],
      total:null
    }
  },
  methods: {
    async getUserData() {
        const {data: res} = await this.$axios.get('users', {params: this.userParams})
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取管理员列表失败');
        }
        this.userList = res.data.users;
        this.total = res.data.total;
    }
  }
}
</script>

<style scoped>

</style>
