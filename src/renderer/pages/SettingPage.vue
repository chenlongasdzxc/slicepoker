<template>
    <v-container grid-list-md>
        <v-layout align-space-around justify-space-around row fill-height>
            <v-flex xs12 sm6>
                <v-card>
                    <v-card-title class="headline">
                        参数配置
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-layout row wrap class="pa-3">
                        <v-flex xs12 sm6 class="item">
                            <v-select
                                    v-model="form.data.com"
                                    :items="inputComponents.comList"
                                    item-text="comName"
                                    item-value="comName"
                                    label="端口"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 class="item">
                            <v-select
                                    v-model="form.data.baudRate"
                                    :items="inputComponents.rateList"
                                    label="波特率"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 class="item">
                            <v-select
                                    v-model="form.data.parity"
                                    :items="inputComponents.parityList"
                                    label="检验位"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 class="item">
                            <v-select
                                    v-model="form.data.dataBits"
                                    :items="inputComponents.dataList"
                                    label="数据位"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 class="item">
                            <v-select
                                    v-model="form.data.stopBits"
                                    :items="inputComponents.stopList"
                                    label="停止位"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 class="item">
                            <v-btn color="blue" @click.native="save">保存配置</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6>
                <v-card>
                    <v-card-title class="headline">
                        串口测试
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list dense>
                        <v-flex class="item">
                            <v-btn @click.native="testClient" color="blue">连接测试</v-btn>
                            <v-btn @click.native="testStop" color="red">测试停止</v-btn>
                        </v-flex>
                        <v-list-tile>
                            <v-list-tile-content>实时响应:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.res.weightShow}} KG</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>超出范围:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.res.out}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>稳定 :</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.res.stable}}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>


</template>
<script>
    import SerialPort from 'serialport';
    import axios from 'axios';

    export default {
        data() {
            return {
                form: {
                    data: {
                        com: 'COM1',//端口
                        baudRate: 9600,//波特率
                        parity: 'none',//校验位
                        dataBits: 8,//数据位
                        stopBits: 1,//停止位
                    },
                    default: {
                        com: 'COM1',//端口
                        rate: 9600,//波特率
                        parity: 'none',//校验位
                        data: 8,//数据位
                        stop: 1,//停止位
                    },
                },
                inputComponents: {
                    comList: [],//当前已有端口
                    rateList: [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200],//波特率
                    parityList: ['none', 'odd', 'even', 'mark', 'space'],//校验位
                    dataList: [5, 6, 7, 8],//数据位
                    stopList: [1, 2],//停止位
                },
                test: {
                    serialPort: null,
                    resData: '',
                    res:
                        {
                            weight: 0,//重量weight
                            tare: 0,//皮重tare
                            stable: true,//稳定stable
                            out: false,//超过测量范围
                            weightShow: "",
                        },
                    last: [],
                    w_str:'',
                    lastTime: null,
                },
            }
        },
        beforeRouteLeave(to, from, next) {
            try {
                this.testStop();
            } catch (e) {

            }
            next();
        },
        mounted() {
            this.init();
        }, methods: {
            save() {
                localStorage.setItem("weighMachine", JSON.stringify(this.form.data));
            },
            init() {
                this.initComList();
                const rtu = localStorage.getItem("weighMachine");
                if (rtu) {
                    this.form.data = JSON.parse(rtu);
                }
            },
            initComList() {
                const that = this;
                SerialPort.list().then(data => {
                    that.inputComponents.comList = data;
                }).catch();
            },
            testStop() {
                this.test.serialPort.close();
                this.test.rus = '';
            },
            getRawData(data){
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
            /**
             * 发送原始数据，用于分析检测
             */
            saveRawData(data) {
                const _data = {raw: this.getRawData(data)};
                axios.post('http://171.221.202.43:34001/weightRawData', _data);
            },
            /**
             * 数据拼接
             * 拼接多次的数据报文
             */
            dataStitching(data){
                const _data = [];
                for (let i = 0; i < this.test.last.length; i++) {
                    _data.push(this.test.last[i]);
                }

                for (let i = 0; i < data.length; i++) {
                    _data.push(parseInt(data[i].toString()));
                }
                return _data;
            },
            /**
             * 02    3B    33    20    20    20    20    20    30    35    20    20    20    20    30    35    0D
             * @param data
             * @param type
             */
            testEvent(data, type) {
                try {
                    //发送原始数据
                    this.saveRawData(data);
                    //数据拼装
                    const _data = this.dataStitching(data);

                    let _index = 0;
                    for (let i = 0; i < _data.length; i++) {
                        if (_data[i] === 0x02) {
                            _index = i;
                            break;
                        }
                        // var c = String.fromCharCode(data[i]);
                        // str = str + c;
                    }

                    let len = 0;

                    const line = [];
                    let line_item = [];
                    console.log(_data);
                    for (let i = _index; i < _data.length; i++) {
                        len++;
                        const item = _data[i];
                        line_item.push(_data[i]);
                        if(item==0x0D || len === 17) {
                            len = 0;
                            line.push(JSON.parse(JSON.stringify(line_item)));
                            line_item = [];
                        }
                    }

                    this.test.last = line_item;

                    const lineData = [];
                    for (let i = 0; i < line.length; i++) {
                        const item = this.parseData(line[i]);
                        if(item) {
                            lineData.push(item);
                        }
                    }


                    let res;
                    const last_time_temp = new Date();
                    for (let i = 0; i < lineData.length; i++) {
                        const item = lineData[i];
                        if (res) {
                            if ((typeof item.weight) === 'number') {

                                if (item.weight > 0.01) {
                                    if (!item.out) {
                                        if (last_time_temp && this.test.lastTime &&
                                            last_time_temp.getTime() - this.test.lastTime.getTime() < 200) {
                                            if (item.weight !== -.5) {
                                                if (res.weight === .5) {
                                                    res = item;
                                                }
                                                if (item.stable) {
                                                    res = item;
                                                }
                                            }
                                        } else {
                                            if (item.stable) {
                                                res = item;
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            res = item;
                        }
                    }

                    this.test.lastTime = last_time_temp;
                    this.test.res = res;
                    this.test.res.weightShow = this.test.res.weight.toFixed(2);
                    debugger;

                    // console.log(str);  [14] ./node_modules/electron-devtools-installer/dist/utils.js 1.93 kB {0} [built]
                    // this.test.rus = str;
                    // if (type) {
                    //     this.test[type] = str;
                    // }
                } catch (e) {
                }
            },

            parseData(data) {
                if (data.length === 17) {

                    let validData = true;
                    for(let i in data){
                        if(!data[i]){
                            console.log(data[i],"=测试=")
                            validData = false;
                        }
                    }

                    if(validData) {
                        console.log(data, "=data=")

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
                        this.test.w_str = (typeof w_temp);
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
                    else{
                        return null;
                    }
                }
                else {
                    this.last = data;
                    return null;
                }
            },

            testClient() {

                const that = this;
                const SerialPort = require('serialport');
                const port = new SerialPort(that.form.data.com, that.form.data);
                that.lastTime = new Date();
                this.test.serialPort = port;
                port.on('data', this.testEvent);
                this.testSend('I2');
            },
            testSend(str) {
                str = str.toUpperCase();
                str = str + String.fromCharCode(0x20);
                str = str + String.fromCharCode(0x0D);
                str = str + String.fromCharCode(0x0A);
                this.test.serialPort.write(str);
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
