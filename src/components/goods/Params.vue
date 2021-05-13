<template>

    <!--面包屑-->
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片-->
        <el-card>
            <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
            <!--选择商品分类-->
            <el-row class="chooseCate">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                            v-model="chooseSelectKeys" clearable
                            :options="parentCateList" expand-trigger="hover"
                            :props="cateProps"
                            @change="parentCateChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!--动态属性和静态属性-->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isDisabled">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>

            <!--动态参数显示表格-->

            <el-table :data="dynamicParams" stripe border style="width: 1200px;" v-if="activeName='many'">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDynamicParams(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDynamicParams(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--静态属性显示表格-->
            <el-table :data="staticAttribute" stripe border style="width: 1200px;" v-else>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editStaticAttribute(scope.row.attr_id)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteStaticAttribute(scope.row.attr_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "",
        created() {
            this.getCateDateList();
        },
        data() {
            return {
                chooseSelectKeys:[],
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children',
                    checkStrictly: true
                },
                parentCateList:[],
                activeName:'many',
                disabled:false,
                dynamicParams:[],
                staticAttribute:[]
            }
        },
        computed:{
          isDisabled() {
              if (this.chooseSelectKeys.length !== 3) {
                  return true
              }
              else {
                  return false
              }
          },
          getCateId() {
              if (this.chooseSelectKeys.length == 3) {
                  return this.chooseSelectKeys[2]
              }
              return null;
          }
        },
        methods: {
            //级联选择器选择发生变动所触发的函数
            parentCateChange() {
                console.log(this.chooseSelectKeys);
                if (this.chooseSelectKeys.length !==3) {
                    this.chooseSelectKeys = []
                    return
                }
                else {

                }
            },
            //获取级联选择器所要渲染的父级商品数据
            async getCateDateList() {
                const {data: res} = await this.$axios.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取要被级联选择器渲染的数据失败')
                }
                this.$message.success('获取要被级联选择器渲染的数据成功')
                console.log(res);
                this.parentCateList = res.data;
            },
            //tab标签页切换触发函数
            async handleClick() {
                const {data: res} = await this.$axios.get(`categories/${this.getCateId}/attributes`, {params: {sel: this.activeName}})
                console.log(res);
                console.log(this.activeName);
                if (res.meta.status !== 200) {
                    return this.$message.error('获取参数列表失败')
                }
                console.log(this.$message.success('获取参数列表成功'))
                if (this.activeName = "many") {
                    //获取到动态参数的数据列表
                    this.dynamicParams = res.data;
                }
                    //获取到静态属性的数据列表
                    this.staticAttribute = res.data;
            },
            //dynamicParams编辑功能
            editDynamicParams() {

            },
            //dynamicParams删除功能
            async deleteDynamicParams() {
                const result = await this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).catch(err => err)
                if (result !== 'confirm') {
                    return this.$message.info('取消删除dynamicParams表格中的数据')
                }
                else {
                    const {data: res} = await this.$axios.delete(`categories/${this.getCateId}/attributes/${this.dynamicParams.attr_id}`)
                    console.log(res);
                }
            },
            //staticAttribute编辑功能
            editStaticAttribute() {

            },
            //staticAttribute删除功能
            async deleteStaticAttribute() {
                const result = await this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:'warning'
                }).catch(err => err)
                if (result !== 'confirm') {
                    return this.$message.info('取消删除dynamicParams表格中的数据')
                } else {
                    const {data: res} = await this.$axios.delete(`categories/${this.getCateId}/attributes/${this.staticAttribute.attr_id}`)
                }
            }
        }
    }
</script>

<style scoped>
    .chooseCate {
        margin: 15px 0;
    }

</style>
