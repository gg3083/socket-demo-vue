import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import './styles/common.css' // A modern alternative to CSS resets

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})
