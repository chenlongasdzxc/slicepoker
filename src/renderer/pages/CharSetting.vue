<template>
    <div style="width: 100%">
        <h3>取值区间和字母设置</h3>
        <div style="width: 100%;display: flex;flex-flow: row">

            <div style="width: 3rem">
                <v-tooltip right>
                    <v-text-field slot="activator" v-model="charMin"/>
                    小于区间时候的追加的字符
                </v-tooltip>
            </div>
            <div style="flex-grow: 1">
                <v-slider v-model="charSplitBit" :step="0.1" :min="0" :max="100" thumb-label="always"></v-slider>
            </div>
            <div style="width: 3rem">
                <v-tooltip left>
                    <v-text-field slot="activator" v-model="charMax"/>
                    大于区间时候的追加的字符
                </v-tooltip>
            </div>

        </div>
        <h3>单位位置设置</h3>

        <v-layout>
            <v-flex sm6 md4 lg3>
                <v-switch :label="charAtLabel" v-model="charAtStart"></v-switch>
            </v-flex>
        </v-layout>

        <div>
            <v-btn color="success" @click.navite="save">保存</v-btn>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                charSplitBit: 0,
                charMin: '',
                charMax: '',
                charAtStart: false,
                charAtEnd: false,
            }
        },
        mounted(){
            this.initPage();
        },
        computed: {
            charAtLabel() {
                if (this.charAtStart) {
                    return '开头，包号前面';
                } else {
                    return '结尾，包号后面';
                }
            }
        },
        methods:{
            initPage(){
               const charAtStart= localStorage.getItem("charAtStart");
               const charSplitBit= localStorage.getItem("charSplitBit");
               const charMin= localStorage.getItem("charMin");
               const charMax= localStorage.getItem("charMax");

               if (charMin){
                   this.charMin = charMin;
               }
               if (charMax){
                   this.charMax = charMax;
               }
               if (charSplitBit){
                   this.charSplitBit = parseFloat(charSplitBit);
               }
               if (charAtStart){
                   this.charAtStart = charAtStart=='true';
               }
            },
            save(){
                localStorage.setItem("charAtStart",this.charAtStart);
                localStorage.setItem("charSplitBit",this.charSplitBit);
                localStorage.setItem("charMin",this.charMin);
                localStorage.setItem("charMax",this.charMax);
                alert('保存成功')
            }
        }
    }
</script>