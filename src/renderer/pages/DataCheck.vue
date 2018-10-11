<template>
    <v-container grid-list-md>
        <v-layout align-space-around justify-space-around row fill-height>
            <v-flex>
                <v-card>
                    <v-card-title class="headline">
                        数据查看
                        <a href="http://171.221.202.43:34001/excel">下载导出Excel</a>
                    </v-card-title>
                    <v-divider>

                    </v-divider>
                    <v-data-table
                        :headers="headers"
                        :items="form"
                        :rows-per-page-items="page.items"
                        :pagination.sync="pagination"
                        :total-items="page.total"
                        :loading="loading"
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
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>

</template>

<script>
 export default {
     data(){
         return{

             headers:[
                 {text: '序号' ,value:'id'},
                 {text: '规格dtex',value: 'specDtex'},
                 {text: '规格mm',value: 'specMm'},
                 {text: '等级',value: 'grade'},
                 {text: '批号',value: 'lotNo'},
                 {text: '包号',value: 'baleNo'},
                 {text:'净重',value:'weight'},
                 {text:'回潮率',value:'moistureRegain'},
                 {text:'创建时间',value:'createdDate'},
             ],
             form:[
                 {
                code: '',  //序号
                specDtex:'',  //规格dtex
                specMm:'', //规格MM
                grade:'', //等级
                lotNo:'', //批号
                baleNo:'', //包号
                weight:'', //净重
                moistureRegain:'', //回潮率
                createdDate:'',  //创建时间
                },
            ],
             page:{
                 items:[5,10,25],
                 total: 0,
                 size:5,
                 page:0,
             },
             loading:true,
             pagination:{},
         }
     },
     mounted(){
         this.getDataFromApi().then(data => {
             this.form = data.items
             this.page.total = data.total})
     },

     watch:{
       pagination:{
           handler () {
               this.getDataFromApi()
                   .then(data => {
                       this.form = data.items
                       this.page.total = data.total
                   })
           },
           deep: true
       }

     },

     methods:{
         aa(val){
             debugger
             return val;
         },
         getDataFromApi(){
             /*let url = 'http://171.221.202.43:34001/packData';*/
             /*let url = 'http://localhost:34001/packData';*/
             let url = 'http://171.221.202.43:34001/packData';
                const that = this;
                 this.loading = true;
                 return new Promise((resolve, reject) => {
                     const { sortBy, descending, page, rowsPerPage } = this.pagination
                     // let items = this.init();
                     // const total = items.length;
                     const params = {
                         size:rowsPerPage,
                         page:page-1,
                     }

                     that.page.size = params.size;
                     that.page.page = params.page;

                     that.$http.get(url,{params:params}).then((reponse => {
                         if (reponse.data.code == '200') {
                             resolve({
                                 items:reponse.data.data.content,
                                 total:reponse.data.data.totalElements
                             });
                             that.form = reponse.data.data.content;
                             // console.log(that.form.$index);
                             /*that.form.items.code = {(form.$index+1)+ that.params.size * that.params.page};*/
                         }
                     }))
                     // setTimeout(() => {
                     //     this.loading = false
                     //     resolve({
                     //         items,
                     //         total
                     //     })
                     // }, 1000)
                 })
             },
         },


     }

</script>

<style>

</style>