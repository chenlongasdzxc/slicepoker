import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            name: 'app',
            path: '/app',
            component: require('@/pages/App').default,
        },
        {
            path: '*',
            redirect: '/app/'
        }
    ]
})
