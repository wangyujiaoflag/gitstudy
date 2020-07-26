import Vue from 'vue';
import App from './App.vue';
//route
import router from './routes/router';

//富文本框
import  quillEditor from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
Vue.use(quillEditor);

//token
import savetoken from './assets/js/token';
Vue.prototype.$savetoken=savetoken;

import xss from 'xss';
Object.defineProperty(Vue.prototype, '$xss', {
  value: xss
});

//axios
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:6377/'; // 填写后台请求统一的地址

//请求拦截器
axios.interceptors.request.use(function (conf) {
  const token = savetoken.getCookie('my_token');
  if (token) conf.headers['token'] = `${token}`;
  return conf;
});
Vue.prototype.$axios=axios;

//elementui
import elementui from 'element-ui';
Vue.use(elementui);
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
