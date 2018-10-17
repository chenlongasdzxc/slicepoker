<template>

    <!--常规标签-->
    <div style="height: 150mm;width: 100mm;">
    <div style="position:absolute;display: inline-block;left:4mm;top:-100mm;height: 100mm;width: 150mm;" id="print-div">

        <div id="border" class="border" style="top:2mm;left: 2mm;height: 96mm;width: 146mm;"></div>

        <!--<img style="width: 44mm;height: 44mm;position: fixed;left: 101mm;top:30mm;border: 1px solid black"
             :src="moistureRegain.url" alt="">-->

        <div id="text03" class="cn" style="left: 6mm;top:8mm">规格</div>
        <div id="text09" class="en" style="left: 22mm;top:10mm">Spec:</div>
        <div id="data_specDtex" class="data" style="left: 42mm;top:4mm;width: 36mm;font-family: Arial;font-size: 42pt;line-height: 12mm">{{data.specDtex}}</div>
        <div id="text15" class="en" style="left: 80mm;top:10mm">dtex</div>
        <div id="data_specMm" class="data" style="left: 94mm;top:4mm;width: 34mm;font-family: Arial;font-size: 42pt;line-height: 12mm">{{data.specMm}}</div>
        <div id="text16" class="en" style="left: 130mm;top:10mm">mm</div>

        <div id="text04" class="cn" style="left: 6mm;top:24mm">等级</div>
        <div id="text10" class="en" style="left: 23mm;top:27mm">Grade:</div>
        <div id="data_grade" class="data" style="left: 48mm;top:19mm;width: 82mm;font-family: 黑体;font-size: 42pt;line-height: 13mm">{{data.grade}}</div>

        <div id="text05" class="cn" style="left: 6mm;top:38mm">净重</div>
        <div id="text11" class="en" style="left:23mm;top:40mm">Weight:</div>
        <div id="data_weight" class="data" style="left: 48mm;top:33mm;width: 82mm;font-family: Arial;font-size: 42pt;line-height: 12mm">{{data.weight.toFixed(1)}}</div>
        <div id="text17" class="en" style="left: 132mm;top:39mm">kg</div>

        <div id="text06" class="cn" style="left: 6mm;top:57mm">批号</div>
        <div id="text12" class="en" style="left: 23mm;top:59mm">Lot No.:</div>
        <div id="data_lotNo" class="data" style="left: 48mm;top:47mm;width: 82mm;font-family: Arial;font-size: 68pt;line-height: 18mm">{{data.lotNo}}</div>

        <div id="text07" class="cn" style="left: 6mm;top:76mm">包号</div>
        <div id="text13" class="en" style="left: 22mm;top:78mm">Bale No.:</div>
        <div id="data_baleNo" class="data" style="left: 50mm;top:66mm;width: 80mm;font-family: Arial;font-size: 68pt;line-height: 18mm">{{data.baleNo}}</div>

        <div id="text08" class="cn" style="left: 6mm;top:86mm">执行标准</div>
        <div id="text14" class="en1" style="left: 42mm;top:88mm;font-size: 20pt">Executive Standard:</div>
        <div class="en1" style="left: 94mm;top:88mm;font-size: 20pt">GB/T14463-2008</div>
        <!--<div id="data_moistureRegain" class="data" style="left: 20mm;top:40mm">{{data.moistureRegain}}</div>-->


        <!--<div>-->
        <!--编号:  <div>{{data.lotNo}}</div>-->
        <!--</div>-->

    </div>
        <v-btn v-if="data.preview" @click.navite="back">返回</v-btn>
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
                        that.printPage();
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
                    ipcRenderer.send('printPage', this.printerName);
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

@page{
    size: portrait;
    margin: 0;
}

#print-div{
    transform:rotateZ(90deg);
    -ms-transform:rotateZ(90deg); 	/* IE 9 */
    -moz-transform:rotateZ(90deg); 	/* Firefox */
    -webkit-transform:rotateZ(90deg); /* Safari 和 Chrome */
    -o-transform:rotateZ(90deg); 	/* Opera */
    -webkit-transform-origin: left bottom;
}

    .border {
        border: 1mm solid black;
        position: absolute;
        /* border-radius: 4mm; */
    }

    .data {
        font-family: Arial, Helvetica, sans-serif;
        position: absolute;
        font-size: 42pt;
         font-weight: bold;
        border-bottom: black .4mm solid;
        text-align: center;
        line-height: 6mm;
    }

    .en {
        font-family: Arial;
        position: absolute;
        font-weight: bold;
        font-size: 16pt !important;
    }

    .cn {
        font-family: SimHei;
        position: absolute;
         font-weight: bold;
        font-size: 22pt !important;
    }

    .en1{
        font-family: Arial;
        position: absolute;
        font-weight: bold;
        font-size: 14pt !important;
    }

    canvas {
        width: 52mm !important;
        height: 52mm !important;
    }

    .title {
        position: absolute;
        font-size: 14mm !important;
        font-weight: bold;
        text-align: center;
    }

    span {
        white-space: nowrap !important;
    }
</style>
