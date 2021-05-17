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
          <el-cascader
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
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--添加参数对话框-->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addFormReSet">
      <!--添加参数的对话框表单-->
      <el-form :model="addForm" :rules="addRules" ref="addRuleFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
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

      }
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
      console.log(this.selectCateKeys);
      //根据所选分类的id和所选择的面板，获取对应的参数
      const {data: res} = await this.$axios.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败');
      }
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    addFormReSet() {
      this.$refs.addRuleFormRef.resetFields();
    }
  }
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
</style>