<template>
    <v-layout row wrap justify-center id="wrapper">
        <v-flex xs10 class="mt-4">
            <v-container grid-list-md>
                <v-layout row wrap v-if="checkDevice()">
                    <!--<v-flex xs12 sm6 md8 lg9 xl10>-->
                    <v-flex>
                        <v-layout column>
                            <v-form ref="form" v-model="form.valid">
                                <v-flex>
                                    <v-card>
                                        <v-card-title>
                                            <span>基本信息</span>
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-container grid-list-md>

                                            <v-layout wrap>
                                                <!--<v-flex xs12 sm6 md4 lg3 xl2>-->
                                                <!--<v-text-field :rules="form.requireRules" type="number"-->
                                                <!--v-model="form.data.specDtex" label="规格"-->
                                                <!--:disabled="runtime" suffix="dtex"></v-text-field>-->
                                                <!--</v-flex>-->
                                                <!--<v-flex xs12 sm6 md4 lg3 xl2>-->
                                                <!--<v-text-field :rules="form.requireRules" v-model="form.data.specMm"-->
                                                <!--suffix="mm" label="规格" type="number"-->
                                                <!--:disabled="runtime"></v-text-field>-->
                                                <!--</v-flex>-->
                                                <!--<v-flex xs12 sm6 md4 lg3 xl2>-->
                                                <!--<v-text-field :rules="form.requireRules" v-model="form.data.lotNo"-->
                                                <!--label="大批号" :disabled="runtime"></v-text-field>-->
                                                <!--</v-flex>-->
                                                <!--<v-flex xs12 sm6 md4 lg3 xl2>-->
                                                <!--<v-text-field :rules="form.requireRules" v-model="form.data.grade"-->
                                                <!--label="等级" :disabled="runtime"></v-text-field>-->
                                                <!--</v-flex>-->
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" v-model="form.data.no"
                                                                  label="编号" :disabled="runtime"></v-text-field>
                                                </v-flex>
                                                <!--<v-flex xs12 sm6 md4 lg3 xl2>-->
                                                <!--<v-text-field :rules="form.requireRules" v-model="form.data.baleNo"-->
                                                <!--label="起始包号" type="number"-->
                                                <!--:disabled="runtime"></v-text-field>-->
                                                <!--</v-flex>-->
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-select :rules="form.requireRules"
                                                              v-model="form.data.printerTemplate"
                                                              :items="printerTemplates"
                                                              item-text="name"
                                                              item-value="path"
                                                              label="打印模板"
                                                              :disabled="runtime"></v-select>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-btn @click.navite="start" color="success" v-if="!runtime">
                                                        <v-icon>play_arrow</v-icon>
                                                    </v-btn>
                                                    <v-btn @click.navite="stop" color="purple" v-if="runtime">
                                                        <v-icon>stop</v-icon>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>


                                        </v-container>
                                    </v-card>
                                </v-flex>

                                <v-flex>
                                    <v-card>
                                        <div class="data_show_div"
                                             style="display: inline-block;height: 138mm;width: 130mm">

                                            <div id="border" class="border"
                                                 style="top:0;left: 0;height: 136mm;width: 128mm;"></div>

                                            <div id="text01" class="title" style="left: 1mm;top:8mm;width: 126mm">GMVS
                                            </div>
                                            <div id="text02" class="title" style="left: 1mm;top:26mm;width: 126mm">
                                                涡流纺专用纤维素纤维
                                            </div>


                                            <!--<img style="width: 36mm;height: 36mm;position: fixed;left: 91mm;top:99mm;"-->
                                            <!--:src="moistureRegain.url" alt="">-->
                                            <img v-if="currentData.data.url"
                                                 style="width: 36mm;height: 36mm;position: absolute;left: 91mm;top:99mm;"
                                                 :src.sync="currentData.data.url" alt="">

                                            <img style="width: 36mm;height: 36mm;position: absolute;left: 91mm;top:99mm;"
                                                 v-if="!currentData.data.url"
                                                 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAANuSURBVO3BMY7jSAAEwcyG/v/lujHOKIsAIUo7u6gI84OZ/x1mymGmHGbKYaYcZsphphxmymGmHGbKYaYcZsphphxmymGmHGbKizepfFMSmsodSbii0pJwRaUloal8UxLecZgph5lymCkvHpaEJ6m8IwlXVL4pCU9SedJhphxmymGmvPgwlTuS8CSVK0m4Q6Ul4R0qdyThkw4z5TBTDjPlxV8uCU2lJeGKyh1JaCotCX+zw0w5zJTDTHnxj1NpSWhJuEOlJeFfcpgph5lymCkvPiwJn6TSktBUfrMk/CaHmXKYKYeZ8uJhKn8TlZaEptKS0FRaEq6o/GaHmXKYKYeZYn7wF1N5UhKuqFxJwt/sMFMOM+UwU158mModSWgqLQlXktBUWhKuqNyRhKZyRxKuqNyRhHccZsphphxmivnBg1RaEppKS8IdKnck4TdRuZKEpnJHEt5xmCmHmXKYKS++LAlN5UlJaCpXktBU7khCU2lJuEPlShI+6TBTDjPlMFNevEnliso7ktBUrqjcodKS8E1JuKLSVFoSnnSYKYeZcpgp5gdfpHIlCU2lJaGptCS8Q+VKEppKS8I7VK4k4ZMOM+UwUw4zxfzgDSotCU3lHUl4kkpLQlO5IwlNpSXhikpLwhWVK0l4x2GmHGbKYaa8+LIkXFFpKi0J70hCU2lJaCpXVJ6kciUJn3SYKYeZcpgpL75M5Y4kNJWWhKbSknAlCU3ljiRcUXmSypUkvOMwUw4z5TBTXnxYEq6oXFFpSWgqT0rCFZWm8qQkNJVvOsyUw0w5zJQXb0rCO5LwTSotCU3lHUm4Q+WOJHzSYaYcZsphprx4k8o3JaEloak8KQlN5Q6VloQ7ktBUWhKedJgph5lymCkvHpaEJ6n8SSotCU3lShLuULmShKbSkvCOw0w5zJTDTHnxYSp3JOEOlZaEpvKOJNyh8kkqLQlPOsyUw0w5zJQX/xiVO1TuULmShCeptCQ0lZaEdxxmymGmHGbKi39MEprKk5LQVJrKlSQ0ld/kMFMOM+UwU158WBI+KQlXktBUriThikpLwh0qV5LQVL7pMFMOM+UwU148TOVPUrmShDtUPikJTeWKyicdZsphphxmivnBzP8OM+UwUw4z5TBTDjPlMFMOM+UwUw4z5TBTDjPlMFMOM+UwUw4z5T/SKmYzeQPxfAAAAABJRU5ErkJggg=="
                                                 alt="">

                                            <div id="text03" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*1 )">规格
                                            </div>
                                            <div id="text09" class="en"
                                                 style="left: 23mm;top:calc( 34mm + 14mm*1 + 3mm)">
                                                Spec:
                                            </div>
                                            <div id="data_specDtex" class="data_input"
                                                 style="left: 48mm;top:calc( 34mm + 14mm*1 - 2mm);width: 25mm">
                                                <v-text-field v-if="runtime" :readonly="runtime"
                                                              v-model="currentData.data.specDtex"></v-text-field>
                                                <v-text-field v-else :rules="form.requireRules"
                                                              v-model="form.data.specDtex"></v-text-field>
                                            </div>
                                            <div id="text15" class="en"
                                                 style="left: 75mm;top:calc( 34mm + 14mm*1 + 3mm)">
                                                dtex
                                            </div>
                                            <div id="data_specMm" class="data_input"
                                                 style="left: 90mm;top:calc( 34mm + 14mm*1 - 2mm);width: 25mm">
                                                <v-text-field v-if="runtime" :readonly="runtime"
                                                              v-model="currentData.data.specMm"></v-text-field>
                                                <v-text-field v-else :rules="form.requireRules"
                                                              v-model="form.data.specMm"></v-text-field>
                                            </div>
                                            <div id="text16" class="en"
                                                 style="left: 116mm;top:calc( 34mm + 14mm*1 + 3mm)">
                                                mm
                                            </div>

                                            <div id="text04" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*2 )">等级
                                            </div>
                                            <div id="text10" class="en"
                                                 style="left: 23mm;top:calc( 34mm + 14mm*2 + 3mm)">
                                                Grade:
                                            </div>
                                            <div id="data_grade" class="data_input"
                                                 style="left: 48mm;top:calc( 34mm + 14mm*2 - 2mm);width: 70mm">
                                                <v-text-field v-if="runtime" :readonly="runtime"
                                                              v-model="currentData.data.grade"></v-text-field>
                                                <v-text-field v-else :rules="form.requireRules"
                                                              v-model="form.data.grade"></v-text-field>
                                            </div>

                                            <div id="text05" class="cn" style="left: 3mm;top:calc( 34mm + 14mm*3 )">净重
                                            </div>
                                            <div id="text11" class="en"
                                                 style="left: 23mm;top:calc( 34mm + 14mm*3 + 3mm)">
                                                Weight:
                                            </div>
                                            <div id="data_weight" class="data_input"
                                                 style="left: 48mm;top:calc( 34mm + 14mm*3 - 2mm);width: 70mm">
                                                <v-text-field readonly v-model="currentData.data.weight"></v-text-field>
                                            </div>
                                            <div id="text17" class="en"
                                                 style="left: 119mm;top:calc( 34mm + 14mm*3 + 3mm)">
                                                kg
                                            </div>

                                            <div id="text06" class="cn"
                                                 style="left: 3mm;top:calc( 34mm + 14mm*4 + 0mm)">
                                                批号
                                            </div>
                                            <div id="text12" class="en"
                                                 style="left: 23mm;top:calc( 34mm + 14mm*4 + 3mm)">
                                                Lot No.:
                                            </div>
                                            <div id="data_lotNo" class="data_input"
                                                 style="left: 48mm;top:calc( 34mm + 14mm*4 - 2mm);width: 70mm">
                                                <v-text-field v-if="runtime" :readonly="runtime"
                                                              v-model="currentData.data.lotNo"></v-text-field>
                                                <v-text-field v-else :rules="form.requireRules"
                                                              v-model="form.data.lotNo"></v-text-field>
                                            </div>

                                            <div id="text07" class="cn"
                                                 style="left: 3mm;top:calc( 34mm + 14mm*5 - 0mm)">
                                                包号
                                            </div>
                                            <div id="text13" class="en"
                                                 style="left: 23mm;top:calc( 34mm + 14mm*5 + 3mm)">
                                                Bale No.:
                                            </div>
                                            <div id="data_baleNo" class="data_input"
                                                 style="left: 48mm;top:calc( 34mm + 14mm*5 - 2mm);width: 40mm">
                                                <v-text-field v-if="runtime" :readonly="runtime"
                                                              v-model="currentData.data.baleNo"></v-text-field>
                                                <v-text-field v-else :rules="form.requireRules"
                                                              v-model="form.data.baleNo"></v-text-field>
                                            </div>

                                            <div id="text08" class="cn"
                                                 style="left: 3mm;top:calc( 34mm + 14mm*6 - 0mm)">
                                                执行标准
                                            </div>
                                            <div id="text14" class="en"
                                                 style="left: 39mm;top:120mm;font-size: 5mm!important;">Executive
                                                Standard:<br/>GB/T14463-2008
                                            </div>

                                            <!--<div id="data_moistureRegain" class="data" style="left: 20mm;top:40mm">{{data.moistureRegain}}</div>-->


                                            <!--<div>-->
                                            <!--编号:  <div>{{data.lotNo}}</div>-->
                                            <!--</div>-->

                                        </div>
                                    </v-card>
                                </v-flex>
                                <!--<v-flex>-->
                                <!--<v-card>-->
                                <!--<v-card-title>数据回显</v-card-title>-->
                                <!--<v-divider></v-divider>-->
                                <!--<v-container>-->
                                <!--<v-data-table :headers="table.headers" :items="table.data">-->
                                <!--<template slot="no-data">-->
                                <!--暂无数据！-->
                                <!--</template>-->
                                <!--<template slot="items" slot-scope="props">-->
                                <!--<td>{{ props.item.baleNo }}</td>-->
                                <!--<td>{{ props.item.moistureRegain }}</td>-->
                                <!--<td>{{ props.item.weight }}</td>-->
                                <!--</template>-->
                                <!--</v-data-table>-->
                                <!--</v-container>-->
                                <!--</v-card>-->
                                <!--</v-flex>-->
                            </v-form>
                        </v-layout>
                    </v-flex>
                    <!--<v-flex xs12 sm6 md4 lg3 xl2>-->
                    <!--<DeviceStatus :drivers="drivers"/>-->
                    <!--</v-flex>-->
                </v-layout>

                <v-layout row wrap v-if="!checkDevice()">
                    <v-flex>
                        <DeviceStatus :drivers="drivers"/>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>
