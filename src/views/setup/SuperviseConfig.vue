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
                                            <td>Supervisor</td>
                                            <td>
                                                <select v-model="superviseConfigBn.supervisor" >
                                                    <option v-bind:value="-1" >--select--</option>
                                                    <option v-for="u in userList" v-bind:value="u.id" >{{u.userEmail}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Installer</td>
                                            <td>
                                                <select v-model="superviseConfigBn.installer" >
                                                    <option v-bind:value="-1" >--select--</option>
                                                    <option v-for="u in userList" v-bind:value="u.id" >{{u.userEmail}}</option>
                                                </select>
                                            </td>
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
                                        <tr v-for="(sc,i) in superviseConfigBnList" >
                                            <td>{{i+1}}</td>
                                            <td>{{sc.supervisorEmail}}</td>
                                            <td>{{sc.installerEmail}}</td>
                                            <td><i class="fas fa-edit" v-on:click="setUpdateData(sc)" ></i></td>
                                            <td><i class="fas fa-trash" ></i></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="superviseConfigBn.id===-1" class="my-btn" v-on:click="verifyInput('create')" >Save</button>
                                <button v-else class="my-btn" v-on:click="verifyInput('update')" >Update</button>
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
        name: "SuperviseConfig",
        components: {TableHead, Notification},
        mounted() {
            this.getInitData();
            console.log(CookieManager.getParsedData("userInfo").id);
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                tabButtons : ['Supervise config','Supervise config list'],
                selectedTab : 0,
                superviseConfigBnList : [],
                userList : [],
                superviseConfigBn : {
                    id : -1,
                    installer : -1,
                    installerName : '',
                    installerEmail : '',
                    supervisor : -1,
                    supervisorName : '',
                    supervisorEmail : '',
                    modifiedBy : CookieManager.getParsedData("userInfo").id
                },
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'Supervisor',
                        sortBy : 'supervisorEmail',
                    },
                    {
                        name : 'Installer',
                        sortBy : 'installerEmail',
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
                needToCloseNotification : true
            }
        },
        methods:{
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            setTableData(list){
                this.superviseConfigBnList = list;
            },
            verifyInput(which){

                if (which === 'create'){

                    this.create();

                } else if (which === 'update') {

                    this.update();

                }

            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/supervise-config/get-init-data",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                }).then(res=>{

                        // console.log(JSON.stringify(res.data));
                        this.userList = res.data.userList;

                        if (res.data.code===200){

                            this.$refs.th.setComTableData(res.data.superviseConfigBnList);

                            if (this.needToCloseNotification){this.$refs.noti.closeNotification();}

                        } else {

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

                        console.log(JSON.stringify(err));

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
            setUpdateData(sc){
                this.selectedTab = 0;
                this.superviseConfigBn.id = sc.id;
                this.superviseConfigBn.supervisor = sc.supervisor;
                this.superviseConfigBn.installer = sc.installer;
            },
            create(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/supervise-config/create",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    },
                    superviseConfigBn : this.superviseConfigBn
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.getInitData();
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code,
                            needOk : true
                        });

                    } else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.create,
                            code : res.data.code,
                        });

                    }

                })
                .catch(err=>{

                    console.log(JSON.stringify(err));

                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.create,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                });

            },
            update(){

            },
            reset(){

                this.superviseConfigBn.id = -1;
                this.superviseConfigBn.installer = -1;
                this.superviseConfigBn.supervisor = -1;

            }

        }
    }
</script>

<style scoped>

</style>
