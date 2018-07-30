<template>
    <div style="display: inline-block;height: 100mm;width: 150mm">

        <div id="border" class="border" style="top:2mm;left: 2mm;height: 96mm;width: 146mm;"></div>

        <img style="width: 42mm;height: 42mm;position: fixed;left: 102mm;top:24mm;border: 1px solid black"
             :src="moistureRegain.url" alt="">

        <div id="text03" class="cn" style="left: 6mm;top:10mm">规格</div>
        <div id="text09" class="en" style="left: 21mm;top:10mm">Spec:</div>
        <div id="data_specDtex" class="data" style="left: 38mm;top:10mm;width: 25mm">{{data.specDtex}}</div>
        <div id="text15" class="en" style="left: 64mm;top:10mm">dtex</div>
            <div id="data_specMm" class="data" style="left: 77mm;top:10mm;width: 25mm">{{data.specMm}}</div>
        <div id="text16" class="en" style="left: 105mm;top:10mm">mm</div>

        <div id="text04" class="cn" style="left: 6mm;top:24mm">等级</div>
        <div id="text10" class="en" style="left: 21mm;top:24mm">Grade:</div>
        <div id="data_grade" class="data" style="left: 43mm;top:24mm;width: 50mm">{{data.grade}}</div>

        <div id="text05" class="cn" style="left: 6mm;top:38mm">净重</div>
        <div id="text11" class="en" style="left:21mm;top:38mm">Weight:</div>
        <div id="data_weight" class="data" style="left: 43mm;top:38mm;width: 50mm">{{data.weight}}</div>
        <div id="text17" class="en" style="left: 93mm;top:38mm">kg</div>

        <div id="text06" class="cn" style="left: 6mm;top:52mm">批号</div>
        <div id="text12" class="en" style="left: 21mm;top:52mm">Lot No.:</div>
        <div id="data_lotNo" class="data" style="left: 43mm;top:52mm;width: 50mm">{{data.lotNo}}</div>

        <div id="text07" class="cn" style="left: 6mm;top:66mm">包号</div>
        <div id="text13" class="en" style="left: 21mm;top:66mm">Bale No.:</div>
        <div id="data_baleNo" class="data" style="left: 48mm;top:66mm;width: 50mm">{{data.baleNo}}</div>

        <div id="text08" class="cn" style="left: 6mm;top:80mm">执行标准</div>
        <div id="text14" class="en" style="left: 35mm;top:80mm">Executive Standard:GB/T14463-2008</div>

        <v-btn v-if="data.preview" @click.navite="back">返回</v-btn>
        <!--<div id="data_moistureRegain" class="data" style="left: 20mm;top:40mm">{{data.moistureRegain}}</div>-->


        <!--<div>-->
        <!--编号:  <div>{{data.lotNo}}</div>-->
        <!--</div>-->

    </div>
</template>
<script>
    const {ipcRenderer} = require('electron');
    // import Qrcodnpm i qrcodeeVue from 'qrcode.vue';
    import qrcode from 'qrcode';

    export default {
        data() {
            return {
                moistureRegain: {url: ''},
                data: {
                    baleNo: "12",
                    grade: "A",
                    lotNo: "1234",
                    moistureRegain: "28.1",
                    specDtex: "1.33",
                    specMm: "51",
                    preview:'',
                    weight: "27"
                },
                backPath:'',
                printerName: '',

            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.init();
        }, methods: {
            init() {
                const that = this;
                const p = this.$route.query;
                that.printerName = p.printerName;
                that.backPath = p.backPath;
                that.data = p;
                qrcode.toDataURL(`回潮率：${p.moistureRegain}`, {errorCorrectionLevel: 'H'}, (err, url) => {
                    that.moistureRegain.url = url;
                    if(that.data.preview){

                    }else {
                        // that.printPage();
                    }
                });
            },
            getPrinters() {
                ipcRenderer.send('getPrinters');
            },
            printPage() {
                // window.open('#/setting')
                ipcRenderer.on('printPage-reply', this.printPageReply);
                setTimeout(()=>{
                    // ipcRenderer.send('printPage', this.printerName);
                },1000);
                // window.print({silent:true,printBackground:true,deviceName:this.printerName});
                // setTimeout(()=>{window.close()},2000);
            },
            back(){
                this.$router.push({path:this.backPath})
            },
            printPageReply() {
                setTimeout(this.back, 1000);
            },
        },
    }
</script>

<style scoped>

    .border {
        border: 1px solid black;
        position: fixed;
        border-radius: 4mm;
    }

    .data {
        position: fixed;
        font-size: 7mm !important;
        border-bottom: black .4mm solid;
        text-align: center;
    }

    .en {
        position: fixed;
        font-size: 7mm !important;
    }

    .cn {
        position: fixed;
        font-size: 7mm !important;
    }

    canvas {
        width: 52mm !important;
        height: 52mm !important;
    }

    .title {
        position: fixed;
        font-size: 14mm !important;
        font-weight: bold;
        text-align: center;
    }

    span {
        white-space: nowrap !important;
    }
</style>
