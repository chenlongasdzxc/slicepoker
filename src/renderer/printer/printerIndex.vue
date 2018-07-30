<template>
   <div>
       <router-view></router-view>
   </div>
</template>
<script>
    const {ipcRenderer} = require('electron')

    export default {
        data() {
            return {
                printers: [],
                printerName:''
            }
        },
        mounted() {
            const that = this;
            this.init();
            this.printPage();
        }, methods: {
            init(){
                ipcRenderer.on('getPrinters-reply',this.getPrintersReply);
            },
            getPrinters() {
                ipcRenderer.send('getPrinters');
            },
            getPrintersReply(event, arg) {
                console.log(event);
                console.log(arg);
                this.printers = arg;
            },printPage(){
                // window.open('#/setting')
                // ipcRenderer.send('printPage',this.printerName);
                // setTimeout(()=>{window.close()},2000);
            }

        },
    }
</script>

<style scoped>

</style>
