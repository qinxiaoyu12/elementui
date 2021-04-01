<template>
    <el-container class="home_container">
      <el-header class="home_header">
        <el-button type="info" @click="logOut">退出</el-button>
        Header
      </el-header>
      <el-container class="home_body">
          <el-aside width="200px" class="home_aside">Aside</el-aside>
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
  .home_header {
    background-color: #363D40;
  }

  .home_aside {
    background-color: #313743;
  }

  .home_main {
    background-color: #EAEDF1;
  }

  .home_container {
    height: 100%;
  }
</style>
