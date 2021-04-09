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
            <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="userParams.query" @clear="getUserData">
              <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
            </el-input>
          </el-col>
          <el-col :span="7">
            <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
          </el-col>
        </el-row>
      <!--table表格数据渲染-->
        <el-table :data="userList" stripe border style="width: 1200px;">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="getStateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            <el-tooltip class="item" effect="dark" content="设置用户权限" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="userParams.pagenum" :page-sizes="[1, 2, 5, 10]"
            :page-size="userParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!--弹出添加用户对话框-->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible=false">确 定</el-button>
          </span>
        </el-dialog>
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
      total:0,
      dialogVisible:false
    }
  },
  methods: {
    //获取管理员数据列表
    async getUserData() {
        const {data: res} = await this.$axios.get('users', {params: this.userParams})
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取管理员列表失败');
        }
        this.userList = res.data.users;
        console.log(this.userList)
        this.total = res.data.total;
    },
    handleSizeChange(newSize) {
        this.userParams.pagesize = newSize
        this.getUserData()
    },
    handleCurrentChange(newPage) {
        this.userParams.pagenum = newPage
        this.getUserData()
    },
    async getStateChange(newStateInfo) {
      console.log(newStateInfo)
      const {data: res}= await this.$axios.put(`users/${newStateInfo.id}/state/${newStateInfo.mg_state}`)
      console.log(res);
      if (res.meta.status !== 200) {
        newStateInfo.mg_state = !newStateInfo.mg_state
        return this.$message.error('更新状态失败');
      } else {
        this.$message.success('更新状态成功');
      }
    },
  }
}
</script>

<style scoped>

</style>
