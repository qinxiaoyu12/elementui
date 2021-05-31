<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="ordersParams.query" @close="getOrdersLists">
                        <el-button slot="append" icon="el-icon-search" @click="getOrdersLists"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!--table表格数据渲染-->
            <el-table :data="ordersList" stripe border style="width: 1200px;">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="order_number" label="订单号" width="200px"></el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="200px"></el-table-column>
            <el-table-column prop="order_pay" label="是否付款" width="200px">
              <template slot-scope="scope">
                <el-tag type="danger" effect="light" v-if="scope.row.order_pay !== 1">未付款</el-tag>
                <el-tag type="danger" effect="light" v-else>付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="200px"></el-table-column>
            <el-table-column label="下单时间" width="180px">
                <template slot-scope="scope">
                    {{scope.row.create_time | timeDateFilter}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editAddress(scope.row.goods_id)"></el-button>
                    <el-button type="success" size="mini" icon="el-icon-location" @click="ordersStatus(scope.row.goods_id)"></el-button>
                </template>
            </el-table-column>
            </el-table>

          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pageInation" background
                         :current-page="ordersParams.pagenum" :page-sizes="[1, 2, 5, 10]"
                         :page-size="ordersParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "",
        created() {
            this.getOrdersLists()
        },
        data() {
            return {
                ordersParams:{
                    query:'',
                    pagenum: 1,
                    pagesize:5
                },
                ordersList:[],
                total:''
            }
        },
        methods: {
            //获取order组件的列表数据
            async getOrdersLists() {
                const {data: res} = await this.$axios.get('orders', {params: this.ordersParams})
                if (res.meta.status !== 200) {
                    return this.$message.error('获取orders列表数据请求失败')
                }
                // this.$message.success('获取orders列表数据请求成功')
                this.ordersList = res.data.goods;
                this.total = res.data.total;
                console.log(this.ordersList)
            },
          //修改地址
          editAddress() {

          },
          //查看订单物流状态
          ordersStatus() {

          },
          //每一页的数据多少触发的函数
          handleSizeChange(newSize) {
            this.ordersParams.pagesize = newSize;
            this.getOrdersLists();
          },
          //分页当前页改变触发的函数
          handleCurrentChange(newPage) {
            this.ordersParams.pagenum = newPage;
            this.getOrdersLists();
          }
        }
    }
</script>

<style scoped>
  .pageInation {
    margin-top: 15px;
  }
</style>
