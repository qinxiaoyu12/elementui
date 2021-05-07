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
      </el-card>

      <!--table表格-->
      <tree-table :data="cateList" :columns="columns"
                  :selection-type="false" :expand-type="false"
                  show-index index-text="#" border :show-row-hover="false">
        <template slot="likes" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
      </tree-table>

      <!--分页-->

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
        }
      }
    }
</script>

<style scoped>

</style>
