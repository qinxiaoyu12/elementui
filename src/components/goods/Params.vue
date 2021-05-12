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
            <el-alert show-icon title="警告" type="warning" :closable="false"></el-alert>
            <!--选择商品分类-->
            <el-row class="chooseCate">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                            v-model="chooseSelectKeys"
                            :options="parentCateList" expand-trigger="hover"
                            :props="cateProps"
                            @change="parentCateChange">
                    </el-cascader>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "",
        data() {
            return {
                chooseSelectKeys:[],
                cateProps:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children',
                },
                parentCateList:[]
            }
        },
        methods: {
            //级联选择器选择发生变动所触发的函数
            async parentCateChange() {
                const {data: res} = await this.$axios.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取要被级联选择器渲染的数据失败')
                }
                this.$message.success('获取要被级联选择器渲染的数据成功')
                console.log(res);
                this.parentCateList = res.data;
            }
        }
    }
</script>

<style scoped>
    .chooseCate {
        margin: 15px 0;
    }
</style>
