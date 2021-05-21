<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片-->
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon>
            </el-alert>
        </el-card>

        <!--横向的步骤条-->
        <el-steps :space="200" :active="1" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <!--左侧的竖向tab选择-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFromRefs" label-width="100px" label-position="top">
            <el-tabs v-model="activeName" @tab-click="handleClick" :tab-position="tabPosition">
                <el-tab-pane label="基本信息" name="first">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-put v-model="addForm.goods_name"></el-put>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_name">
                        <el-put v-model="addForm.goods_price"></el-put>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_name">
                        <el-put v-model="addForm.goods_weight"></el-put>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_name">
                        <el-put v-model="addForm.goods_number"></el-put>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_name">
                        <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cascaderProps"
                                @change="handleChange"
                        ></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="second">商品参数</el-tab-pane>
                <el-tab-pane label="商品属性" name="third">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="fourth">商品图片</el-tab-pane>
                <el-tab-pane label="商品内容" name="fourth">商品内容</el-tab-pane>
            </el-tabs>
        </el-form>

    </div>
</template>

<script>
    export default {
        name: "User",
        created() {

        },
        data() {
            return {
                tabPosition: 'left',
                activeName:''
            }
        },
        methods: {
            //左侧的竖向tab选择所触发的函数
            handleClick() {

            }
        }
    }
</script>

<style scoped>

</style>
