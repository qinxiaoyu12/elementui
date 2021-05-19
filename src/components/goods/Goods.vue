<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片-->
        <el-card>
            <!--请输入内容-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="goodsParams.query">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="7">
                    <el-button type="primary" @click="dialogVisible=true">添加商品</el-button>
                </el-col>
            </el-row>

            <!--table表格数据渲染-->
            <el-table :data="goodsList" stripe border style="width: 1200px;">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        {{createTime}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click=""></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click=""></el-button>
                        <el-tooltip class="item" effect="dark" content="设置用户权限" placement="top" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting" @click=""></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="goodsParams.pagenum" :page-sizes="[1, 2, 5, 10]"
                           :page-size="goodsParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
 export default {
    name: "",
    created() {
        this.getGoodsLists()
    },
    data() {
      return {
          goodsParams:{
              query:'',
              pagenum:1,
              pagesize:5
          },
          goodsList:[],
          total:0
    }
    },
     computed:{
         createTime() {
             let c_time = this.goodsList.forEach(item => {
                 let tt = new Date(item.add_time * 1000);
                 let Y = tt.getFullYear() + '-';
                 let M = (tt.getMonth() + 1 < 10 ? '0' + (tt.getMonth() + 1) : tt.getMonth() + 1) + '-';
                 let D = tt.getDate() + ' ';
                 let h = tt.getHours() + ':';
                 let m = tt.getMinutes() + ':';
                 let s = tt.getSeconds();
                 let T = Y + M + D + h + m + s;
                 console.log(T);
             })
             console.log(c_time)
         },
     },
    methods:{
        //获取要被渲染成表格数据的商品列表数据
        async getGoodsLists() {
            const {data: res} = await this.$axios.get('goods', {params:this.goodsParams})
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品列表数据失败')
            }
            this.$message.success('获取商品列表数据成功')
            this.goodsList = res.data.goods;
            this.total = res.data.total;
            console.log(this.goodsList)
        },
        //改变分页的每一页所渲染数据量所触发的函数
        handleSizeChange() {

        },
        //分页的当前页改变触发的函数
        handleCurrentChange() {

        }
    }
        }
</script>

<style scoped>

</style>
