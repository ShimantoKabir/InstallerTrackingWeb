<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row justify-content-center" >
                <div class="col-sm-4" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3 v-if="isTokenAvailable" >Change password</h3>
                                <h3 v-else >Forgot password</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i class="fas fa-info-circle" ></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <table style="width: 100%" v-if="isTokenAvailable" >
                                <tr>
                                    <td>New password</td>
                                    <td><input type="text" v-model="newPassword" /></td>
                                </tr>
                            </table>
                            <table style="width: 100%" v-else >
                                <tr>
                                    <td>Email</td>
                                    <td><input type="email" v-model="email" /></td>
                                </tr>
                            </table>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" >
                                <table v-if="isTokenAvailable" >
                                    <tbody>
                                    <tr>
                                        <td><button class="my-btn" v-on:click="verifyForgotPasswordToken" >Save new password</button></td>
                                        <td><button class="my-btn" v-on:click="backToLogin" >Back</button></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table  v-else >
                                    <tbody>
                                    <tr>
                                        <td><button class="my-btn" v-on:click="sendForgotPasswordLink" >Get a link to to change password</button></td>
                                        <td><button class="my-btn" v-on:click="backToLogin" >Back</button></td>
                                    </tr>
                                    </tbody>
                                </table>
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
    import Notification from "../views/notificaiton/Notification";
    export default {
        name: "ForgotPassword",
        components: {Notification},
        mounted(){
            if(this.$route.params.token==='1'){

            }else {
                this.isTokenAvailable = true;
                this.token = this.$route.params.token;
                console.log(this.token);
            }
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                isTokenAvailable : false,
                token : '',
                email : '',
                newPassword : ''
            }
        },
        methods:{
            sendForgotPasswordLink(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/user/get-forgot-password-link",{
                    userBn : {
                        userEmail : this.email
                    }
                }).then(response=>{
                    if (response.data.code===200){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : response.data.msg,
                            code : response.data.code
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.sendForgotPasswordLink,
                            needTryAgain : true,
                            code : response.data.code
                        });
                    }
                }).catch(error=> {
                    console.log(JSON.stringify(error.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : error.response.data.message,
                        callBackMethod : this.sendForgotPasswordLink,
                        needTryAgain : true,
                        code : error.response.data.status
                    });
                });
            },
            backToLogin(){
                this.$router.push({path: '/'});
            },
            verifyForgotPasswordToken(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait, changing password operation is going on !',
                });

                this.$http.post(this.url+"/user/verify-forgot-password-token",{
                    userBn : {
                        token : this.token,
                        newPassword : this.newPassword
                    }
                }).then(response=>{
                    console.log(response.data);
                    if (response.data.code===200){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : response.data.msg,
                            code: response.data.code
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.verifyForgotPasswordToken,
                            needTryAgain : true,
                            code : response.data.code
                        });
                    }
                }).catch(error=> {
                    console.log(JSON.stringify(error.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : error.response.data.message,
                        callBackMethod : this.verifyForgotPasswordToken,
                        needTryAgain : true,
                        code : error.response.data.status
                    });
                });

            }
        }
    }
</script>

<style scoped>

</style>