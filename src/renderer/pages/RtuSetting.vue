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
                            <v-list-tile-content>回潮率:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.rus}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>时间:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.time}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>包号:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.pack}}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>


</template>
<script>
    import SerialPort from 'serialport';
    import moment from 'moment';

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
                    send:'',
                    serialPort: null,
                    rus: '',
                    pack: '',
                    time: '',
                    readTemp:[],
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
                localStorage.setItem("rtu", JSON.stringify(this.form.data));
            },
            init() {
                this.initComList();
                const rtu = localStorage.getItem("rtu");
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
                this.test.pack = '';
                this.test.time = '';
            },
            testEvent(data, type) {
                /**
                 *
                 *
                 1 3 24 48 56 45 51 49
                 45 50 48 49 56 49 56 58 53 49 48 54 51 55 49 49 46 54 48 231 130
                 *01 03 18 30 38 2D 33 31 2D 32 30 31 38 31 34 3A 31 38 30 33 38 30 31 32 2E 36 39 88 5B
                 * 1 3 18 30 39 2d 30 37 2d 32 30 31 38 30 39 3a 31 36 30 30 38 37 30 39
                 *
                 * 01 03 18 30 38 2D 33 31 2D 32 30 31 38
                 * 31 34 3A 31 38 30 33 38 30 31 32 2E 36 39 88 5B
                 08-31-201814:18038012.69圼
                 */

                const _data = [];
                for(let item of this.test.readTemp) {
                    _data.push(item);
                }

                for(let item of data) {
                    if(item) {
                        _data.push(item);
                    }
                }

                function getText(data, start, end) {
                    let str = '';
                    for (let i = start; i < end; i++) {
                        const c = String.fromCharCode(data[i]);
                        str = str + c;
                    }
                    return str;
                }

                if (_data.length >= 29) {
                    this.test.rus = getText(_data, 22, 27);
                    this.test.pack = getText(_data, 18, 22);
                    this.test.time = moment(getText(_data, 3, 18), 'MM-DD-YYYYHH:mm').format('YYYY-MM-DD HH:mm');
                    this.test.readTemp = [];
                }else{
                    this.test.readTemp = _data;
                }

            },
            testClient() {
                const that = this;
                const SerialPort = require('serialport');
                const port = new SerialPort(that.form.data.com, that.form.data);
                this.test.serialPort = port;
                port.on('data', this.testEvent);
                this.testSend('I2');
            },
            testSend(str) {
                const data = [0x01,0x03,0x00,0x00,0x00,0x0C,0x45,0xCF];
                this.test.send = data.join(' ');
                this.test.serialPort.write(data);
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
