<template>
    <v-container grid-list-md>
        <v-card class="cardsearch">
            <span>选择时间：</span>
            <el-date-picker
                    v-model="valuetime"
                    type="datetimerange"
                    align="right"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
            ></el-date-picker>
            <span>选择批号范围:</span>
            <el-input
                    v-model="forms.lotNoStart"
                    size="mini"
                    class="lotNo"
            ></el-input>
            <span>至</span>
            <el-input
                    v-model="forms.lotNoEnd"
                    size="mini"
                    class="lotNo"
            ></el-input>
            <el-button @click="show"
                       type="primary"
                       icon="el-icon-search"
                       size="mini"
                       :disabled="!canSearch"
            >搜索
            </el-button>
            <el-button
                    @click="downloadExcel"
                    type="primary"
                    size="mini"
                    icon="el-icon-download"
            >下载数据
            </el-button>

        </v-card>
        <v-layout align-space-around row fill-height>
            <v-flex>


                <v-card>
                    <v-card-title class="headline">
                        数据查看
                        <!--<a href="http://171.221.202.43:34001/excel">下载导出Excel</a>-->
                    </v-card-title>
                    <v-divider>
                    </v-divider>
                    <v-data-table
                            :headers="headers"
                            :items="form"
                            :rows-per-page-items="page.items"
                            :pagination.sync="pagination"
                            :total-items="page.total"
                            class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{props.index+1 + page.page*page.size}}</td>
                            <td class="text-xs-left">{{props.item.specDtex}}</td>
                            <td class="text-xs-left">{{props.item.specMm}}</td>
                            <td class="text-xs-left">{{props.item.grade}}</td>
                            <td class="text-xs-left">{{props.item.lotNo}}</td>
                            <td class="text-xs-left">{{props.item.baleNo}}</td>
                            <td class="text-xs-left">{{props.item.weight}}</td>
                            <td class="text-xs-left">{{props.item.moistureRegain}}</td>
                            <td class="text-xs-left">{{props.item.createdDate}}</td>
                        </template>

                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                                没有数据，请输入条件进行搜索或直接点击搜索查询所有数据：）
                            </v-alert>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>

</template>

<script>

    import monent from 'moment';

    export default {
        data() {
            return {

                headers: [
                    {text: '序号', value: 'id'},
                    {text: '规格dtex', value: 'specDtex'},
                    {text: '规格mm', value: 'specMm'},
                    {text: '等级', value: 'grade'},
                    {text: '批号', value: 'lotNo'},
                    {text: '包号', value: 'baleNo'},
                    {text: '净重', value: 'weight'},
                    {text: '回潮率', value: 'moistureRegain'},
                    {text: '创建时间', value: 'createdDate'},
                ],
                form: [],
                forms: {
                    lotNoStart: '',
                    lotNoEnd: '',
                },

                params: {
                    createdDateStart: '',
                    createdDateEnd: '',
                },
                valuetime: [
                    {
                        createdDateStart: '',
                        createdDateEnd: '',
                    }
                ],
                page: {
                    items: [25],
                    total: 0,
                    size: 5,
                    page: 0,
                },
                pagination: {
                    descending: false,
                    page: 1,
                    rowsPerPage: 25,
                    sortBy: "id",
                    totalItems: 1
                },
                canSearch:false,
            }
        },
        mounted(){
            const that =this;
            setTimeout(()=>{
                that.canSearch = true;
            },1000);
        },
        watch: {
            valuetime(val) {
                console.log(val);
                this.params.createdDateStart = monent(val[0]).format('YYYY-MM-DD HH:mm:ss');
                this.params.createdDateEnd = monent(val[1]).format('YYYY-MM-DD HH:mm:ss');
                console.log(this.params.createdDateStart);
                console.log(this.params.createdDateEnd);
            },

            pagination() {
                if(this.canSearch) {
                    this.getDataFromApi()
                        .then(data => {
                            this.form = data.items
                            this.page.total = data.total
                        })
                }
            }
        },


        methods: {

            getDataFromApi() {
                /*let url = 'http://171.221.202.43:34001/packData';*/
                let url = 'http://localhost:34001/pageList';
                /*let url = 'http://171.221.202.43:34001/packData';*/
                const that = this;
                return new Promise((resolve, reject) => {
                    const {sortBy, descending, page, rowsPerPage} = this.pagination
                    // let items = this.init();
                    // const total = items.length;
                    const params = {
                        size: rowsPerPage,
                        page: page - 1,
                        ...this.params,
                        ...this.forms,
                    }
                    that.page.size = params.size;
                    that.page.page = params.page;
                    that.$http.get(url, {params: params}).then((reponse => {
                        if (reponse.data.code == '200') {
                            resolve({
                                items: reponse.data.data.content,
                                total: reponse.data.data.totalElements
                            });
                        }
                    }))

                })
            },

            show() {
                const that = this;
                that.getDataFromApi().then(data => {
                    console.log(this.valuetime)
                    this.form = data.items;
                    this.page.total = data.total;
                })
            },

            downloadExcel() {
                /*let urls = 'http://171.221.202.43:34001/excel';*/
                let urls = 'http://localhost:34001/excel'
                let dateInfo = 'createdDateStart=' + this.params.createdDateStart + '&createdDateEnd=' + this.params.createdDateEnd
                let lotNoInfo = '&lotNoStart=' + this.forms.lotNoStart + '&lotNoEnd=' + this.forms.lotNoEnd
                /* console.log(urls+'?'+dateInfo+lotNoInfo);*/
                window.location.href = urls + '?' + dateInfo + lotNoInfo;

            },

        }
    }


</script>

<style>
    .lotNo {
        width: 10%;
    }

</style>