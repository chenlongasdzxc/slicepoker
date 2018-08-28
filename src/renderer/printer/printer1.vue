<template>
    <div style="display: inline-block;height: 138mm;width: 130mm">

        <div id="border" class="border" style="top:0mm;left: 0mm;height: 136mm;width: 128mm;"></div>

        <div id="text01" class="title" style="left: 1mm;top:8mm;width: 126mm">GMVS</div>
        <div id="text02" class="title" style="left: 1mm;top:26mm;width: 126mm">涡流纺专用纤维素纤维</div>


        <img style="width: 40mm;height: 40mm;position: fixed;left: 87mm;top:95mm;"
             :src="moistureRegain.url" alt="">

        <div id="text03" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*1 )">规格</div>
        <div id="text09" class="en" style="left: 23mm;top:calc( 34mm + 14mm*1 + 3mm)">Spec:</div>
        <div id="data_specDtex" class="data" style="left: 48mm;top:calc( 34mm + 14mm*1 - 2mm);width: 25mm">{{data.specDtex}}</div>
        <div id="text15" class="en" style="left: 75mm;top:calc( 34mm + 14mm*1 + 3mm)">dtex</div>
        <div id="data_specMm" class="data" style="left: 90mm;top:calc( 34mm + 14mm*1 - 2mm);width: 25mm">{{data.specMm}}</div>
        <div id="text16" class="en" style="left: 116mm;top:calc( 34mm + 14mm*1 + 3mm)">mm</div>

        <div id="text04" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*2 )">等级</div>
        <div id="text10" class="en" style="left: 23mm;top:calc( 34mm + 14mm*2 + 3mm)">Grade:</div>
        <div id="data_grade" class="data" style="left: 48mm;top:calc( 34mm + 14mm*2 - 2mm);width: 70mm">{{data.grade}}</div>

        <div id="text05" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*3 )">净重</div>
        <div id="text11" class="en" style="left: 23mm;top:calc( 34mm + 14mm*3 + 3mm)">Weight:</div>
        <div id="data_weight" class="data" style="left: 48mm;top:calc( 34mm + 14mm*3 - 2mm);width: 70mm">{{data.weight}}</div>
        <div id="text17" class="en" style="left: 119mm;top:calc( 34mm + 14mm*3 + 3mm)">kg</div>

        <div id="text06" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*4 + 0mm)">批号</div>
        <div id="text12" class="en" style="left: 23mm;top:calc( 34mm + 14mm*4 + 3mm)">Lot No.:</div>
        <div id="data_lotNo" class="data" style="left: 48mm;top:calc( 34mm + 14mm*4 - 2mm);width: 70mm">{{data.lotNo}}</div>

        <div id="text07" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*5 - 0mm)">包号</div>
        <div id="text13" class="en" style="left: 23mm;top:calc( 34mm + 14mm*5 + 3mm)">Bale No.:</div>
        <div id="data_baleNo" class="data" style="left: 48mm;top:calc( 34mm + 14mm*5 - 2mm);width: 40mm">{{data.baleNo}}</div>

        <div id="text08" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*6 - 0mm)">执行标准</div>
        <div id="text14" class="en" style="left: 39mm;top:120mm;font-size: 5mm!important;">Executive Standard:<br/>GB/T14463-2008</div>

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

    *{
      font-family: "Microsoft YaHei UI";
    }

    .border {
        border: 2px solid black;
        position: fixed;
        /*border-radius: 4mm;*/
    }

    .data {
        position: fixed;
        font-size: 10mm !important;
        font-weight: bold;
        border-bottom: black .4mm solid;
        text-align: center;
    }

    .en {
        position: fixed;
        font-size: 6mm !important;
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
        font-size: 11mm !important;
        font-weight: bold;
        text-align: center;
    }

    span {
        white-space: nowrap !important;
    }
</style>
