<template>
    <div class="vue-template" >
        <div class="vue-template" >
            <div class="container-fluid" >
                <div class="row" >
                    <div class="col-sm-12" >
                        <div class="my-tab" >
                            <div class="my-tab-head" >
                                <button v-bind:class="{active : selectedTab === i}" v-for="(tb,i) in tabButtons" v-on:click="tabBtnClickListener(i)" >{{tb}}</button>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-body" >
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td><input type="text" v-model="costBreakDownBn.name" /></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===1" class="my-tab-body" >
                                <div class="my-tab-100" >
                                    <table class="my-tbl" >
                                        <table-head
                                                ref="th"
                                                :row-par-page="5"
                                                :header-name-list="headerNameList"
                                                :set-table-data="setTableData" >
                                        </table-head>
                                        <tbody>
                                        <tr v-for="(cl,i) in costBreakDownList" >
                                            <td>{{i+1}}</td>
                                            <td>{{cl.name}}</td>
                                            <td><i class="fas fa-edit" v-on:click="setUpdateData(cl)" ></i></td>
                                            <td><i class="fas fa-trash" ></i></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="costBreakDownBn.id===-1" class="my-btn" v-on:click="verifyInput('saveCostBreakDown')" >Save</button>
                                <button v-else class="my-btn" v-on:click="update" >Update</button>
                                <button class="my-btn" v-on:click="reset" >Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import Notification from "../notificaiton/Notification";
    import CookieManager from "../../Helper/CookieManager";
    import TableHead from "../../common/TableHead";

    export default {
        name: "CostBreakDown",
        components: {TableHead, Notification},
        mounted(){
            this.getInitData();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                tabButtons : ['Create cost break down','Cost break down list'],
                selectedTab : 0,
                costBreakDownBn :{
                    id : -1,
                    name : '',
                    modifiedBy : CookieManager.getParsedData("userInfo").id,
                },
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'Name',
                        sortBy : 'name',
                    },
                    {
                        name : 'Edit',
                        sortBy : '',
                    },
                    {
                        name : 'Delete',
                        sortBy : '',
                    }
                ],
                costBreakDownList : [],
                needToCloseNotification : true
            }
        },
        methods:{
            setTableData(list){
                this.costBreakDownList = list;
                // console.log(JSON.stringify(list));
            },
            verifyInput(which){
                if (which==='saveCostBreakDown'){
                    if (this.costBreakDownBn.name===''){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Name field required !'
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Would you like to submit ?',
                            callBackMethod : this.saveCostBreakDown,
                            needConfirmation : true
                        });
                    }
                }
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.get(this.url+"/cost-break-down/get-inti-data")
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.$refs.th.setComTableData(res.data.costBreakDownList);
                            if (this.needToCloseNotification){this.$refs.noti.closeNotification();}

                        } else {

                            alert("hi");

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.getInitData,
                                code : res.data.code,
                            });

                        }

                    })
                    .catch(err=>{

                        alert("hi");

                        console.log(err);

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            code : err.response.data.status
                        });

                    });

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            saveCostBreakDown(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/cost-break-down/save",{
                    costBreakDownBn : this.costBreakDownBn,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.getAllCostBreakDown();
                        this.reset();
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            needOk : true,
                            code : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.saveCostBreakDown,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                });

            },
            reset(){
                this.costBreakDownBn.id = -1;
                this.costBreakDownBn.name = '';
                this.selectedTab = 0;
            },
            update(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/cost-break-down/update",{
                    costBreakDownBn : this.costBreakDownBn,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.getAllCostBreakDown();
                        this.reset();
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            needOk : true,
                            code : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.update,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.update,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                });

            },
            setUpdateData(cl){
                this.selectedTab = 0;
                this.costBreakDownBn.id = cl.id;
                this.costBreakDownBn.name = cl.name;
            }
        }
    }
</script>

<style scoped>

</style>
