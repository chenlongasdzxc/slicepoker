<template>
    <v-app>
        <v-toolbar fixed app clipped-left style="-webkit-app-region: drag">
            <v-toolbar-side-icon @click.native.stop="drawer = !drawer"
                                 style="-webkit-app-region: no-drag"></v-toolbar-side-icon>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <div style="-webkit-app-region: no-drag">
                <title-btn type="min"></title-btn>
                <title-btn type="max"></title-btn>
                <title-btn type="close"></title-btn>
            </div>

        </v-toolbar>
        <v-navigation-drawer
                clipped
                fixed
                v-model="drawer"
                app
        >
            <v-list>
                <v-list-tile
                        router
                        :to="item.to"
                        :key="i"
                        v-for="(item, i) in items"
                        exact
                >
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-content>

            <v-container fluid fill-height style="height: calc(100vh - 96px);overflow-y: auto">
                <v-slide-y-transition mode="out-in">
                    <router-view ></router-view>
                </v-slide-y-transition>
            </v-container>
        </v-content>
        <v-footer fixed app>
            <v-spacer></v-spacer>
            <span>&copy; 2018 四川新迎顺 提供技术支持</span>
        </v-footer>
    </v-app>
</template>

<script>
    import TitleBtn from "./../components/TitleBtn";

    export default {
        name: 'App',
        components: {TitleBtn},
        data: () => ({
            drawer: false,
            items: [
                {icon: 'build', title: '称重机配置', to: '/setting'},
                {icon: 'build', title: '回潮仪配置', to: '/rtu'},
                {icon: 'build', title: '打印机配置', to: '/printer'},
                {icon: 'memory', title: '生成管理', to: '/product'},
                // {icon: 'assessment', title: '数据查看', to: '/inspire'},
                {icon: 'bubble_chart', title: '关于', to: '/inspire'}
            ],
            title: '工控协同打印系统'
        })
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
    /* Global CSS */
</style>
