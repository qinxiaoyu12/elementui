module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    //路由懒加载babel配置
    '@babel/plugin-syntax-dynamic-import'
  ]
}
