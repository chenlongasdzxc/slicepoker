<template>
    <div style="display: inline-block;height: 150mm;width: 160mm">

        <div id="border" class="border" style="top:4mm;left: 4mm;height: 142mm;width: 152mm;"></div>

        <div id="text01" class="title" style="left: 6mm;top:12mm;width: 80mm">GMVS</div>
        <div id="text02" class="title" style="left: 6mm;top:30mm;width: 80mm">涡流纺专用纤维素纤维</div>


        <img style="width: 52mm;height: 52mm;position: fixed;left: 100mm;top:8mm;border: 1px solid black"
             :src="moistureRegain.url" alt="">

        <div id="text03" class="cn" style="left: 10mm;top:64mm">规格</div>
        <div id="text09" class="en" style="left: 30mm;top:67mm">Spec:</div>
        <div id="data_specDtex" class="data" style="left: 55mm;top:62mm;width: 30mm">{{data.specDtex}}</div>
        <div id="text15" class="en" style="left: 87mm;top:67mm">dtex</div>
        <div id="data_specMm" class="data" style="left: 100mm;top:62mm;width: 30mm">{{data.specMm}}</div>
        <div id="text16" class="en" style="left: 132mm;top:67mm">mm</div>

        <div id="text04" class="cn" style="left: 10mm;top:78mm">等级</div>
        <div id="text10" class="en" style="left: 30mm;top:81mm">Grade:</div>
        <div id="data_grade" class="data" style="left: 55mm;top:76mm;width: 80mm">{{data.grade}}</div>

        <div id="text05" class="cn" style="left: 10mm;top:92mm">净重</div>
        <div id="text11" class="en" style="left: 30mm;top:95mm">Weight:</div>
        <div id="data_weight" class="data" style="left: 55mm;top:90mm;width: 80mm">{{data.weight}}</div>
        <div id="text17" class="en" style="left: 136mm;top:95mm">kg</div>

        <div id="text06" class="cn" style="left: 10mm;top:106mm">批号</div>
        <div id="text12" class="en" style="left: 30mm;top:109mm">Lot No.:</div>
        <div id="data_lotNo" class="data" style="left: 55mm;top:104mm;width: 80mm">{{data.lotNo}}</div>

        <div id="text07" class="cn" style="left: 10mm;top:120mm">包号</div>
        <div id="text13" class="en" style="left: 30mm;top:123mm">Bale No.:</div>
        <div id="data_baleNo" class="data" style="left: 55mm;top:118mm;width: 80mm">{{data.baleNo}}</div>

        <div id="text08" class="cn" style="left: 10mm;top:134mm">执行标准</div>
        <div id="text14" class="en" style="left: 50mm;top:136mm">Executive Standard:GB/T14463-2008</div>

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

    .border {
        border: 1px solid black;
        position: fixed;
        border-radius: 4mm;
    }

    .data {
        position: fixed;
        font-size: 10mm !important;
        border-bottom: black .4mm solid;
        text-align: center;
    }

    .en {
        position: fixed;
        font-size: 6mm !important;
    }

    .cn {
        position: fixed;
        font-size: 8mm !important;
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
