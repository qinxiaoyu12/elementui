<template>
    <div class="login">
      <!--头像区域-->
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/img/logo.png">
            </div>
          <!--登录表单区域-->
          <el-form class="login_from" :model="loginFrom" :rules="loginFormRules" ref="loginFormReset">
            <!--用户名-->
            <el-form-item prop="username">
              <el-input  prefix-icon="iconfont icon-user" v-model="loginFrom.username"></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item prop="password">
              <el-input  prefix-icon="iconfont icon-3702mima" v-model="loginFrom.password" type="password"></el-input>
            </el-form-item>
            <!--按钮区域-->
            <el-form-item class="button">
              <el-button type="primary" @click="loginCheck">登录</el-button>
              <el-button type="info" @click="resetFrom">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
    import router from "@/router";

    export default {
        name: "Login",
        data() {
            return {
                loginFrom:{
                    username:'admin',
                    password:'123456'
                },
                loginFormRules:{
                    username: [
                        { required: true, message:'请输入名字', trigger: 'blur'},
                        { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
                    ],
                    password: [
                        { required: true, message:'请输入登录密码', trigger: 'blur'},
                        { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetFrom() {
                this.$refs.loginFormReset.resetFields();
            },
            loginCheck() {
                this.$refs.loginFormReset.validate(async valid => {
                    // console.log(valid);
                  if(!valid) return;
                  const { data: res } = await this.$axios.post('login', this.loginFrom);
                  // console.log(res);
                  if(res.meta.status !== 200) return this.$message.error('登录失败')
                  this.$message.success('登录成功');
                  //保存token到sessionStorage
                  window.sessionStorage.setItem('token', res.data.token);
                  //登录并跳转到home界面
                  await this.$router.push('/home');
                });
            }
        }
    }
</script>

<style scoped>
    .login {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        background-color: #fff;
        width: 450px;
        height: 300px;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

   .avatar_box {
       height: 130px;
       width: 130px;
       border: solid 1px #eeeeee;
       border-radius: 50%;
       padding: 10px;
       box-shadow: 0 0 10px #dddddd;
       position: absolute;
       left: 50%;
       transform: translate(-50%, -50%);
       background-color: #ffffff;
   }

    .avatar_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
    }

    .button {
      display: flex;
      justify-content: flex-end;
    }

    .login_from {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
</style>
