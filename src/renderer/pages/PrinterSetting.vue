<template>
    <v-container grid-list-md>
        <v-layout align-space-around justify-space-around row fill-height>
            <v-flex>
                <v-card>
                    <v-card-title class="headline">
                        参数配置
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-layout row wrap class="pa-3">
                        <v-flex md12 lg6 class="item">
                            <v-select
                                    v-model="printerName"
                                    :items="printers"
                                    item-text="name"
                                    item-value="name"
                                    label="打印机设备"
                            ></v-select>
                        </v-flex>
                        <v-flex md12 lg6 class="item">
                            <v-select
                                    v-model="printerTemplate"
                                    :items="printerTemplates"
                                    item-text="name"
                                    item-value="path"
                                    label="打印模板"
                            ></v-select>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="pa-3">
                        <v-flex class="item">
                           <v-btn color="yellow" @click.native="printPage(true)" :disabled="printerTemplate===''">模板预览</v-btn>
                           <v-btn color="yellow" @click.native="printPage(false)" :disabled="printerName===''||printerTemplate===''">打印测试</v-btn>
                           <v-btn color="blue" @click.native="save" :disabled="printerName===''||printerTemplate===''">保存配置</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>


</template>
<script>
    const {ipcRenderer} = require('electron')

    export default {
        data() {
            return {
                printers: [],
                printerTemplates:[
                    {name:'模板一',path:'/printer/p1'},
                    {name:'模板二',path:'/printer/p2'},
                    {name:'模板三',path:'/printer/p3'},
                    {name:'模板四',path:'/printer/p4'},
                    {name:'模板五',path:'/printer/p5'},
                    {name:'模板六',path:'/printer/p6'},
                    {name:'模板七',path:'/printer/p7'},
                ],
                printerName:'',
                printerTemplate:'',
            }
        },
        mounted() {
            const that = this;
            this.init();
            this.getPrinters();
        }, methods: {
            save(){
                localStorage.setItem('printerName',this.printerName);
                localStorage.setItem('printerTemplate',this.printerTemplate);
            },
            init(){
                console.log(localStorage.getItem("printerName"));
                const printerName=localStorage.getItem("printerName");
                const printerTemplate=localStorage.getItem("printerTemplate");
                this.printerName = printerName?printerName:'';
                this.printerTemplate = printerTemplate?printerTemplate:'';
                ipcRenderer.on('getPrinters-reply',this.getPrintersReply);
            },
            getPrinters() {
                ipcRenderer.send('getPrinters');
            },
            getPrintersReply(event, arg) {
                console.log(event);
                console.log(arg);
                this.printers = arg;
            },printPage(preview){
                const data={
                    specDtex:1.33,
                    specMm:51,
                    grade:'A',
                    weight:27,
                    lotNo:1234,
                    baleNo:12,
                    preview:preview,
                    moistureRegain:28.1,
                    printerName:this.printerName,
                    backPath:'/printer',
                };
                var  url = this.printerTemplate;
                var params = '';
                for (var key in data) {
                    params = params + `${key}=${data[key]}&`
                }
                url = `${url}?${params}`;
                url = url.substr(0,url.length-1);
                console.log(url);
                // window.open(url);
                const pushData = {path:this.printerTemplate,query:data};
                console.log(pushData)
                this.$router.push(pushData)
                // ipcRenderer.send('printPage',this.printerName);
            }

        },
    }
</script>

<style scoped>
    .item {
        text-align: center;
    }

    .mycard {
        padding: 10px;
    }

    .name {
        display: inline;
        font-style: italic;
        font-weight: 300;
        font-size: 16px;
        letter-spacing: 1px;
    }

    .value {
        display: inline;
        font-style: italic;
        font-weight: 600;
        font-size: 18px;
        padding-left: 5px;
    }
</style>
