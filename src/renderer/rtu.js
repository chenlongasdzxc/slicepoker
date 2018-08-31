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