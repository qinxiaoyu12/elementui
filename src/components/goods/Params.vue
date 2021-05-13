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
                <el-tab-pane label="静态属性" name="second">
                    <el-button type="primary" size="only" :disabled="isDisabled">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>
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
                const {data: res} = await this.$axios.get(`categories/${this.getCateId}/attributes`, {params: this.activeName})
                console.log(res);
            }
        }
    }
</script>

<style scoped>
    .chooseCate {
        margin: 15px 0;
    }

</style>
