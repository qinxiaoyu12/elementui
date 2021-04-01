<template>
  <el-container class="home">
    <!--头部区域-->
    <el-header class="home_header">
      <div class="header_left">
        <img src="../assets/img/logo.svg" alt="">
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px" class="home_aside">
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#313743"
            text-color="#fff"
            >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main class="home_main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
 .home {
  height: 100%;
 }
  .home_header {
    background-color: #363D40;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
  }
  
  .home_aside {
    background-color: #313743;
  }
  
  .home_main {
    background-color: #eaedf1
  }

  .header_left img {
    height: 60px;
    width: 60px;
    border-radius: 100%;
  }

  .header_left span {
    color: #ffffff;
    font-size: 20px;
    margin-left: 15px;
  }

  .header_left {
    display: flex;
    align-items: center;
  }
</style>