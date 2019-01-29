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
    import CookieManager from "../../Helper/CookieManager"

    export default {
        name: "Profile",
        components: {Notification},
        data(){
            return{
                url : this.$store.state.baseUrl,
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
                this.userInfoModel.userName = CookieManager.getParsedData("userInfo").userName;
                this.userInfoModel.userEmail = CookieManager.getParsedData("userInfo").userEmail;
                this.userInfoModel.deptName = CookieManager.getParsedData("userInfo").deptName;
            },
            saveUserProfile(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait !',
                });

                this.$http.post(this.url+"/user/save/profile",{
                    userBn : {
                        id : CookieManager.getParsedData("userInfo").id,
                        userEmail : CookieManager.getParsedData("userInfo").userEmail,
                        userName : this.userInfoModel.userName,
                        sessionId : CookieManager.getParsedData("userInfo").sessionId
                    },
                    menuBn :{
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    if (res.data.code===200){

                        this.getInitData();

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.saveUserProfile,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.saveUserProfile,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })
            }
        }
    }
</script>

<style scoped>

</style>