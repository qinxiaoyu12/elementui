<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card>
      <!--警告区域-->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>

      <!--选择商品分类区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader ref="handleRef"
              v-model="selectCateKeys"
              :options="cateList"
              :props="props"
              @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <!--tab标签页-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--渲染tag标签-->
                <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable @close="deleteTag(i, scope.row)">
                  {{item}}
                </el-tag>
                <!--动态编辑标签-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                        ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数对话框-->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="paramsDialogReset">
      <!--添加参数的对话框表单-->
      <el-form :model="addForm" :rules="addRules" ref="addRuleFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>

    <!--添加参数对话框-->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editParamsDialogReset">
      <!--添加参数的对话框表单-->
      <el-form :model="editForm" :rules="editRules" ref="editRuleFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="SubmitParams">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "",
  created() {
    this.getCateList();
  },
    //选择级联选择框后下拉框自动收起
    watch: {
        selectCateKeys() {
            if (this.$refs.handleRef) {
                this.$refs.handleRef.dropDownVisible = false; //监听值发生变化就关闭它
            }
        }
    },
  data() {
    return {
      //商品分类列表
      cateList:[],
      props:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      selectCateKeys:[],
      //被激活的页签
      activeName:'many',
      manyTableData:[],
      onlyTableData:[],
      addDialogVisible:false,
      addForm:{
        attr_name:''
      },
      addRules:{
        attr_name: [
          { required: true, message:'请输入参数名称', trigger: 'blur'}
        ]
      },
      editDialogVisible: false,
      editForm:{},
      editRules:{
        attr_name: [
          { required: true, message:'请输入参数名称', trigger: 'blur'}
        ]
      },
    }
  },
  computed:{
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //获取当前选中的三级分类的id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const {data: res} = await this.$axios.get('categories');
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败');
      }
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    //级联选择框选择项变化，会触发这个函数
     handleChange() {
      // if (this.$refs.refHandle) return this.$refs.refHandle.dropDownVisible = false;
      this.getParamsList();
    },
    //tab页签点击处理函数
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsList();
    },
    //获取参数的列表数据
    async getParamsList() {
      //证明选中的不是三级分类
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        return
      }
      //证明选中的是三级分类
      // console.log(this.selectCateKeys);
      //根据所选分类的id和所选择的面板，获取对应的参数
      const {data: res} = await this.$axios.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败');
      }
      console.log(res.data)
      res.data.forEach(function (item) {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false;
        item.inputValue = '';
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //添加参数dialog表单关闭后重置数据
      paramsDialogReset() {
        this.$refs.addRuleFormRef.resetFields();
    },
    //编辑参数对话框关闭后表单重置
    editParamsDialogReset() {
      this.$refs.editRuleFormRef.resetFields();
    },
    //添加动态参数或者静态属性
    addParams() {
        //发起表单预校验
        this.$refs.addRuleFormRef.validate( async valid => {
            if (!valid) return
            const {data: res} = await this.$axios.post(`categories/${this.cateId}/attributes`, {attr_name:this.addForm.attr_name, attr_sel:this.activeName})
            if (res.meta.status !== 201) {
              return this.$message.error('添加动态参数或者静态属性失败')
            }
            // console.log(this.$message.success('添加动态参数或者静态属性成功'))
            this.addDialogVisible = false;
            await this.getParamsList();
        })
    },
    //编辑参数列表,根据ID查询参数
    async editParams(attrId) {
      this.editDialogVisible = true;
      const {data: res} = await this.$axios.get(`categories/${this.cateId}/attributes/` + attrId, {params: {attr_sel:this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('根据ID查询参数失败')
      }
      console.log(res.data)
      // console.log(this.$message.success('根据ID查询参数成功'));
      this.editForm = res.data;
    },
    //获取到参数后修改并提交到数据库
    SubmitParams() {
      this.$refs.editRuleFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$axios.put(`categories/${this.cateId}/attributes/` + this.editForm.attr_id, {attr_name:this.editForm.attr_name, attr_sel:this.activeName})
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取到参数后并提交到数据库失败')
        }
        this.editDialogVisible = false;
        await this.getParamsList();
      })
    },
    //删除选择的参数数据
    async deleteParams(id) {
      const result = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).catch(err => err)
      //如果result是confirm，那就是永久删除该参数
      if (result !== 'confirm') {
        return this.$message.info('取消删除参数')
      }
      else {
        const {data: res} = await this.$axios.delete(`categories/${this.cateId}/attributes/` + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除操作失败')
        }
        this.$message.success('删除商品分类成功');
        await this.getParamsList();
      }
    },
    //无论是按下enter还是blur离开input都会触发此函数
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = ''
        return
      }
      //如果没有return,则证明输入的内容需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = ''
      //保存添加的tag标签
     await this.saveTagData(row);
    },
    //保存tag标签
    async saveTagData(row) {
      //保存添加的tag标签
      const {data: res} = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {attr_name:row.attr_name, attr_sel:row.attr_sel, attr_vals:row.attr_vals.join(' ')})
      if (res.meta.status !== 200) {
        return this.$message.error('保存添加的tag标签失败')
      }
      this.$message.success('保存添加的tag标签成功')
    },
    //el-tag后的button触发按钮
    showInput(row) {
      row.inputVisible = true;
      //等页面渲染完之后获取input焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag标签
    deleteTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveTagData(row);
    }
  }
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
  .input-new-tag {
    width: 120px;
    margin: 5px;
  }
</style>
