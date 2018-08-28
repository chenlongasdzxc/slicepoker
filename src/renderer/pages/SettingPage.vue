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
                            <v-list-tile-content class="align-end">{{test.rus}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>仪表型号:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.rus}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>软件版本 :</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.rus}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>序列号 :</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.rus}}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>


</template>
<script>
    import SerialPort from 'serialport';

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
                    rus: '',
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
            testEvent(data, type) {
                var str = '';
                for (let i = 0; i < data.length; i++) {
                    var c = String.fromCharCode(data[i]);
                    str = str + c;
                }
                console.log(str);
                this.test.rus = str;
                if (type) {
                    this.test[type] = str;
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
