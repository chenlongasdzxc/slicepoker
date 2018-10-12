<template>
    <div style="display: inline-block;height: 160mm;width: 150mm">
        <div style="position:absolute;display: inline-block;left:53mm;top:-103mm;height: 100mm;width: 150mm;" id="print-div">
        <div id="border" class="border" style="top:4mm;left: 4mm;height: 148mm;width: 150mm;"></div>

        <div id="text01" class="title" style="left: 8mm;top:16mm;width: 50mm">VISCOSE</div>
        <div id="text02" class="title" style="left: 60mm;top:16mm;width: 50mm">STAPLE</div>
        <div id="text18" class="title" style="left: 104mm;top:16mm;width: 50mm">FIBRE</div>



        <div id="text03" class="cn" style="left: 10mm;top:42mm">规格</div>
        <div id="text09" class="en" style="left: 30mm;top:44mm">Spec:</div>
        <div id="data_specDtex" class="data" style="left: 50mm;top:36mm;width: 34mm;font-size: 48pt">{{data.specDtex}}</div>
        <div id="text15" class="en" style="left: 86mm;top:44mm">dtex</div>
        <div id="data_specMm" class="data" style="left: 100mm;top:36mm;width: 32mm;font-size: 48pt">{{data.specMm}}</div>
        <div id="text16" class="en" style="left: 136mm;top:44mm">mm</div>

        <div id="text04" class="cn" style="left: 10mm;top:62mm">等级</div>
        <div id="text10" class="en" style="left: 30mm;top:65mm">Grade:</div>
        <div id="data_grade" class="data" style="left: 52mm;top:56mm;width: 80mm;font-size: 42pt;font-family: 黑体">{{data.grade}}</div>

        <div id="text05" class="cn" style="left: 10mm;top:84mm">净重</div>
        <div id="text11" class="en" style="left: 30mm;top:87mm">Weight:</div>
        <div id="data_weight" class="data" style="left: 52mm;top:79mm;width: 80mm;font-size: 48pt">{{data.weight.toFixed(1)}}</div>
        <div id="text17" class="en" style="left: 136mm;top:86mm">kgs</div>

        <div id="text06" class="cn" style="left: 10mm;top:104mm">批号</div>
        <div id="text12" class="en" style="left: 30mm;top:107mm">Lot No.:</div>
        <div id="data_lotNo" class="data1" style="left: 52mm;top:98mm;width: 80mm;">{{data.lotNo}}</div>

        <div id="text07" class="cn" style="left: 10mm;top:124mm">包号</div>
        <div id="text13" class="en" style="left: 28mm;top:127mm">Bale No.:</div>
        <div id="data_baleNo" class="data1" style="left: 52mm;top:118mm;width: 80mm;">{{data.baleNo}}</div>

        <div id="text08" class="cn" style="left: 10mm;top:140mm">执行标准</div>
        <div id="text14" class="en" style="left: 50mm;top:142mm">Executive Standard:GB/T14463-2008</div>


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
                    grade: "优等品",
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
        border: 1mm solid black;
        position: absolute;
    }

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

    .data {
        position: absolute;
        /*font-size: 48pt !important;*/
        font-family: Arial;
        font-weight: bolder;
        border-bottom: black .4mm solid;
        text-align: center;
        line-height: 14mm;
    }

    .data1{
        position: absolute;
        text-align: center;
        border-bottom: black .4mm solid;
        line-height: 17.5mm;
        font-size: 48pt;
        font-weight: bold;
        font-family: Arial;
    }

    .en {
        position: absolute;
        font-size: 16pt !important;
        font-weight: bolder;
        font-family: Arial;
    }

    .cn {
        position: absolute;
        font-weight: bolder;
        font-size: 22pt !important;
        font-family: 黑体;
    }

    canvas {
        width: 52mm !important;
        height: 52mm !important;
    }

    .title {
        position: absolute;
        font-family: Arial;
        font-size: 32pt !important;
        font-weight: bold;
        text-align: center;
    }

    span {
        white-space: nowrap !important;
    }
</style>
