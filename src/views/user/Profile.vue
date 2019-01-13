<template>
    <div class="vue-template" >
        <div class="container-fluid" >
        <div class="row justify-content-center" >
            <div class="col-sm-4" >
                <div class="my-div" >
                    <div class="my-div-head" >
                        <div class="my-div-head-left" >
                            <h3>Profile</h3>
                        </div>
                        <div class="my-div-head-right" >
                            <i class="fas fa-info-circle" ></i>
                        </div>
                    </div>
                    <div class="my-div-body" >
                        <table>
                            <tr>
                                <td>Username</td>
                                <td><input type="text" v-model="userInfoModel.userName" /></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input readonly type="text" v-model="userInfoModel.userEmail" /></td>
                            </tr>
                            <tr>
                                <td>Department</td>
                                <td><input readonly type="text" v-model="userInfoModel.deptName" /></td>
                            </tr>
                        </table>
                    </div>
                    <div class="my-div-foot" >
                        <div class="my-div-foot-left" >
                            <button class="my-btn" v-on:click="saveUserProfile" >Save</button>
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

    export default {
        name: "Profile",
        components: {Notification},
        data(){
            return{
                userInfoModel :{
                    userName : '',
                    userEmail : '',
                    deptName : ''
                }
            }
        },
        mounted(){
            this.getInitData()
        },
        methods: {
            getInitData(){
                this.userInfoModel.userName = this.$store.state.userInfo.userName;
                this.userInfoModel.userEmail = this.$store.state.userInfo.userEmail;
                this.userInfoModel.deptName = this.$store.state.userInfo.deptName;
            },
            saveUserProfile(){

                this.$store.state.userInfo.userName = this.userInfoModel.userName;

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait !',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/save/profile",this.$store.state.userInfo)
                .then(res=>{
                    console.log(res.data);
                    if (res.status===200){

                        if (res.data.code===200){

                            this.getInitData();

                            this.$refs.noti.setNotificationProperty({
                                title : 'Success',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : res.data.msg,
                                status : res.data.code
                            });

                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : 'Can not save user profile !',
                                callBackMethod : this.saveUserProfile,
                                needTryAgain : true,
                                status : 400
                            });
                        }

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Can not save user profile !',
                            callBackMethod : this.saveUserProfile,
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
                        bodyMsg : 'Can save user profile !',
                        callBackMethod : this.saveUserProfile,
                        needTryAgain : true,
                        status : 400
                    });
                })
            }
        }
    }
</script>

<style scoped>

</style>