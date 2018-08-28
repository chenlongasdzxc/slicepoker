<template>
    <v-card>
        <v-card-title>物理设备状态</v-card-title>
        <v-divider></v-divider>
        <v-container>
            <v-layout wrap column>
                <v-flex v-for="item in drivers" :key="item.name">
                    <v-card>
                        <v-card-title><h4>{{ item.name }}</h4></v-card-title>
                        <v-divider></v-divider>
                        <v-list dense>
                            <v-list-tile>
                                <v-list-tile-content>状态:</v-list-tile-content>
                                <v-list-tile-content v-if="item.hasBeenSet" class="align-end">已经配置
                                </v-list-tile-content>
                                <v-list-tile-content v-if="!item.hasBeenSet" class="align-end">没有配置
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-if="item.hasBeenSet && item.name==='打印机'">
                                <v-list-tile-content>设备名称:</v-list-tile-content>
                                <v-list-tile-content v-if="item.hasBeenSet" class="align-end">
                                    {{item.data.name}}
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-if="item.hasBeenSet && item.name!=='打印机'">
                                <v-list-tile-content>连接端口:</v-list-tile-content>
                                <v-list-tile-content v-if="item.hasBeenSet" class="align-end">
                                    {{item.data.com}}
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
    export default {
        name: 'DeviceStatus',
        props: {
            drivers: {}
        }
    }
</script>
