<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片-->
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="true">
            </el-alert>

          <!--横向的步骤条-->
          <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>

          <!--左侧的竖向tab选择-->
          <el-form :model="addForm" :rules="addFormRules" ref="addFromRefs" label-width="100px" label-position="top">
            <el-tabs v-model="activeIndex" @tab-click="handleClick" :tab-position="tabPosition" :before-leave="beforeLeave">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input type="number" v-model="addForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input type="number" v-model="addForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input type="number" v-model="addForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader v-model="addForm.goods_cat" :options="cateList" clearable
                               :props="Props" @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                  <el-form-item :label="item.attr_name" v-for="item in goodsParams" :key="item.attr_id">
                    <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox :label="cb" border v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                  <el-form-item :label="item.attr_name" v-for="item in onlyGoodsData" :key="item.attr_id">
                      <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                  <el-upload :action="uploadUrl" :on-success="uploadSuccess" :on-remove="removePic"
                          :on-preview="handlePreview"
                          list-type="picture" :headers="headersObj">
                      <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                  <!--富文本编辑器-->
                  <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                  <el-button type="primary" @click="addGoodsBtn" class="btnAdd">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>

        <!--预览图片的dialog-->
        <el-dialog title="预览图片" :visible.sync="previewDialogVisible" width="50%">
            <img src="picPreviewPath" alt="" class="previewPic">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "User",
        created() {
          this.getCateList();
        },
        data() {
            return {
                tabPosition: 'left',
                activeName:'',
                activeIndex:'0',
                addForm:{
                  goods_name: '',
                  goods_price: 0,
                  goods_weight: 0,
                  goods_number:0,
                  goods_cat:[],
                  pics:[],
                  goods_introduce:'',
                  attrs:[]
                },
                addFormRules:{
                  goods_name: [
                    { required: true, message:'请输入商品名称', trigger:'blur'},
                  ],
                  goods_price: [
                    { required: true, message:'请输入商品价格', trigger:'blur'},
                  ],
                  goods_weight: [
                    { required: true, message:'请输入商品重量', trigger:'blur'},
                  ],
                  goods_number: [
                    { required: true, message:'请输入商品数量', trigger:'blur'},
                  ],
                  goods_cat: [
                    { required: true, message:'请选择商品分类', trigger:'blur'},
                  ]
                },
              cateList:[],
              Props:{
                  label:'cat_name',
                  value:'cat_id',
                  children:'children',
                  expandTrigger: 'hover'
              },
              goodsParams:[],
              onlyGoodsData:[],
              uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
              headersObj:{
                  Authorization : window.sessionStorage.getItem('token')
              },
              previewDialogVisible:false,
              picPreviewPath:''
            }
        },
      computed:{
        cateId() {
          if (this.addForm.goods_cat.length === 3) {
            return this.addForm.goods_cat[2];
          }
          return null;
        }
      },
        methods: {
            //左侧的竖向tab选择所触发的函数
            async handleClick() {
                //如果选中的tab标签页是商品参数这一页就获取商品参数列表数据
                if (this.activeIndex === '1') {
                    const {data: res} = await this.$axios.get(`categories/${this.cateId}/attributes`, {params:{sel:'many'}})
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取商品动态参数列表数据失败')
                    }
                    res.data.forEach(item => {
                      item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                      // console.log(item.attr_vals)
                    })
                    this.goodsParams = res.data;
                    console.log(this.goodsParams);
                } else if (this.activeIndex === '2') {
                  const {data: res} = await this.$axios.get(`categories/${this.cateId}/attributes`, {params:{sel:'only'}})
                  if (res.meta.status !== 200) {
                    return this.$message.error('获取商品静态属性列表数据失败')
                  }
                  this.onlyGoodsData = res.data;
                  console.log(this.onlyGoodsData);
                }
            },
          //页面也渲染就获取级联选择框的分类数据
          async getCateList() {
              const {data: res} = await this.$axios.get('categories')
              if (res.meta.status !== 200) {
                return this.$message.error('获取分类数据失败')
              }
              this.cateList = res.data;
              // console.log(this.cateList);
          },
          //级联选择器分类发生改变是所触发的函数
          handleChange() {
              if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
              }

          },
          //tab标签切换前后的activeIndex
          beforeLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
              this.$message.error('请先选择商品分类');
              return false
            }
          },
          //图片预览触发函数
          handlePreview(file) {
              this.picPreviewPath = file.data.url;
              this.previewDialogVisible = true;
          },
          //监听图片上传成功触发的函数
          uploadSuccess(response) {
              // console.log(response);
              const pic = { pic:response.data.tmp_path }
              this.addForm.pics.push(pic);
              // console.log(this.addForm)
          },
          //删除图片触发事件
          removePic(file) {
              //1.获取将要删除图片的临时路径
              const picTemPath = file.response.data.tmp_path;
              //2.在pics数组中，找到对应图片的索引值
              const i = this.addForm.pics.findIndex(x => x.pic === picTemPath)
              //3.调用splice方法，移除图片信息
              this.addForm.pics.splice(i, 1);
          },
          //添加商品btn
          addGoodsBtn() {
            //表单预校验
            this.$refs.addFromRefs.validate(valid => {
              if (!valid) return this.$message.error('请填写必要的表单项！')
              //执行添加的业务逻辑
              //深拷贝loadash
              const form = _.cloneDeep(this.addForm)
              form.goods_cat = form.goods_cat.join(',')
              console.log(form);
              //attrs数据处理
              this.goodsParams.forEach(item => {
                // item.
              })

            })
          }
        }
    }
</script>

<style scoped>
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewPic {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>
