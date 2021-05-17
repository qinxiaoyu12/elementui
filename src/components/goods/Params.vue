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
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-card>
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
                activeName:'many'
            }
        },
        computed:{
            isBtnDisabled() {
                if (this.selectCateKeys.length !== 3) {
                    return true;
                }
                return false;
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
               //证明选中的不是三级分类
                if (this.selectCateKeys.length !== 3) {
                    this.selectCateKeys = [];
                    return
                }
                //证明选中的是三级分类
                console.log(this.selectCateKeys);
            },
            //tab页签点击处理函数
            handleTabClick() {
                console.log(this.activeName);
            }
        }
    }
</script>

<style scoped>
    .cat_opt {
        margin: 15px 0;
    }
</style>
