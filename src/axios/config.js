import store from './../store/index'
import axios from 'axios'

axios.interceptors.request.use(function (config) {
        config.url=store.state.api+config.url+'&chain=1';
        return config;
  },
  function (error) {
    return Promise.reject(error);
  });//请求拦截器


axios.interceptors.response.use(response => {
  return response.data;
}, (responseError) => {
  return Promise.reject(responseError);
});//响应拦截器




