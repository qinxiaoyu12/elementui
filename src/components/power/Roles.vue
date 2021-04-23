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
          <el-button type="primary" @click="dialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdBottom', 'vcenter', i1 === 0 ? 'bdTop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!--一级权限-->
              <el-col :span="5" class="firstRights">
                <el-tag closable @close="deleteTagById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级权限和三级权限-->
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? '' : 'bdTop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteTagById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                        <el-tag closable type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                                @close="deleteTagById(scope.row, item3.id)">
                          {{item3.authName}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-tooltip class="item" effect="dark" content="设置用户权限" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="settingRights">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--弹出添加角色dialog-->
    <el-dialog title="添加角色" :visible.sync="dialogVisible"
               width="50%" @close="rolesDialogReset">
      <el-form :model="dialogRolesFrom" :rules="dialogRolesRules" ref="dialogRolesFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dialogRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="dialogRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!--弹出修改角色dialog-->
    <el-dialog title="修改角色" :visible.sync="editRolesDialogVisible" width="40%" @close="editRolesDialogReset">
      <el-form :model="editRolesData" :rules="editRolesDialogRules" ref="editRolesDialogFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesData.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限dialog-->
    <el-dialog title="分配权限" :visible.sync="settingRightsDialogVisible" width="40%">
      <el-tree :data="settingRightsData" :props="defaultProps" show-checkbox default-expand-all default-expanded-keys="[]"></el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
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
      rolesList:[],
      dialogVisible: false,
      dialogRolesFrom:{
        roleName:'',
        roleDesc:''
      },
      dialogRolesRules:{
        roleName: [
          { required: true, message:'请输入角色名称', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
        ],
        roleDesc: [
          { required: true, message:'请输入角色描述', trigger: 'blur'},
          { min: 3, max: 25, message: '长度在3到25个字符', trigger: 'blur'}
        ]
      },
      editRolesData:{},
      editRolesDialogVisible: false,
      editRolesDialogRules:{
        roleName: [
          { required: true, message:'请输入角色名称', trigger: 'blur'},
          { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur'}
        ],
        roleDesc: [
          { required: true, message:'请输入角色描述', trigger: 'blur'},
          { min: 1, max: 25, message: '长度在1到25个字符', trigger: 'blur'}
        ]
      },
      settingRightsDialogVisible: false,
      settingRightsData:[],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$axios.get('roles')
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表数据失败');
      }
      this.rolesList = res.data;
    },
    //弹框关闭，重置全部的表单
    rolesDialogReset() {
      this.$refs.dialogRolesFormRef.resetFields()
    },
    //添加角色
    addRoles() {
      //表单预校验
      this.$refs.dialogRolesFormRef.validate( async valid => {
        if (!valid) return
        //预校验为真，发送数据到数据库
        const {data: res} = await this.$axios.post('roles', this.dialogRolesFrom);
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error('添加角色数据失败');
        } else {
          //关闭对话框
          this.dialogVisible = false;
          //更新rolesList
          await this.getRolesList()
        }
      })
    },
    //根据角色id查询角色信息
    async editRoles(id) {
      this.editRolesDialogVisible = true;
        const {data: res} = await this.$axios.get('roles/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('根据角色id角色信息失败')
        }
        this.editRolesData = res.data;
        console.log(this.editRolesData)
    },
    //dialog消失重置所有的表单
    editRolesDialogReset() {
      this.$refs.editRolesDialogFormRef.resetFields();
    },
    //修改角色信息并提交到数据库
    editRolesInfo() {
        //表单预校验
      this.$refs.editRolesDialogFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$axios.put('roles/' + this.editRolesData.roleId, {roleName: this.editRolesData.roleName, roleDesc: this.editRolesData.roleDesc});
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('修改角色信息并提交到数据库失败');
        }
        this.editRolesDialogVisible = false;
        await this.getRolesList()
      })
    },
    //删除角色
    async deleteRoles(id) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      //如果result是confrim那就是继续，否则就是取消
      if (result !== 'confirm') {
        this.$message.error('取消删除该角色');
      } else {
        const {data: res} =await this.$axios.delete('roles/' + id);
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('删除角色失败');
        }
        this.editRolesDialogVisible = false;
        await this.getRolesList();
      }
    },
    //关闭权限tag标签
    async deleteTagById(role, rightId) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (result !== 'confirm') {
        return this.$message.error('取消删除该权限')
      }
      const {data: res} = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败')
      }
      console.log(this.$message.success('删除权限成功'))
      role.children = res.data;
    },
    //分配权限
    async settingRights() {
      this.settingRightsDialogVisible = true;
      const {data: res} = await this.$axios.get('rights/tree')
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取树形权限数据失败')
      }
      // console.log(this.$message.success('获取树形权限数据成功'));
      this.settingRightsData = res.data;
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .bdTop {
    border-top: 1px solid #eee;
  }
  .bdBottom {
   border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
