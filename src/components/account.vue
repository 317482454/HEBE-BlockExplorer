<template>
    <el-container>
        <fhead></fhead>
        <el-main >
            <el-breadcrumb class="center" separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>账号地址</el-breadcrumb-item>
            </el-breadcrumb>
            <el-card  v-loading="loading" class="box-card center" style="margin-top: 16px">
                <div slot="header" class="clearfix">
                    <span>{{accounts.accountRS}}</span>
                </div>

                <el-form  size="mini"  label-width="100px" >
                    <el-form-item label="账号id">
                        {{accounts.account}}
                    </el-form-item>
                    <el-form-item v-if="accounts.name" label="账号名">
                        {{accounts.name}}
                    </el-form-item>
                    <el-form-item label="账号地址">
                        {{accounts.accountRS}}
                    </el-form-item>
                    <el-form-item label="账号公钥">
                        {{accounts.publicKey}}
                    </el-form-item>
                    <el-form-item label="账号余额">
                        {{$g.wallet.amount(accounts.balanceNQT)}}
                    </el-form-item>
                    <el-form-item label="锻造数量">
                        {{$g.wallet.amount(lessorsSum)}}
                    </el-form-item>
                    <el-form-item label="锻造收益">
                        {{$g.wallet.amount(accounts.forgedBalanceNQT)}}
                    </el-form-item>
                    <el-form-item v-if="accounts.description&&accounts.description!=''" label="账号描述">
                        {{accounts.description}}
                    </el-form-item>
                </el-form>

                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item v-if="accounts.currentLesseeRS" title="出租信息" name="1">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item style="margin-bottom: 0" label="承租人账号id">
                                {{accounts.currentLessee}}
                            </el-form-item>
                            <el-form-item style="margin-bottom: 0" label="承租人账号地址">
                                <router-link :to="'/account/'+accounts.currentLesseeRS">
                                    <el-button type="text"> {{accounts.currentLesseeRS}}</el-button>
                                </router-link>
                            </el-form-item>
                        </el-form>
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="出租高度">
                                <router-link :to="'/block/'+accounts.currentLeasingHeightFrom">
                                    <el-button type="text"> {{accounts.currentLeasingHeightFrom}}</el-button>
                                </router-link>
                            </el-form-item>
                            <el-form-item label="到期高度">
                                {{accounts.currentLeasingHeightTo}}
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="交易信息列表" name="2">
                        <el-table v-loading="transactionsing" :data="transactions" border style="width: 100%">
                            <el-table-column
                                    label="id"
                                    width="80">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="发送地址"
                                    width="280">
                                <template slot-scope="scope">
                                    <router-link v-if="scope.row.senderRS!=account" :to="'/account/'+scope.row.senderRS">
                                        <el-button type="text"> {{scope.row.senderRS}}</el-button>
                                    </router-link>
                                    <div v-if="scope.row.senderRS==account">
                                       本账号
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="接收地址"
                                    width="280">
                                <template slot-scope="scope">
                                    <router-link v-if="scope.row.recipientRS!=account" :to="'/account/'+scope.row.recipientRS">
                                        <el-button type="text"> {{scope.row.recipientRS}}</el-button>
                                    </router-link>
                                    <div v-if="scope.row.recipientRS==account">
                                        本账号
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="数量"
                                    width="180">
                                <template slot-scope="scope">
                                    {{$g.wallet.amount(scope.row.amountNQT)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="手续费"
                                    width="180">
                                <template slot-scope="scope">
                                    {{$g.wallet.amount(scope.row.feeNQT)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="时间"
                                    width="180">
                                <template slot-scope="scope">
                                    {{$g.wallet.formatDateTime(scope.row.timestamp*1000+($store.state.epochBeginning-500))}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button v-show="currentPageIs" @click="add" type="text">再加载15条信息</el-button>
                    </el-collapse-item>
                    <el-collapse-item v-show="lessors.length!=0" :title="'出组人列表（'+lessors.length+'人）'" name="3">
                        <el-table
                                :data="lessors"
                                border
                                style="width: 460px">
                            <el-table-column
                                    label="出租地址"
                                    width="280">
                                <template slot-scope="scope">
                                    <router-link :to="'/account/'+scope.row.lessorRS">
                                        <el-button type="text"> {{scope.row.lessorRS}}</el-button>
                                    </router-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="出租数量">
                                <template slot-scope="scope">
                                    {{$g.wallet.amount(scope.row.guaranteedBalanceNQT)}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-card>
        </el-main>
        <el-footer class="footer">
            COPYRIGHT © 2018. ALL RIGHTS RESERVED. DESIGNED BY
            <a target="_blank" href="https://hebeblock.com/">HEBEBLOCK</a>
        </el-footer>
    </el-container>
</template>


<script>
    import fhead from './fhead.vue';

    export default {
        name: 'account',
        components: {
            fhead
        },
        data () {
            return {
                loading:true,
                account:'',
                accounts:{},
                transactionsing:true,
                transactions:[],
                currentPage:1,
                currentPageIs:true,
                activeNames:[0],
                lessors:[],
                lessorsSum:0
            }
        },
        methods: {
            handleChange(val){
                if(val.toString().indexOf('2')!=-1){
                    console.log(this.transactions);
                    if(this.transactions.length==0){
                        this.transaction();
                    }
                }
            },
            add(){
                if(this.currentPageIs) {
                    this.currentPage++;
                    this.transaction();
                }
            },
            transaction(){
                this.transactionsing=true;
                this.$ajax({
                    method: 'get',
                    url: 'requestType=getBlockchainTransactions&account='+this.account+'' +
                    '&firstIndex='+(this.currentPage-1)*14+'&lastIndex='+((this.currentPage-1)*14+14),
                }).then(response => {
                    if(response.errorCode){
                        this.$alert('账号地址错误', '提示', {
                            confirmButtonText: '确定',
                        });
                    }else{
                        this.transactions=this.transactions.concat(response.transactions);
                        if(response.transactions.length!=15){
                            this.currentPageIs=false;
                        }
                        this.transactionsing=false;
                    }
                });
            },
            accountLessor(){
                this.lessors=[];
                this.lessorsSum=0;
                this.$ajax({
                    method: 'get',
                    url: 'requestType=getAccountLessors&account='+this.account,
                }).then(response => {
                    if(response.errorCode){
                        this.$alert('账号地址错误', '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                    else{
                        this.lessors=response.lessors;
                        this.lessors.forEach(item=>{
                            this.lessorsSum=this.lessorsSum+parseInt(item.guaranteedBalanceNQT);
                        })
                    }
                });
            },
            load(){
                this.activeNames=[0];
                this.currentPageIs=true;
                this.currentPage=1;
                this.transactions=[];
                this.account=this.$route.params.account;
                if(!this.account){
                    this.$router.replace('/');
                }
                this.loading=true;
                this.accountLessor();
                this.$ajax({
                    method: 'get',
                    url: 'requestType=getAccount&account='+this.account,
                }).then(response => {
                    if(response.errorCode){
                        this.$alert('账号地址错误', '提示', {
                            confirmButtonText: '确定',
                        });
                    }
                    else{
                        this.accounts=response;
                        this.loading=false;
                    }
                });
            }
        },
        mounted: function () {
            this.load();
        },
        watch: {
            '$route' (to, from) {
                this.load()
            }
        }
    }
</script>


<style scoped>
</style>  