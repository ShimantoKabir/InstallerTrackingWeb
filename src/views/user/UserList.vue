<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>User list</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i class="fas fa-info-circle" ></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <table class="my-tbl" >
                                <table-head
                                        ref="th"
                                        :row-par-page="3"
                                        :set-table-data="setTableData"
                                        :header-name-list="headerNameList" >
                                </table-head>
                                <tbody>
                                <tr v-for="(u,i) in users" >
                                    <td>{{i}}</td>
                                    <td>{{u.userName}}</td>
                                    <td>{{u.userEmail}}</td>
                                    <td>{{u.deptName}}</td>
                                    <td v-if="u.isUserActive===1" >Yes</td>
                                    <td v-else >No</td>
                                    <td v-if="u.isUserApproved===1" >Yes</td>
                                    <td v-else >No</td>
                                    <td><i class="fas fa-edit" v-on:click="manageUser(u)" ></i></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isManageUserModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-3" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>Manage user</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeManageUserModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Department</td>
                                            <td>
                                                <select v-model="manageUserInfo.deptId" >
                                                    <option v-bind:value="dl.oId" v-for="dl in departmentList" >{{dl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-if="isApproved" >Unapprove</td>
                                            <td v-else >Approve</td>
                                            <td><input v-model="isApproved" v-on:change="approveChange" type="checkbox" /></td>
                                        </tr>
                                        <tr>
                                            <td v-if="isActive" >Deactive</td>
                                            <td v-else >Active</td>
                                            <td><input v-model="isActive" v-on:change="activeChange" type="checkbox" /></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-div-foot" >
                                    <div class="my-div-foot-left" >
                                        <button class="my-btn" v-on:click="manageUserAttempt" >Save</button>
                                    </div>
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
    import CookieManager from "../../Helper/CookieManager"
    import TableHead from "../../common/TableHead";

    export default {
        name: "UserList",
        components: {TableHead, Notification},
        data(){
            return{
                users : [],
                isManageUserModelOpen : false,
                departmentList : [],
                isApproved : '',
                isActive : '',
                manageUserInfo : {
                    id : '',
                    deptId : '',
                    isUserActive : '',
                    isUserApproved : ''
                },
                needToCloseNotification : true,
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
                        name : 'Email',
                        sortBy : 'email',
                    },
                    {
                        name : 'Department name',
                        sortBy : 'deptName',
                    },
                    {
                        name : 'Is active',
                        sortBy : '',
                    },
                    {
                        name : 'Is approved',
                        sortBy : '',
                    },
                    {
                        name : 'Manage',
                        sortBy : '',
                    }
                ]
            }
        },
        mounted(){
            this.getInitData();
        },
        methods:{
            setTableData(list){
                this.users = list;
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/manage-init",{
                    userBn : CookieManager.getParsedData("userInfo")
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.$refs.th.setComTableData(res.data.userList);
                        this.departmentList = res.data.departmentBnList;

                        if (this.needToCloseNotification){this.$refs.noti.closeNotification();}

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Initial data processing error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            status : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.manageUserAttempt,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })

            },
            manageUser(u){
                this.manageUserInfo.deptId = u.deptId;
                if (u.isUserActive===1){
                    this.isActive = true;
                    this.manageUserInfo.isUserActive=1;
                }else {
                    this.isActive = false;
                    this.manageUserInfo.isUserActive=0;
                }
                if (u.isUserApproved===1){
                    this.isApproved = true;
                    this.manageUserInfo.isUserApproved=1;
                }else {
                    this.isApproved = false;
                    this.manageUserInfo.isUserApproved=0;
                }
                this.isManageUserModelOpen = true;
                this.manageUserInfo.id = u.id;
            },
            closeManageUserModel(){
                this.isManageUserModelOpen = false;
            },
            manageUserAttempt(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/manage",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    manageUserBn : this.manageUserInfo
                })
                .then(res=>{
                    console.log(JSON.stringify(res.data));
                    if (res.data.code===200){
                        this.getInitData();
                        this.needToCloseNotification = false;
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            status : res.data.code,
                            needOk : true
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.manageUserAttempt,
                            needTryAgain : true,
                            status : res.data.code
                        });
                    }
                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.manageUserAttempt,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })
            },
            approveChange(){
                if (this.isApproved){
                    this.manageUserInfo.isUserApproved=1;
                } else {
                    this.manageUserInfo.isUserApproved=0;
                }
            },
            activeChange(){
                if (this.isActive){
                    this.manageUserInfo.isUserActive=1;
                } else {
                    this.manageUserInfo.isUserActive=0;
                }
            }
        }
    }
</script>

<style scoped>

</style>