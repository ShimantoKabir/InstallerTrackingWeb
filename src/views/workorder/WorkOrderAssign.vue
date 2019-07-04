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
                                            <td>Work order</td>
                                            <td>
                                                <select v-model="woAssign.woId" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="wl in workOrderList" v-bind:value="wl.id" >{{wl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Department</td>
                                            <td>
                                                <select v-on:change="departmentChange(woAssign.deptOid)" v-model="woAssign.deptOid" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-bind:value="d.oId" v-for="d in departmentBnList" >{{d.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Assign to</td>
                                            <td>
                                                <select v-model="woAssign.assignPos" v-on:change="userChange()" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-bind:value="i" v-for="(u,i) in userList" >{{u.userEmail}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr v-if="woAssign.assignUserName" >
                                            <td></td>
                                            <td style="color: red" >{{woAssign.assignUserName}}</td>
                                        </tr>
                                        <tr>
                                            <td>Date</td>
                                            <td><input type="date" v-model="woAssign.assignDate" /></td>
                                        </tr>
                                        <tr>
                                            <td>Time</td>
                                            <td><input type="time" v-model="woAssign.assignTime" /></td>
                                        </tr>
                                        <tr>
                                            <td>Scope</td>
                                            <td>
                                                <textarea v-model="woAssign.scope" ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Remark</td>
                                            <td>
                                                <textarea v-model="woAssign.remark" ></textarea>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style="color: green" colspan="2" >Cost break down</td>
                                            </tr>
                                            <tr v-for="(c,i) in woAssignDetailBnList" >
                                                <td>{{c.name}}</td>
                                                <td><input type="number" v-model="c.cost" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===1" class="my-tab-body" >
                                <div class="my-tab-100" >
                                    <table class="my-tbl" style="font-size: 12px" >
                                        <table-head
                                                ref="th"
                                                :row-par-page="3"
                                                :set-table-data="setTableData"
                                                :header-name-list="headerNameList" >
                                        </table-head>
                                        <tbody>
                                            <tr v-for="(wab,i) in woAssignBnList" >
                                                <td>{{i+1}}</td>
                                                <td>{{wab.workOrderName}}</td>
                                                <td>{{wab.deptName}}</td>
                                                <td>{{wab.assignUserName}}</td>
                                                <td>{{wab.assignDate}}</td>
                                                <td>{{wab.assignTime}}</td>
                                                <td>{{wab.statusName}}</td>
                                                <td><i class="fas fa-edit" v-on:click="setUpdateData(wab)" ></i></td>
                                                <td><i class="fas fa-trash" v-on:click="deleteWoAssign(wab)" ></i></td>
                                                <td><i class="fas fa-binoculars" v-on:click="openTblDetailModel(wab)" ></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="woAssign.id===-1" class="my-btn" v-on:click="save" >Save</button>
                                <button v-else class="my-btn" v-on:click="update" >Update</button>
                                <button class="my-btn" v-on:click="reset" >Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <notification ref="noti" ></notification>

        <transition name="slide-fade" >
            <div class="my-model" v-show="isTblDetailModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-4" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>{{woAssign.workOrderName}}</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeTblDetailModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <table style="color: darkgoldenrod" >
                                        <tbody>
                                        <tr>
                                            <td>Scope : </td>
                                            <td>{{woAssign.scope}}</td>
                                        </tr>
                                        <tr>
                                            <td>Remark : </td>
                                            <td>{{woAssign.remark}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-div-body" >
                                    <table class="my-tbl" >
                                        <thead>
                                        <tr>
                                            <th>Break down</th>
                                            <th>Cost</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="wabd in woAssignDetailBnList" >
                                            <td>{{wabd.name}}</td>
                                            <td>{{wabd.cost}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

    </div>

</template>

<script>

    import Notification from "../notificaiton/Notification";
    import DateFormatManager from "../../Helper/DateFormatManager";
    import CookieManager from "../../Helper/CookieManager";
    import TableHead from "../../common/TableHead";
    import SockJS from "sockjs-client";
    import Stomp from "webstomp-client";

    export default {
        name: "WorkOrderAssign",
        components: {TableHead, Notification},
        mounted(){
            this.getInitData();
            this.connect();
        },
        data(){
            return{
                isTblDetailModelOpen : false,
                url : this.$store.state.baseUrl,
                tabButtons : ['Assign work order','Assign list'],
                selectedTab : 0,
                needToCloseNotification : true,
                woAssign:{
                    id : -1,
                    woId : -1,
                    workOrderName : '',
                    deptOid : -1,
                    assignTo : '',
                    assignPos : -1,
                    assignUserMail : '',
                    assignDate : '',
                    assignTime : '',
                    scope : '',
                    remark : '',
                    modifiedBy : CookieManager.getParsedData("userInfo").id,
                    statusName : '',
                    assignUserName : '',
                    deptName : '',
                },
                workOrderList : [],
                departmentBnList : [],
                woAssignBnList : [],
                costBreakDownList : [],
                woAssignDetailBnList : [],
                userList : [],
                isCbdModelOpen : false,
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'WO',
                        sortBy : 'workOrderName',
                    },
                    {
                        name : 'Dept',
                        sortBy : 'deptName',
                    },
                    {
                        name : 'Assign to',
                        sortBy : 'assignUserName',
                    },
                    {
                        name : 'Date',
                        sortBy : 'assignDate',
                    },
                    {
                        name : 'Time',
                        sortBy : 'assignTime',
                    },
                    {
                        name : 'Status',
                        sortBy : 'statusName',
                    },
                    {
                        name : 'Edit',
                        sortBy : '',
                    },
                    {
                        name : 'Delete',
                        sortBy : '',
                    },
                    {
                        name : 'Details',
                        sortBy : '',
                    }
                ],
                connected: false
            }
        },
        methods:{
            setTableData(l){

                // console.log(JSON.stringify(l));
                this.woAssignBnList = l;

            },
            closeTblDetailModel(){
                this.isTblDetailModelOpen = false;
                this.reset();
            },
            openTblDetailModel(w){
                this.isTblDetailModelOpen = true;
                this.woAssign.workOrderName = w.workOrderName;
                this.woAssign.scope = w.scope;
                this.woAssign.remark = w.remark;
                this.woAssignDetailBnList = w.woAssignDetailBnList;
            },
            userChange(){
                this.woAssign.assignTo = this.userList[this.woAssign.assignPos].id;
                this.woAssign.assignUserMail = this.userList[this.woAssign.assignPos].userEmail;
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.get(this.url+"/wo-assign/init")
                .then(res=>{

                    // console.log(JSON.stringify(res.data.woAssignBnList));

                    if (res.data.code===200){

                        this.departmentBnList = res.data.departmentBnList;
                        this.workOrderList = res.data.workOrderList;
                        if (res.data.woAssignBnList){
                            this.$refs.th.setComTableData(res.data.woAssignBnList);
                        }
                        this.costBreakDownList = res.data.costBreakDownList;
                        this.woAssignDetailBnList = res.data.costBreakDownList;

                        if (this.needToCloseNotification){
                            this.$refs.noti.closeNotification();
                        }

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(err=>{
                    // console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.getInitData,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                });

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            departmentChange(oId){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                if (this.selectedDepartmentId===-1){

                } else {

                    this.$http.post(this.url+"/user/get-by-department",{
                        departmentBn : {
                            oId : oId
                        },
                        userBn : CookieManager.getParsedData("userInfo"),
                        menuBn : {
                            link : this.$route.path
                        }
                    })
                    .then(response=>{

                        // console.log(JSON.stringify(response.data));

                        if (response.data.code===200){
                            this.userList = response.data.list;
                            this.$refs.noti.closeNotification();
                        }else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : response.data.msg,
                                status : response.data.code
                            });

                        }
                    })
                    .catch(error=> {
                        // console.log(error);
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Did not get menu list',
                            width : '30%',
                            callBackMethod : this.getMenuByDepartment,
                            needTryAgain : true,
                            status : 400
                        });
                    });

                }

            },
            save(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/wo-assign/save",{
                    woAssignBn : this.woAssign,
                    woAssignDetailBnList : this.woAssignDetailBnList,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.reset();
                        this.needToCloseNotification = false;
                        this.getInitData();
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            status : res.data.code
                        });

                        let req = {
                            notificationBn : {
                                receiver : res.data.notificationBn.receiver
                            },
                            userBn : CookieManager.getParsedData("userInfo")
                        };

                        console.log(JSON.stringify(req));

                        this.stompClient.send("/ws-request/get-notification-by-receiver",JSON.stringify(req),{});

                    } else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.save,
                            needTryAgain : true,
                            status : 400
                        });

                    }

                })
                .catch(err=>{
                    // console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.save,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                });

            },
            setUpdateData(w){

                this.selectedTab = 0;
                this.woAssign.id = w.id;
                this.woAssign.woId = w.woId;
                this.woAssign.deptOid = w.deptOid;
                this.woAssign.assignTo = w.assignTo;
                this.woAssign.assignPos = -1;
                this.woAssign.assignDate = DateFormatManager.formate(w.assignDate);
                this.woAssign.assignTime = w.assignTime;
                this.woAssign.scope = w.scope;
                this.woAssign.remark = w.remark;
                this.woAssignDetailBnList = w.woAssignDetailBnList;
                this.woAssign.assignUserName = w.assignUserName;

            },
            reset(){

                // this.selectedTab = 0;
                this.woAssign.id = -1;
                this.woAssign.woId = -1;
                this.woAssign.deptOid = -1;
                this.woAssign.assignTo = "";
                this.woAssign.assignPos = -1;
                this.woAssign.assignUserMail = "";
                this.woAssign.assignDate = "";
                this.woAssign.assignTime = "";
                this.woAssign.scope = "";
                this.woAssign.remark = "";
                this.woAssign.assignUserName = "";

                this.woAssignDetailBnList = this.costBreakDownList;

            },
            update(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/wo-assign/update",{
                    woAssignBn : this.woAssign,
                    woAssignDetailBnList : this.woAssignDetailBnList,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.getInitData();
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            status : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.update,
                            needTryAgain : true,
                            status : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    // console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.update,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                });

            },
            deleteWoAssign(w){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/wo-assign/delete",{
                    woAssignBn : {
                        id : w.id,
                        oId : w.oId
                    },
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.getInitData();
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.deleteWoAssign,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    // console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.save,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                });

            },
            connect() {
                this.socket = new SockJS(this.$store.state.webSocketBaseUrl);
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.debug = () => {};
                this.stompClient.connect({},
                    frame => {
                        this.connected = true;
                        console.log(frame);
                    },
                    error => {
                        console.log(error);
                        this.connected = false;
                    }
                );
            }
        },
        watch:{
            connected : {
                handler : function () {
                    if (!this.connected){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Loading',
                            bodyIcon : 'fas fa-sync fa-spin',
                            bodyMsg : "Connection lost,Please wait ... connecting !",
                        });
                    } else {
                        this.$refs.noti.closeNotification();
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
