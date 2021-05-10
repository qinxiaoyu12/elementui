<template>
   <!--面包屑-->
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

      <!--卡片-->
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" @click="addCateDialog">添加分类</el-button>
          </el-col>
        </el-row>

        <!--table表格-->
        <tree-table :data="cateList" :columns="columns" class="treeTable"
                    :selection-type="false" :expand-type="false"
                    show-index index-text="#" border :show-row-hover="false">
          <!--是否有效-->
          <template slot="likes" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
            <i class="el-icon-error" v-else style="color: red;"></i>
          </template>
          <!--商品排序-->
          <template slot-scope="scope" slot="order">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!--商品操作-->
          <template slot-scope="scope" slot="opt">
            <el-button type="primary" size="mini">修改</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </tree-table>
        <!--分页-->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="cateInfo.pagenum"
            :page-sizes="[1, 5, 10, 15]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
          <!--添加分类dialog-->
          <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
            <el-form :model="addCateFrom" :rules="addCateRules" label-width="100px" ref="addCateDialogRef">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateFrom.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <el-cascader
                            v-model="addCateValue" clearable class="parentCate"
                            :options="parentCateList"
                            :props="{ expandTrigger: 'hover' }"
                            @change="parentCateChange"></el-cascader>
                    </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategories">确 定</el-button>
          </span>
          </el-dialog>
      </el-card>
    </div>
</template>

<script>
    export default {
        name: "",
        created() {
          this.getGoodsList()
        },
      data() {
          return {
            cateList:[],
            cateInfo: {
              type: 3,
              pagenum: 1,
              pagesize:5
            },
            //总数据条数
            total:0,
            columns: [
              {
                label: '分类名称',
                prop: 'cat_name',
              },
              {
                label: '是否有效',
                prop: 'cat_deleted',
                type: 'template',
                template: 'likes'
              },
                //排序列模板
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                //操作模板
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
              addCateDialogVisible: false,
              addCateRules:{
                  cat_name: [
                      { required: true, message:'请输入分类名称', trigger: 'blur'},
                      { min: 1, max: 10, message: '长度在1到10个字符', trigger: 'blur'}
                  ],
              },
              addCateFrom:{
                  cat_name:'',
                  //父级分类的id
                  cat_pid:0,
                  //分类的等级默认添加为一级分类
                  cat_level:0
              },
              addCateValue:[],
              parentCateDegree:{
                type: 2
              },
              //父级分类列表
              parentCateList:[],
              props: {
                value:'cat_id',
                label:'cat_name',
                children:'children'
              }
          }
        },
      methods:{
          //获取要渲染成表格的商品数据
        async getGoodsList() {
          const {data: res} = await this.$axios.get('categories', {params: this.cateInfo})
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类数据失败!')
          }
          this.cateList = res.data.result;
          this.total = res.data.total;
        },
          //当前每页显示条数
          handleSizeChange(newPageSize) {
            this.cateInfo.pagesize = newPageSize;
            this.getGoodsList();
          },
          //当前页数修改
          handleCurrentChange(newPageNum) {
            this.cateInfo.pagenum = newPageNum;
            this.getGoodsList();
          },
          //添加分类
          addCateDialog() {
              this.getParentCateList();
              this.addCateDialogVisible = true;
          },
          //确定添加分类
          addCategories() {

          },
          //父级分类级联选择器
          parentCateChange() {

          },
          //获取父级分类数据
          async getParentCateList() {
                const {data: res} = await this.$axios.get('categories', {params: this.parentCateDegree})
                console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级分类数据列表失败')
                }
                this.parentCateList = res.data;
          }
      }
    }
</script>

<style scoped>
  .treeTable {
    margin-top: 15px;
  }
  .parentCate {
      width: 100%;
  }
</style>
