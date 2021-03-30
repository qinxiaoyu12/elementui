<template>
  <div class="home">
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
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

</style>