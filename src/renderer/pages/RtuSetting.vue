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
                            <v-btn color="blue" @click.native="save" >保存配置</v-btn>
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
                            <v-btn @click.native="checkConnect" color="blue">连接测试</v-btn>
                            <!--<v-btn @click.native="testStop" color="red">测试停止</v-btn>-->
                        </v-flex>
                        <v-list-tile>
                            <v-list-tile-content>日期:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.date}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>时间:</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.time}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>数据1 :</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.data1}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-content>数据2 :</v-list-tile-content>
                            <v-list-tile-content class="align-end">{{test.data2}}</v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>


</template>
<script>
    import ModbusRTU from "modbus-serial";
    import SerialPort from "serialport";

    export default {
        data() {
            return {
                form: {
                    data: {
                        com: 'COM1',//端口
                        baudRate: 9600,//波特率
                        parity: 'none',//校验位
                        dataBits: 8,//数据位
                        stopBits: 2,//停止位
                    },
                    default: {
                        com: 'COM1',//端口
                        baudRate: 9600,//波特率
                        parity: 'none',//校验位
                        dataBits: 8,//数据位
                        stopBits: 2,//停止位
                    },
                },
                comList: [],
                inputComponents: {
                    comList: [],//当前已有端口
                    rateList: [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200],//波特率
                    parityList: ['none', 'odd', 'even', 'mark', 'space'],//校验位
                    dataList: [5, 6, 7, 8],//数据位
                    stopList: [1, 2],//停止位
                },
                printers: [],
                printerName: '',
                client: null,
                test: {
                    serialPort: null,
                    rus: '',
                    data1: null, data2: null, time: null, date: null
                }
            }
        },
        beforeRouteLeave(to, from, next){
            try {
                if (this.client) {
                    if (this.client.isOpen) {
                        this.client.close();
                    }
                }
            }catch (e) {

            }
            next();
        },
        mounted() {
            const that = this;
            this.init();
        }, methods: {
            save(){
                localStorage.setItem("rtu",JSON.stringify(this.form.data));
            },
            init() {
                this.initComList();
                const rtu = localStorage.getItem("rtu");
                if(rtu){
                    this.form.data = JSON.parse(rtu);
                }
            },
            initComList() {
                const that = this;
                SerialPort.list().then(data => {
                    that.inputComponents.comList = data;
                }).catch();
            },
            /**
             *  检查连接
             */
            checkConnect() {
                if (this.client) {
                    if (this.client.isOpen) {
                        this.readHoldingRegisters();
                    } else {
                        this.connect();
                    }
                } else {
                    this.connect();
                }
            },
            /**
             * 打开连接
             */
            connect() {
                this.client = new ModbusRTU();
                const openOptions={
                    baudRate: this.form.data.baudRate,
                    parity:this.form.data.parity,
                    dataBits:this.form.data.dataBits,
                    stopBits: this.form.data.stopBits
                }
                this.client.connectRTUBuffered(this.form.data.com,openOptions , this.readHoldingRegisters);
            },
            /**
             * 数据回显
             */
            read(data) {
                const that = this;
                this.test = JSON.parse(JSON.stringify(data));
                setTimeout(()=>{
                    that.client.close();
                },3000);
            },
            /**
             * 读取数据
             */
            readHoldingRegisters() {
                const that = this;
                this.client.setID(1);
                this.client.readHoldingRegisters(561, 12).then(data => {
                    var str = '';
                    for (let i = 0; i < data.buffer.length; i++) {
                        var c = String.fromCharCode(data.buffer[i]);
                        str = str + c;
                    }
                    const obj = {
                        date: str.substr(0, 10),
                        time: str.substr(10, 5),
                        data1: str.substr(15, 4),
                        data2: str.substr(19, 5),
                        data3: parseFloat(str.substr(19, 5).replace('\'', '.'))
                    };
                    that.read(obj);
                });
            }
        }
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
