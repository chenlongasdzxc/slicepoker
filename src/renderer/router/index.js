import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            name: 'app',
            path: '/app',
            component: require('@/pages/App').default,
            children: [
                {
                    path: '/',
                    name: 'test',
                    component: require('@/components/InspireView').default
                },
                {
                    path: '/inspire',
                    name: 'inspire',
                    component: require('@/components/InspireView').default
                },
                {
                    path: '/product',
                    name: 'product',
                    component: require('@/pages/ProductionPage').default
                },
                {
                    path: '/setting',
                    name: 'setting',
                    component: require('@/pages/SettingPage').default
                },
                {
                    path: '/printer',
                    name: 'printer',
                    component: require('@/pages/PrinterSetting').default
                },{
                    path: '/rtu',
                    name: 'rtu',
                    component: require('@/pages/RtuSetting').default
                },
            ]
        },
        {
            path:'/printer',
            name:'printer',
            component: require('@/printer/printerIndex').default,
            children:[
                {
                    path:'p1',
                    name:'p1',
                    component: require('@/printer/printer1').default,
                },  {
                    path:'p2',
                    name:'p2',
                    component: require('@/printer/printer2').default,
                }, {
                    path:'p3',
                    name:'p3',
                    component: require('@/printer/printer3').default,
                }
            ]
        },
        {
            path: '*',
            redirect: '/app/'
        }
    ]
})
