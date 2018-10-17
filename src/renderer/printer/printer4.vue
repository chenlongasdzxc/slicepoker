<template>
    <!--涡流纺专用标签-->
    <div>
        <div style="display: inline-block;height: 138mm;width: 160mm">
            <div style="position:absolute;display: inline-block;left:48mm;top:-97mm;height: 100mm;width: 150mm;" id="print-div">
                <div id="border" class="border" style="top:0mm;left: 0mm;height: 144mm;width: 152mm;"></div>

                <div id="text01" class="title1" style="left: 14mm;top:6mm;width: 126mm;">GMVS</div>
                <div id="text02" class="title2" style="left: 1.5mm;top:24mm;width: 150mm;">涡流纺专用纤维素纤维</div>


                <!--<img style="width: 36mm;height: 36mm;position: fixed;left: 91mm;top:99mm;"
                     :src="moistureRegain.url" alt="">-->

                <div id="text03" class="cn" style="left: 11mm;top:calc( 34mm + 16mm*1 )">规格</div>
                <div id="text09" class="en" style="left: calc( 28mm - 0mm );top:calc( 33mm + 16mm*1 + 3mm)">Spec:</div>
                <div id="data_specDtex" class="data" style="left: 48mm;top:calc( 31mm + 16mm*1 - 2mm);width: 33mm;font-family: Arial;font-size: 42pt">{{data.specDtex}}</div>
                <div id="text15" class="en" style="left: 85mm;top:calc( 34mm + 16mm*1 + 3mm)">dtex</div>
                <div id="data_specMm" class="data" style="left: 100mm;top:calc( 31mm + 16mm*1 - 2mm);width: 35mm;font-family: Arial;font-size: 42pt">{{data.specMm}}</div>
                <div id="text16" class="en" style="left: 135mm;top:calc( 34mm + 16mm*1 + 3mm)">mm</div>

                <div id="text04" class="cn" style="left: 11mm;top:calc( 38mm + 16mm*2 )">等级</div>
                <div id="text10" class="en" style="left: calc( 32mm - 0mm );top:calc( 36mm + 16mm*2 + 3mm)">Grade:</div>
                <div id="data_grade" class="data" style="left: 55mm;top:calc( 34mm + 16mm*2 - 2mm);width: 80mm;font-size: 42pt;font-family: 黑体">{{data.grade}}</div>

                <div id="text05" class="cn" style="left: 11mm;top:calc( 38mm + 16mm*3 )">净重</div>
                <div id="text11" class="en" style="left: calc( 32mm - 4mm );top:calc( 36mm + 16mm*3 + 3mm)">Weight:</div>
                <div id="data_weight" class="data" style="left: 55mm;top:calc( 34mm + 16mm*3 - 2mm);width: 80mm;font-family: Arial;font-size: 42pt">{{data.weight.toFixed(1)}}</div>
                <div id="text17" class="en" style="left: 137mm;top:calc( 36mm + 16mm*3 + 3mm)">kg</div>

                <div id="text06" class="cn" style="left: 11mm;top:calc( 35mm + 16mm*4 + 2mm)">批号</div>
                <div id="text12" class="en" style="left: calc( 32mm - 4mm );top:calc( 34mm + 16mm*4 + 5mm)">Lot No.:</div>
                <div id="data_lotNo" class="data" style="left: 55mm;top:calc( 34mm + 16mm*4 - 2mm);width: 80mm;font-family: Arial;font-size: 42pt">{{data.lotNo}}</div>

                <div id="text07" class="cn" style="left: 11mm;top:calc( 37mm + 16mm*5 - 0mm)">包号</div>
                <div id="text13" class="en" style="left: calc( 32mm - 4mm );top:calc( 36mm + 16mm*5 + 3mm)">Bale No.:</div>
                <div id="data_baleNo" class="data" style="left: 57mm;top:calc( 34mm + 16mm*5 - 2mm);width: 78mm;font-family: Arial;font-size: 42pt">{{data.baleNo}}</div>

                <div id="text08" class="cn" style="left: 11mm;top:calc( 34mm + 16mm*6 - 0mm)">执行标准</div>
                <div id="text14" class="en" style="left: calc( 35mm + 10mm ); top:calc( 34mm + 16mm*6 + 2mm);font-size: 5mm!important;">Executive Standard:GB/T 14463-2008</div>


                <!--<div id="data_moistureRegain" class="data" style="left: 20mm;top:40mm">{{data.moistureRegain}}</div>-->


                <!--<div>-->
                <!--编号:  <div>{{data.lotNo}}</div>-->
                <!--</div>-->
            </div>
            <v-btn v-if="data.preview" @click.navite="back">返回</v-btn>
        </div>
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
                    baleNo: "3046",
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

    *{
        font-family: "Microsoft YaHei UI";
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

    .border {
        border: 1mm solid black;
        position: absolute;
    }

    .data {
        font-weight: bolder;
        position: absolute;
        border-bottom: black .4mm solid;
        text-align: center;
        line-height: 14mm;

    }

    .en {
        font-weight: bolder;
        position: absolute;
        font-size: 6mm !important;
    }

    .cn {
        position: absolute;
        font-weight: bolder;
        font-size: 22pt ;
        font-family: 黑体;
    }

    canvas {
        width: 52mm !important;
        height: 52mm !important;
    }

    .title1 {
        font-weight: bolder;
        position: absolute;
        font-size: 48pt !important;
        text-align: center;
        font-family: Arial;
    }
    .title2{
        font-weight: bolder;
        position: absolute;
        font-family: 黑体;
        font-size: 41pt !important;
        text-align: center;
    }

    span {
        white-space: nowrap !important;
    }
</style>
