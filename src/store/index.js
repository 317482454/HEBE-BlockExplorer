import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        epochBeginning:"",
        api:'http://39.104.107.100/nxt?',
        apiText:'HEBE'
    }
})
