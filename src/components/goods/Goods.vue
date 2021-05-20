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
                    <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="goodsParams.query" @close="getGoodsLists">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsLists"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="7">
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                </el-col>
            </el-row>

            <!--table表格数据渲染-->
            <el-table :data="goodsList" stripe border style="width: 1200px;">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                <el-table-column prop="goods_number" label="商品数量" width="70px"></el-table-column>
                <el-table-column label="创建时间" width="120px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | timeDateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editGoods(scope.row.goods_id)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pageInation" background
                           :current-page="goodsParams.pagenum" :page-sizes="[1, 2, 5, 10]"
                           :page-size="goodsParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!--修改商品数据对话框-->
            <el-dialog title="修改商品" :visible.sync="editGoodsDialogVisible" width="50%" @close="editGoodsDialogReset">
                <el-form :model="editGoodsData" :rules="editGoodsDialogRules" ref="editGoodsDialogFormRef" label-width="140px">
                    <el-form-item label="商品名称">
                        <el-input v-model="editGoodsData.goods_name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="editGoodsData.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="editGoodsData.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="editGoodsData.goods_number"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
          </span>
            </el-dialog>
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
          total:0,
          editGoodsDialogVisible:false,
          editGoodsData:{},
          editGoodsDialogRules:{
              goods_name: [
                  { required: true, message:'请输入商品名称', trigger: 'blur'},
              ],
              goods_price: [
                  { required: true, message:'请输入商品价格', trigger: 'blur'},
              ],
              goods_weight: [
                  { required: true, message:'请输入商品重量', trigger: 'blur'},
              ],
              goods_number: [
                  { required: true, message:'请输入商品数量', trigger: 'blur'},
              ],
          }
    }
    },
     computed:{
     },
    methods:{
        //获取要被渲染成表格数据的商品列表数据
        async getGoodsLists() {
            const {data: res} = await this.$axios.get('goods', {params:this.goodsParams})
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品列表数据失败')
            }
            // this.$message.success('获取商品列表数据成功')
            this.goodsList = res.data.goods;
            this.total = res.data.total;
            console.log(this.goodsList)
        },
        //改变分页的每一页所渲染数据量所触发的函数
        handleSizeChange(newPageSize) {
            this.goodsParams.pagesize = newPageSize;
            this.getGoodsLists();
        },
        //分页的当前页改变触发的函数
        handleCurrentChange(newPageNum) {
            this.goodsParams.pagenum = newPageNum;
            this.getGoodsLists();
        },
        //添加商品
        addGoods() {
            this.$router.push('/goods/add')
        },
        //删除商品信息
        async deleteGoods(id) {
            //提示用户是否确认删除
            const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (result !== 'confirm') {
                return this.$message.info('取消删除商品')
            }
            const {data: res} = await this.$axios.delete('goods/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('删除商品失败')
            }
            this.$message.success('删除商品成功')
            await this.getGoodsLists();
        },
        //编辑商品信息，获取商品数据id
        async editGoods(id) {
            this.editGoodsDialogVisible = true;
            const {data: res} = await this.$axios.get('goods/' + id);
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品数据id失败')
            }
            this.editGoodsData = res.data;
            console.log(this.editGoodsData)
        },
        //编辑商品dialog关闭后重置表单
        editGoodsDialogReset() {
            this.$refs.editGoodsDialogFormRef.resetFields();
        },
        //确认已经修改的商品信息，并提交到数据库
        editGoodsInfo() {
            this.$refs.editGoodsDialogFormRef.validate(async valid => {
                if (!valid) return
                //预校验为真，发送数据到数据库
                const {data: res} = await this.$axios.put('goods/' + this.editGoodsData.id, {goods_name:this.editGoodsData.goods_name,
                    goods_price:this.editGoodsData.goods_price, goods_number:this.editGoodsData.goods_number, goods_weight:this.editGoodsData.goods_weight
                , })
                if (res.meta.status !== 200) {
                    return this.$message.error('发送到数据库失败')
                } else {
                    //关闭对话框
                    this.editGoodsDialogVisible = false;
                    //更新用户信息
                    await this.getGoodsLists()
                    //显示修改用户成功信息
                    this.$message.success('修改用户数据成功');
                }
            })
        }
    }
        }
</script>

<style scoped>
    .pageInation {
        margin: 15px;
    }
</style>
