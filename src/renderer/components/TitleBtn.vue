<template>
    <v-btn icon @click.navite="click">
        <v-icon dark>{{style.icon}}</v-icon>
    </v-btn>
</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    const style = {
        min: {
            backgroundColor: 'green',
            right: '100px',
            icon: 'minimize'
        },
        max: {
            backgroundColor: 'yellow',
            right: '60px',
            icon: 'crop_free'
        },
        close: {
            backgroundColor: 'black',
            right: '20px',
            icon: 'close'
        }
    };
    export default {
        name: 'TitleBtn',
        props: ['type'],
        computed: {
            style: function () {
                return style[this.type];
            }
        },
        methods: {
            click: function () {
                ipc.send(this.type);
            }
        }
    }
</script>

<style>
    .titleBtn {
        position: absolute;
        width: 20px;
        height: 20px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        -webkit-app-region: no-drag;
    }
</style>