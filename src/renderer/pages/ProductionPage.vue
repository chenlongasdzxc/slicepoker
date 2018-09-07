<template>
    <v-layout row wrap justify-center id="wrapper">
        <v-flex xs10 class="mt-4">
            <v-container grid-list-md>
                <v-layout row wrap v-if="checkDevice()">
                    <v-flex xs12 sm6 md8 lg9 xl10>
                        <v-layout column>
                            <v-flex>
                                <v-card>
                                    <v-card-title>基本信息</v-card-title>
                                    <v-divider></v-divider>
                                    <v-container grid-list-md>
                                        <v-form ref="form" v-model="form.valid">
                                            <v-layout wrap>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" type="number"
                                                                  v-model="form.data.specDtex" label="规格"
                                                                  :disabled="runtime" suffix="dtex"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" v-model="form.data.specMm"
                                                                  suffix="mm" label="规格" type="number"
                                                                  :disabled="runtime"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" v-model="form.data.lotNo"
                                                                  label="大批号" :disabled="runtime"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" v-model="form.data.grade"
                                                                  label="等级" :disabled="runtime"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" v-model="form.data.no"
                                                                  label="编号" :disabled="runtime"></v-text-field>
                                                </v-flex>
                                                <v-flex xs12 sm6 md4 lg3 xl2>
                                                    <v-text-field :rules="form.requireRules" v-model="form.data.baleNo"
                                                                  label="起始包号" type="number"
                                                                  :disabled="runtime"></v-text-field>
                                                </v-flex>
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

                                        </v-form>
                                    </v-container>
                                </v-card>
                            </v-flex>
                            <v-flex>
                                <v-card>
                                    <v-card-title>数据回显</v-card-title>
                                    <v-divider></v-divider>
                                    <v-container>
                                        <v-data-table :headers="table.headers" :items="table.data">
                                            <template slot="no-data">
                                                暂无数据！
                                            </template>
                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.baleNo }}</td>
                                                <td>{{ props.item.moistureRegain }}</td>
                                                <td>{{ props.item.weight }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-container>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 sm6 md4 lg3 xl2>
                        <DeviceStatus :drivers="drivers"/>
                    </v-flex>
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
                    {name: '模板一', path: '/printer/p1'},
                    {name: '模板二', path: '/printer/p2'},
                    {name: '模板三', path: '/printer/p3'},
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
            },
            start() {
                if (this.$refs.form.validate()) {
                    this.runtime = true;
                    this.currentData.nextBaleNo = parseInt(this.form.data.baleNo);
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
                this.currentData.data = JSON.parse(JSON.stringify(data));
                this.currentData.wb = true;
                this.table.data.push(this.currentData.data);
            },
            stop() {
                this.runtime = false;
                this.weighingMachine_stop();
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
                    specDtex: 1.33,
                    specMm: 51,
                    grade: 'A',
                    weight: 27,
                    lotNo: 1234,
                    baleNo: 12,
                    moistureRegain: 28.1,
                    printerName: this.printerName,
                    backPath: '/product',
                };
                var url = this.printerTemplate;
                var params = '';
                for (var key in data) {
                    params = params + `${key}=${data[key]}&`
                }
                url = `${url}?${params}`;
                url = url.substr(0, url.length - 1);
                // window.open(url);
                const pushData = {path: this.printerTemplate, query: data};
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
                    for (let i = 0; i < lineData.length; i++) {
                        const item = lineData[i];
                        if (res) {
                            if ((typeof item.weight) === 'number') {

                                res = item;
                                // if (item.weight > 0.01) {
                                //
                                //     if (!item.out) {
                                //         if (last_time_temp && this.weighingMachine.lastTime &&
                                //             last_time_temp.getTime() - this.weighingMachine.lastTime.getTime() < 200) {
                                //             if (item.weight !== -.5) {
                                //                 if (res.weight === .5) {
                                //                     res = item;
                                //                 }
                                //                 if (item.stable) {
                                //                     res = item;
                                //                 }
                                //             }
                                //         } else {
                                //             if (item.stable) {
                                //                 res = item;
                                //             }
                                //         }
                                //     }
                                // }
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
                //TODO 数据实时显示
                debugger;
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

                this.newData();
            },
            resurgenceMeter_stop() {
                if (this.resurgenceMeter.serialPort) {
                    this.resurgenceMeter.serialPort.close();
                }
            },
        },

    }
</script>
