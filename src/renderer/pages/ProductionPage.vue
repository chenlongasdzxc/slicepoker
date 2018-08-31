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
                                        <v-data-table :headers="table.headers" :items="table.data" >
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
    import ModbusRTU from "modbus-serial";
    import SerialPort from "serialport";

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
                rtuClient:null
            }
        },
        beforeRouteLeave(to, from, next){
            try {
                this.testStop();
                if (this.rtuClient) {
                    if (this.rtuClient.isOpen) {
                        this.rtuClient.close();
                    }
                }
            }catch (e) {

            }
            next();
        },
        mounted() {
            this.connect();
        },
        methods: {
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
            },
            initPage() {

            },
            start() {
                if (this.$refs.form.validate()) {
                    this.runtime = true;
                    this.currentData.nextBaleNo = parseInt(this.form.data.baleNo);
                    this.newData();
                }
            },
            newData() {
                const data = JSON.parse(JSON.stringify(this.form.data));
                data.baleNo = this.currentData.nextBaleNo;
                this.currentData.nextBaleNo = this.currentData.nextBaleNo + 1;
                data.moistureRegain = '等待数据';
                data.weight = '等待数据';
                this.currentData.data = JSON.parse(JSON.stringify(data));
                this.table.data.push(this.currentData.data);
                setTimeout(this.getMoistureRegain, 1000);
            },
            getWeight() {
                this.currentData.data.weight = 12.2;
                setTimeout(this.newData, 1000);
            },
            getMoistureRegain() {
                this.currentData.data.moistureRegain = 28.1;
                setTimeout(this.getWeight, 1000);
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
                    //
                    that.currentData.data.moistureRegain = 28.1;
                    that.rtuClient.close();
                });
            },
            stop() {
                this.runtime = false;
            },
            /**
             * 打开连接
             */
            connect() {
                this.rtuClient = new ModbusRTU();
                //TODO  填入回潮仪配置信息
                const openOptions={
                    baudRate: this.form.data.baudRate,
                    parity:this.form.data.parity,
                    dataBits:this.form.data.dataBits,
                    stopBits: this.form.data.stopBits
                };
                this.rtuClient.connectRTUBuffered(this.form.data.com,openOptions , this.readHoldingRegisters);
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
            loadRtu() {

            },
            loadWm() {

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
            }
        },

    }
</script>
