<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row justify-content-center" >
                <div class="col-sm-4" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>Change password</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i class="fas fa-info-circle" ></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <table>
                                <tr>
                                    <td>Old password</td>
                                    <td><input type="text" v-model="passwordMode.oldPassword" /></td>
                                </tr>
                                <tr>
                                    <td>New password</td>
                                    <td><input type="text" v-model="passwordMode.newPassword" /></td>
                                </tr>
                            </table>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" >
                                <button class="my-btn" v-on:click="saveNewPassword" >Save</button>
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
    import CookieManager from "./../../Helper/CookieManager"

    export default {
        name: "ChangePassword",
        components: {Notification},
        mounted(){
            // alert(this.$route.path);
        },
        data(){
            return{
                passwordMode:{
                    oldPassword : '',
                    newPassword : ''
                }
            }
        },
        methods:{
            saveNewPassword(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait .... !',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/change-password",{
                    userBn : {
                        id : CookieManager.getParsedData("userInfo").id,
                        userEmail : CookieManager.getParsedData("userInfo").userEmail,
                        password : this.passwordMode.oldPassword,
                        newPassword : this.passwordMode.newPassword
                    },
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    if (res.data.code===200){
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
                            bodyMsg : 'Password change unsuccessful !',
                            callBackMethod : this.saveNewPassword,
                            needTryAgain : true,
                            code : 400
                        });
                    }

                }).catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.saveNewPassword,
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