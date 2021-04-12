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
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUserFrom(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            <el-tooltip class="item" effect="dark" content="设置用户权限" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="userParams.pagenum" :page-sizes="[1, 2, 5, 10]"
            :page-size="userParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!--弹出添加用户对话框-->
        <el-dialog title="添加用户" :visible.sync="dialogVisible"
                   width="50%" @close="dialogFromReset" >
          <el-form :model="dialogFrom" :rules="dialogRules" ref="dialogFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="dialogFrom.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="dialogFrom.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="dialogFrom.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dialogFrom.phone"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>

        <!--弹出修改用户数据对话框-->
        <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="50%">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
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
    //验证邮箱规则
    let validateEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        //合法的邮箱
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }

    //验证手机号规则
    let validatePhone = (rule, value, callback) => {
      const regPhone = /^1[3456789]\d{9}$/

      if (regPhone.test(value)) {
        //合法的手机号
        return callback()
      }

      callback(new Error('请输入合法的手机号'))
     }
    return {
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList:[],
      total:0,
      dialogVisible:false,
      dialogFrom: {
        username:'',
        password:'',
        email:'',
        phone:''
      },
      dialogRules: {
        username: [
          { required: true, message:'请输入名字', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
        ],
        password: [
          { required: true, message:'请输入密码', trigger: 'blur'},
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur'}
        ],
        email: [
          { required: true, message:'请输入邮箱', trigger: 'blur'},
          { validator: validateEmail, trigger:'blur'}
        ],
        phone: [
          { required: true, message:'请输入手机号', trigger: 'blur'},
          { validator: validatePhone, trigger:'blur'}
        ],
      },
      editdialogVisible: false,
      editData:''
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
    //点击取消重置表单
    dialogFromReset() {
      this.$refs.dialogFormRef.resetFields();
    },
    //添加用户
    addUser() {
      this.$refs.dialogFormRef.validate(async valid => {
        if (!valid) return
        //发起网路请求
        const {data: res} = await this.$axios.post('users', this.dialogFrom );
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败');
        } else {
          this.$message.success('添加用户成功');
          this.getUserData();
        }
      })
    },
    async editUserFrom(id) {
          this.editdialogVisible = true;
          const {data: res} =await this.$axios.get('users/' + id);
          console.log(res);
          if (res.meta.status !== 200) {
            this.$message.error('请求用户id失败');
          } else {
            this.$message.success('请求用户id成功');
            this.editData = res.data
          }
    }
  }
}
</script>

<style scoped>

</style>
