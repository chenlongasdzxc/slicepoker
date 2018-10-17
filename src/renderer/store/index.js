import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import modules from './modules'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
Vue.use(Vuex)
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('datafmt',function (input,fmtstring) {
    // 使用momentjs这个日期格式化类库实现日期的格式化功能
    return moment(input).format(fmtstring);
});

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})
