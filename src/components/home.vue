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
      <el-aside :width="activeCollapse ? '64px' : '200px'" class="home_aside">
        <div class="toggle" @click="toggleCollapse">|||</div>
        <el-menu background-color="#313743" text-color="#fff" class="home_menu"
                 active-text-color="#409EFF" :unique-opened="true"
                 :collapse="activeCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id + ''" v-for="item in leftMenuList" :key="item.id">
            <template slot="title">
              <i :class="elIcon[item.id]" style="margin-right: 10px;"></i>
              <span>{{item.authName}}</span>
            </template>
              <el-menu-item :index="'/' + menuItem.path"  v-for="menuItem in item.children"
                            :key="menuItem.id" @click="changeHighLight('/' + menuItem.path)">
                <i class="el-icon-menu"></i>
                <span slot="title">{{menuItem.authName}}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main class="home_main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      leftMenuList:[],
      activeName:'',
      activeCollapse:false,
      activePath:'',
      elIcon: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-3702mima',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    //得到home界面左侧的菜单列表数据
    async getMenuList() {
      //get请求返回的是一个Promise类型 需要加async和await使函数更好进行
      const {data: res} = await this.$axios.get('menus');
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.leftMenuList = res.data;
      // console.log(this.leftMenuList);
    },
    toggleCollapse() {
      this.activeCollapse = !this.activeCollapse;
    },
    changeHighLight(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
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

  .home_menu {
    border-right: none;
  }

  .toggle {
    background-color: #4A5064;
    color: #ffffff;
    letter-spacing: 0.2em;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    cursor: pointer;
  }
</style>
