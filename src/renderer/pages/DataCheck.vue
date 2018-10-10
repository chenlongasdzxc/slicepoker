<template>
    <v-container grid-list-md>
        <v-layout align-space-around justify-space-around row fill-height>
            <v-flex>
                <v-card>
                    <v-card-title class="headline">
                        数据查看
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-data-table
                        :headers="headers"
                        :items="form"
                        class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{props.item.name}}</td>
                            <td class="text-xs-left">{{props.item.id+1}}</td>
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
                 {
                     sortable: false,
                 },
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
                id: '',  //序号
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
         }
     },
     mounted(){
         this.init();
     },methods:{
         init(){
             const that =this;
             this.$http.get('http://171.221.202.43:34001/packData').then((reponse=>{
                 if (reponse.data.code == '200') {
                     that.form = reponse.data.data.content;
                 }
             }))
         },


     }
 }
</script>

<style>

</style>