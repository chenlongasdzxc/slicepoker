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
                                        <v-data-table :headers="table.headers" :items="table.data" hide-actions>
                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.name }}</td>
                                                <td class="text-xs-right">{{ props.item.calories }}</td>
                                                <td class="text-xs-right">{{ props.item.fat }}</td>
                                                <td class="text-xs-right">{{ props.item.carbs }}</td>
                                                <td class="text-xs-right">{{ props.item.protein }}</td>
                                                <td class="text-xs-right">{{ props.item.iron }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-container>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>

                    <v-flex xs12 sm6 md4 lg3 xl2>
                        <v-card>
                            <v-card-title>设备状态</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-layout wrap column>
                                    <v-flex
                                            v-for="item in drivers"
                                            :key="item.name"
                                    >
                                        <v-card>
                                            <v-card-title><h4>{{ item.name }}</h4></v-card-title>
                                            <v-divider></v-divider>
                                            <v-list dense>
                                                <v-list-tile>
                                                    <v-list-tile-content>状态:</v-list-tile-content>
                                                    <v-list-tile-content v-if="item.open" class="align-end">在线
                                                    </v-list-tile-content>
                                                    <v-list-tile-content v-if="!item.open" class="align-end">不在线
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-content>实时数据:</v-list-tile-content>
                                                    <v-list-tile-content class="align-end">{{ item.rep }}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row wrap v-if="!checkDevice()">
                    <v-flex>
                        <v-card>
                            <v-card-title>物理设备状态</v-card-title>
                            <v-divider></v-divider>
                            <v-container>
                                <v-layout wrap column>
                                    <v-flex
                                            v-for="item in drivers"
                                            :key="item.name"
                                    >
                                        <v-card>
                                            <v-card-title><h4>{{ item.name }}</h4></v-card-title>
                                            <v-divider></v-divider>
                                            <v-list dense>
                                                <v-list-tile>
                                                    <v-list-tile-content>状态:</v-list-tile-content>
                                                    <v-list-tile-content v-if="item.hasBeenSet" class="align-end">已经配置
                                                    </v-list-tile-content>
                                                    <v-list-tile-content v-if="!item.hasBeenSet" class="align-end">没有配置
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile v-if="item.hasBeenSet && item.name==='打印机'">
                                                    <v-list-tile-content>设备名称:</v-list-tile-content>
                                                    <v-list-tile-content v-if="item.hasBeenSet" class="align-end">
                                                        {{item.data.name}}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile v-if="item.hasBeenSet && item.name!=='打印机'">
                                                    <v-list-tile-content>连接端口:</v-list-tile-content>
                                                    <v-list-tile-content v-if="item.hasBeenSet" class="align-end">
                                                        {{item.data.com}}
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>
<script>
    // import ModbusRTU from "modbus-serial";
    // import SerialPort from "serialport";

    var ModbusRTU ={};
    var SerialPort ={};

    export default {
        name: 'production',
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
                        {text: '净重', value: 'wg'},
                        {text: '回潮率', value: 'hc'},
                    ]
                },
                currentData: {

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
                }
            }
        },
        mounted() {

        },
        methods: {
            initPage() {

            },
            start() {
                if (this.$refs.form.validate()) {
                    this.runtime = true;
                }
            },
            stop() {
                this.runtime = false;
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
                console.log(url);
                // window.open(url);
                const pushData = {path: this.printerTemplate, query: data};
                console.log(pushData)
                this.$router.push(pushData)
                // ipcRenderer.send('printPage',this.printerName);
            }
        },

    }
</script>
<style scoped>

</style>