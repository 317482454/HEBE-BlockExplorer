// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';

import ElementUI from 'element-ui';
Vue.use(ElementUI);

import 'normalize.css';
import axios from 'axios'
import store from './store'
import gobal from "./gobal/config"
Vue.prototype.$g = gobal;//注册全局方法
import config from './axios/config'
Vue.prototype.$ajax = axios;//注册ajax
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
