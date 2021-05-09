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
            <el-button type="primary">添加分类</el-button>
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
            ]
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
          }
      }
    }
</script>

<style scoped>
  .treeTable {
    margin-top: 15px;
  }
</style>
