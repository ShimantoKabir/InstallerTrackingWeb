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
                                <thead>
                                <tr>
                                    <th>Serial</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department name</th>
                                    <th>Is Active</th>
                                    <th>Is Approved</th>
                                    <th>Manage</th>
                                </tr>
                                </thead>
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
                                                <select v-model="userBeen.deptId" >
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

    export default {
        name: "UserList",
        components: {Notification},
        data(){
            return{
                users : [],
                isManageUserModelOpen : false,
                departmentList : [],
                isApproved : '',
                isActive : '',
                userBeen : {
                    id : '',
                    deptId : '',
                    isUserActive : '',
                    isUserApproved : ''
                }
            }
        },
        mounted(){
            this.getInitialData();
            this.getDepartment();
        },
        methods:{
            getInitialData(){

                let url = this.$store.state.baseUrl;
                this.$http.get(url+"/user/get")
                .then(res=>{
                    if (res.status===200){
                        if (res.data.code===200){
                            this.users = res.data.list;
                            console.log(JSON.stringify(this.users));
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Initial data processing error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : 'Can not get user list !',
                                callBackMethod : this.getInitialData,
                                needTryAgain : true,
                                status : 400
                            });
                        }
                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Initial data processing error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Server error !',
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Initial data processing error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Can not get user list !',
                        width : '30%',
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        status : 400
                    });
                })

            },
            getDepartment(){
                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/department/get-by-user",this.$store.state.userInfo)
                .then(res=>{

                    if (res.data.code===200){
                        this.departmentList = res.data.list;
                        console.log(JSON.stringify(this.departmentList));
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Initial data processing error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Can not get department list !',
                            width : '30%',
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Initial data processing error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Can not get department list !',
                        width : '60%',
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        status : 400
                    });
                })
            },
            manageUser(u){
                this.userBeen.deptId = u.deptId;
                if (u.isUserActive===1){
                    this.isActive = true;
                    this.userBeen.isUserActive=1;
                }else {
                    this.isActive = false;
                    this.userBeen.isUserActive=0;
                }
                if (u.isUserApproved===1){
                    this.isApproved = true;
                    this.userBeen.isUserApproved=1;
                }else {
                    this.isApproved = false;
                    this.userBeen.isUserApproved=0;
                }
                this.isManageUserModelOpen = true;
                this.userBeen.id = u.id;
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
                this.$http.post(url+"/user/manage",this.userBeen)
                .then(res=>{
                    if (res.status===200){
                        if (res.data.code===200){
                            this.getInitialData();
                            this.$refs.noti.setNotificationProperty({
                                title : 'Success',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : 'User manage successful !',
                            });
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : 'User manage unsuccessful !',
                                callBackMethod : this.manageUserAttempt,
                                needTryAgain : true,
                                status : 400
                            });
                        }
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'User manage unsuccessful !',
                            callBackMethod : this.manageUserAttempt,
                            needTryAgain : true,
                            status : 400
                        });
                    }
                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'User manage unsuccessful !',
                        callBackMethod : this.manageUserAttempt,
                        needTryAgain : true,
                        status : 400
                    });
                })
            },
            approveChange(){
                if (this.isApproved){
                    this.userBeen.isUserApproved=1;
                } else {
                    this.userBeen.isUserApproved=0;
                }
            },
            activeChange(){
                if (this.isActive){
                    this.userBeen.isUserActive=1;
                } else {
                    this.userBeen.isUserActive=0;
                }
            }
        }
    }
</script>

<style scoped>

</style>