<script>

    import DeviceStatus from "../components/DeviceStatus";
    import axios from 'axios';
    import qrcode from 'qrcode';

    export default {
        name: 'production',
        components: {DeviceStatus},
        data() {
            return {
                runtime: false,
                drivers: [
                    {name: '称重机', rep: '', open: true, hasBeenSet: false, data: {}},
                    {name: '回潮仪', rep: '', open: false, hasBeenSet: false, data: {}},
                    {name: '打印机', rep: '', open: false, hasBeenSet: false, data: {}}
                ],
                table: {
                    data: [],
                    headers: [
                        {text: '包号', value: 'pn'},
                        {text: '回潮率', value: 'hc'},
                        {text: '净重', value: 'wg'},
                    ]
                },
                currentData: {
                    data: {},
                    wb: false,
                    nextBaleNo: null,
                },
                printerTemplates: [
                    {name:'模板一',path:'/printer/p1'},
                    {name:'模板二',path:'/printer/p2'},
                    {name:'模板三',path:'/printer/p3'},
                    {name:'模板四',path:'/printer/p4'},
                    {name:'模板五',path:'/printer/p5'},
                    {name:'模板六',path:'/printer/p6'},
                    {name:'模板七',path:'/printer/p7'},
                ],
                form: {
                    data: {
                        specDtex: null,
                        specMm: null,
                        grade: '',
                        lotNo: null,
                        baleNo: null,
                        no: '',
                        printerTemplate: '',
                    },
                    valid: false,
                    requireRules: [
                        v => !!v || '必填'
                    ]
                },
                rtuClient: null,
                //称重机
                weighingMachine: {
                    setting: {
                        com: '',//端口
                        baudRate: 9600,//波特率
                        parity: 'none',//校验位
                        dataBits: 8,//数据位
                        stopBits: 1,//停止位
                    },
                    rawDataCache: [],
                    serialPort: null,
                    lastTime: null,
                    lastValidTime: null,
                    tableListen: null,
                    data: {
                        weight: 0,//重量weight
                        tare: 0,//皮重tare
                        stable: true,//稳定stable
                        out: false,//超过测量范围
                        weightShow: "",
                    },
                },
                //回潮仪
                resurgenceMeter: {
                    setting: {
                        com: '',//端口
                        baudRate: 9600,//波特率
                        parity: 'none',//校验位
                        dataBits: 8,//数据位
                        stopBits: 1,//停止位
                    },
                    rawDataCache: [],
                    serialPort: null,
                    lastTime: null,
                    lastValidTime: null,
                    data: {},
                }
                ,printerName:'',
            }
        },
        beforeRouteLeave(to, from, next) {
            try {
                this.weighingMachine_stop();
                this.resurgenceMeter_stop();
            } catch (e) {

            }
            next();
        },
        mounted() {
            this.initPage();
            // this.connect();
        },
        methods: {
            log(msg, level, type, key) {
                const _data = {
                    msg: msg,
                    level: level,
                    type: type,
                    key: key
                }
                axios.post('http://171.221.202.43:34001/devLog', _data);
            },
            initPage() {
                this.weighingMachine.setting = JSON.parse(localStorage.getItem("weighMachine"));
                this.resurgenceMeter.setting = JSON.parse(localStorage.getItem("rtu"));
                this.resurgenceMeter_open();
                this.data_view_qrCodeGeneration('');
                if(sessionStorage.getItem("prd_rt")){
                    this.form.data = JSON.parse(sessionStorage.getItem("prd_rt"));
                    this.form.data.baleNo = this.form.data.baleNo +1;
                    setTimeout(this.start,500);
                }
            },
            start() {
                if (this.$refs.form.validate()) {
                    this.runtime = true;
                    this.currentData.nextBaleNo = parseInt(this.form.data.baleNo);
                    // this.currentData.nextBaleNo = parseInt(this.currentData.data.baleNo);
                    sessionStorage.setItem("prd_rt",JSON.stringify( this.form.data));
                    this.newData();
                    this.weighingMachine_open();
                }
            },
            newData() {
                const data = JSON.parse(JSON.stringify(this.form.data));
                data.baleNo = this.currentData.nextBaleNo;
                this.currentData.nextBaleNo = this.currentData.nextBaleNo + 1;
                data.moistureRegain = '等待数据';
                data.weight = '等待数据';
                this.data_view_qrCodeGeneration(data.moistureRegain);
                this.currentData.data = JSON.parse(JSON.stringify(data));
                this.currentData.wb = true;
                this.table.data.push(this.currentData.data);
            },
            stop() {
                this.runtime = false;
                this.weighingMachine_stop();
                sessionStorage.removeItem("prd_rt");
            },
            /**
             * 检查设备配置状态
             * @returns {boolean}
             */
            checkDevice() {
                // 读取配置
                const p = localStorage.getItem("printerName");
                const r = localStorage.getItem("rtu");
                const w = localStorage.getItem("weighMachine");

                // 声明返回
                var b = true;
                //解析打印机
                if (p) {
                    this.drivers[2].hasBeenSet = true;
                    this.drivers[2].data.name = p;
                    this.printerName = p;
                } else {
                    b = false;
                }
                //解析称重机
                if (w) {
                    this.drivers[0].hasBeenSet = true;
                    this.drivers[0].data = JSON.parse(w);
                } else {
                    b = false;
                }
                //解析回潮仪
                if (r) {
                    this.drivers[1].hasBeenSet = true;
                    this.drivers[1].data = JSON.parse(r);
                } else {
                    b = false;
                }

                return b;
            },
            printPage() {
                const data = {
                    specDtex: this.currentData.data.specDtex,
                    specMm: this.currentData.data.specMm,
                    grade: this.currentData.data.grade,
                    weight: this.currentData.data.weight,
                    lotNo: this.currentData.data.lotNo,
                    baleNo: this.currentData.data.baleNo,
                    moistureRegain: this.currentData.data.moistureRegain,
                    printerName: this.printerName,
                    backPath: '/product',
                };
                let url = this.form.data.printerTemplate;
                let params = '';
                for (let key in data) {
                    params = params + `${key}=${data[key]}&`
                }
                url = `${url}?${params}`;
                url = url.substr(0, url.length - 1);
                // window.open(url);
                const pushData = {path: this.form.data.printerTemplate, query: data};
                this.$router.push(pushData)
                // ipcRenderer.send('printPage',this.printerName);
            },
            /**
             * 称重机打开接口
             */
            weighingMachine_open() {
                if (this.weighingMachine && this.weighingMachine.setting && this.weighingMachine.setting.com) {
                    const SerialPort = require('serialport');
                    const port = new SerialPort(this.weighingMachine.setting.com, this.weighingMachine.setting);
                    // this.weighingMachine.lastTime = new Date();
                    this.weighingMachine.serialPort = port;
                    this.weighingMachine.tableListen = this.weighingMachine_tableRecordReal;
                    port.on('data', this.weighingMachine_listener);
                }
            },
            /**
             * 称重机数据拼接
             * 拼接多次的数据报文
             */
            weighingMachine_dataStitching(data) {
                const _data = [];
                for (let i = 0; i < this.weighingMachine.rawDataCache.length; i++) {
                    _data.push(this.weighingMachine.rawDataCache[i]);
                }

                for (let i = 0; i < data.length; i++) {
                    _data.push(parseInt(data[i].toString()));
                }
                return _data;
            },
            /**
             * 称重机数据回调
             * @param data
             * @param type
             */
            weighingMachine_listener(data, type) {
                try {
                    //发送原始数据
                    this.weighingMachine_saveRawData(data);
                    //数据拼装
                    const _data = this.weighingMachine_dataStitching(data);

                    let _index = 0;
                    for (let i = 0; i < _data.length; i++) {
                        if (_data[i] === 0x02) {
                            _index = i;
                            break;
                        }
                    }
                    let len = 0;
                    const line = [];
                    let line_item = [];
                    for (let i = _index; i < _data.length; i++) {
                        len++;
                        const item = _data[i];
                        line_item.push(_data[i]);
                        if (item == 0x0D || len === 17) {
                            len = 0;
                            line.push(JSON.parse(JSON.stringify(line_item)));
                            line_item = [];
                        }
                    }
                    this.weighingMachine.rawDataCache = line_item;

                    const lineData = [];
                    for (let i = 0; i < line.length; i++) {
                        const item = this.weighingMachine_parseData(line[i]);
                        if (item) {
                            lineData.push(item);
                        }
                    }
                    let res;
                    const last_time_temp = new Date();
                    for (let item of lineData) {
                        if (res) {
                            if ((typeof item.weight) === 'number') {
                                res = item;
                            }
                        } else {
                            res = item;
                        }
                        this.weighingMachine_tableRecord(item);
                        this.weighingMachine_realTimeDisplay(item);
                    }
                    this.weighingMachine.lastTime = last_time_temp;
                    if (res) {
                        this.weighingMachine.data = res;
                        this.weighingMachine.data.weightShow = this.weighingMachine.data.weight.toFixed(2);
                    }
                } catch (e) {
                    console.error(e);
                }
            },
            /**
             * 称重机数据实时显示
             */
            weighingMachine_realTimeDisplay(data) {

            },
            /**
             * 称重机数据表格充填
             */
            weighingMachine_tableRecordReal(data) {
                const that = this;
                if (this.currentData.wb) {
                    this.log('enter', 'debug', 'generationManagement', 'weighingMachine_tableRecord');
                    console.log('stableState', data.stable);
                    this.log(`stableState:${data.stable}`, 'debug', 'generationManagement', 'weighingMachine_tableRecord');
                    if (data.stable) {
                        if (data.weight > 0) {
                            // alert(data.weight);
                            console.log('currentDataIs', data);
                            this.log(`currentDataIs:${JSON.stringify(data)}`, 'debug', 'generationManagement', 'weighingMachine_tableRecord');
                            this.currentData.data.weight = data.weight;
                            // this.weighingMachine.lastTime = nowTime;
                            this.weighingMachine.tableListen = null;
                            setTimeout(() => {
                                that.weighingMachine.tableListen = that.weighingMachine_tableRecordReal
                            }, 10000);
                            this.currentData.wb = false;
                            this.resurgenceMeter_send();
                        } else {
                            this.log(`theCurrentDeviceHasNoWeight`, 'debug', 'generationManagement', 'weighingMachine_tableRecord');
                            console.warn('theCurrentDeviceHasNoWeight，giveUp');
                        }
                    } else {
                        this.log(`dataInstability，giveUp`, 'debug', 'generationManagement', 'weighingMachine_tableRecord');
                        console.warn('dataInstability，giveUp');
                    }
                }
            },
            weighingMachine_tableRecord(data) {
                if (this.weighingMachine.tableListen) {
                    this.weighingMachine.tableListen(data);
                }
            },
            weighingMachine_parseData(data) {
                if (data.length === 17) {

                    let validData = true;
                    for (let i in data) {
                        if (!data[i]) {
                            console.warn(data[i], "=无效数据，无法解析=")
                            validData = false;
                        }
                    }

                    if (validData) {
                        console.log(data, "=有效数据=")

                        const rest = {
                            weight: 0,//重量weight
                            tare: 0,//皮重tare
                            stable: true,//稳定stable
                            out: false,//超过测量范围
                        };

                        let staticA = data[1];
                        const sa = staticA % 8;

                        if ((typeof sa) !== 'number') {
                            console.error('位数数字错误')
                        }
                        let decimalPoint = Math.pow(10, 2 - sa);

                        let staticB = data[2];

                        const a4 = (staticB >> 4) % 2;// 0 --> lb 1 --> kg
                        if (a4 === 0) {
                            decimalPoint = decimalPoint * 0.4535924;
                        }
                        const a3 = (staticB >> 3) % 2;// 0 --> 稳定 1 --> 动态
                        rest.stable = a3 === 0;

                        const a2 = (staticB >> 2) % 2;// 0 --> 正常 1 --> 超过测量范围
                        if (a2 === 1) {
                            rest.out = true;
                        }
                        const a1 = (staticB >> 1) % 2;// 0 --> 正 1 --> 负
                        if (a1 === 1) {
                            decimalPoint = decimalPoint * -1;
                        }
                        const a0 = (staticB >> 0) % 2;// 0 --> 毛重 1 --> 净重
                        let staticC = data[3];


                        let w_str = '';
                        for (let i = 4; i < 10; i++) {
                            w_str = w_str + String.fromCharCode(data[i]);
                        }
                        const w_temp = parseInt(w_str);
                        if ((typeof w_temp) !== 'number') {
                            console.error('解析数字失败')
                        }
                        const w = parseInt(w_str) * decimalPoint;
                        rest.weight = w;

                        let pw_str = '';
                        for (let i = 10; i < 16; i++) {
                            pw_str = pw_str + String.fromCharCode(data[i]);
                        }
                        const pw = parseInt(pw_str) * decimalPoint;
                        rest.tare = pw;

                        const _data = {
                            raw: data.join(' '),
                            staticA: staticA,
                            staticB: staticB,
                            staticC: staticC,
                            weight: w,
                            grossWeight: pw,
                            weightUnit: a4 ? 'kg' : 'lb',
                            decimalPosition: sa,
                            originalNumber: w_str,
                        };
                        axios.post('http://171.221.202.43:34001/weightParseData', _data);
                        return rest;
                    }
                    else {
                        return null;
                    }
                }
                else {
                    this.last = data;
                    return null;
                }
            },
            /**
             * 发送原始数据，用于分析检测
             */
            weighingMachine_saveRawData(data) {
                const _data = {raw: this.weighingMachine_getRawData(data)};
                axios.post('http://171.221.202.43:34001/weightRawData', _data);
            },
            weighingMachine_getRawData(data) {
                let raw = '';
                for (let i = 0; i < data.length; i++) {
                    let _item = data[i].toString(16).toUpperCase();
                    if (_item.length === 1) {
                        _item = '0' + _item;
                    }
                    raw = raw + _item + " ";
                }
                return raw;
            },
            weighingMachine_stop() {
                if (this.weighingMachine.serialPort) {
                    this.weighingMachine.serialPort.close();
                }
            },
            resurgenceMeter_open() {
                if (this.resurgenceMeter.setting.com) {
                    const SerialPort = require('serialport');
                    const port = new SerialPort(this.resurgenceMeter.setting.com, this.resurgenceMeter.setting);
                    this.resurgenceMeter.serialPort = port;
                    port.on('data', this.resurgenceMeter_listener);
                    // this.resurgenceMeter_send();
                }
            },
            resurgenceMeter_send() {
                this.log('Resurgence meter sends data', 'debug', 'generationManagement', 'resurgenceMeter_send')
                const data = [0x01, 0x03, 0x00, 0x00, 0x00, 0x0C, 0x45, 0xCF];
                this.resurgenceMeter.rawDataCache = [];
                this.resurgenceMeter.serialPort.write(data);
            },
            resurgenceMeter_listener(data, type) {
                try {

                    this.log('resurgenceMeter_listener_enter', 'debug', 'generationManagement', 'resurgenceMeter_listener');
                    this.log(`data:${JSON.stringify(data)}\nthis.resurgenceMeter.rawDataCache:${JSON.stringify(this.resurgenceMeter.rawDataCache)}`, 'debug', 'generationManagement', 'resurgenceMeter_listener');
                    /**
                     *
                     *
                     1 3 24 48 56 45 51 49
                     45 50 48 49 56 49 56 58 53 49 48 54 51 55 49 49 46 54 48 231 130
                     *01 03 18 30 38 2D 33 31 2D 32 30 31 38 31 34 3A 31 38 30 33 38 30 31 32 2E 36 39 88 5B
                     *
                     * 01 03 18 30 38 2D 33 31 2D 32 30 31 38
                     * 31 34 3A 31 38 30 33 38 30 31 32 2E 36 39 88 5B
                     08-31-201814:18038012.69圼
                     */
                    if (!this.currentData.wb) {

                        const _data = [];
                        for (let item of  this.resurgenceMeter.rawDataCache) {
                            _data.push(item);
                        }

                        for (let item of data) {
                            if (item) {
                                _data.push(item);
                            }
                        }
                        this.log(`_data:${JSON.stringify(_data)}`, 'debug', 'generationManagement', 'resurgenceMeter_listener');

                        function getText(data, start, end) {
                            let str = '';
                            for (let i = start; i < end; i++) {
                                const c = String.fromCharCode(data[i]);
                                str = str + c;
                            }
                            return str;
                        }
                        ;
                        if (_data.length >= 29) {

                            this.log(`dataIntegrity`, 'debug', 'generationManagement', 'resurgenceMeter_listener');
                            this.resurgenceMeter.data.rus = getText(_data, 22, 27);
                            this.resurgenceMeter_setData(this.resurgenceMeter.data.rus);

                            this.resurgenceMeter.data.pack = getText(_data, 18, 22);
                            this.resurgenceMeter.data.time = moment(getText(_data, 3, 18), 'MM-DD-YYYYHH:mm').format('YYYY-MM-DD HH:mm');
                            this.resurgenceMeter.rawDataCache = [];
                            this.log(`data:${JSON.stringify(this.resurgenceMeter.data)}`, 'debug', 'generationManagement', 'resurgenceMeter_listener');
                        } else {
                            this.log(`dataNotReceived`, 'debug', 'generationManagement', 'resurgenceMeter_listener');
                            this.resurgenceMeter.rawDataCache = _data;
                        }
                    }
                } catch (e) {
                    this.log(e, 'error', 'generationManagement', 'resurgenceMeter_listener');
                }
            },
            resurgenceMeter_setData(data) {

                this.currentData.data.moistureRegain = data;
                const _data = parseFloat(data);

                // 字符位置
                const charAtStart = localStorage.getItem("charAtStart");
                // 分割线
                const charSplitBit = localStorage.getItem("charSplitBit");
                // 低字符
                const charMin = localStorage.getItem("charMin");
                // 高字符
                const charMax = localStorage.getItem("charMax");

                if (charAtStart && charSplitBit && charMin && charMax) {
                    const _charSplitBit = parseFloat(charSplitBit);
                    let char;
                    if (_data <= _charSplitBit) {
                        char = charMin;
                    } else {
                        char = charMax;
                    }
                    if (charAtStart === 'true') {
                        this.currentData.data.baleNo = char + '' + this.currentData.data.baleNo;
                    } else {
                        this.currentData.data.baleNo = this.currentData.data.baleNo + '' + char;
                    }
                }

                this.printPage();
            },
            resurgenceMeter_stop() {
                if (this.resurgenceMeter.serialPort) {
                    this.resurgenceMeter.serialPort.close();
                }
            },
            data_view_qrCodeGeneration(str) {
                const that = this;
                console.log(str);
                qrcode.toDataURL(`回潮率：${str}`, {errorCorrectionLevel: 'H'}, (err, url) => {
                    console.log('生成了二维码');
                    ;
                    that.currentData.data.url = url;
                });
            },
        },

    }
</script>
<style scoped>
    .data_show_div > .input-group__input > input {
        text-align: center !important;
    }

    .border {
        border: 2px solid black;
        position: absolute;
        /*border-radius: 4mm;*/
    }

    .data {
        position: absolute;
        font-size: 10mm !important;
        font-weight: bold;
        border-bottom: black .4mm solid;
        text-align: center;
    }

    .data_input > input {
        border-bottom: black .4mm solid;
    }

    .data_input {
        position: absolute;
        font-size: 10mm !important;
        font-weight: bold;
        /*border-bottom: black .4mm solid;*/
        text-align: center;
    }

    .en {
        position: absolute;
        font-size: 6mm !important;
    }

    .cn {
        position: absolute;
        font-size: 7mm !important;
    }

    .title {
        position: absolute;
        font-size: 11mm !important;
        font-weight: bold;
        text-align: center;
    }

    canvas {
        width: 52mm !important;
        height: 52mm !important;
    }

</style>
