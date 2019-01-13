<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row justify-content-center" >
                <div class="col-sm-4" >
                    <div class="my-div" >
                        <div class="my-div-body" >
                            <button class="my-btn" v-on:click="goToLogin" >Go to login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import notification from "./../views/notificaiton/Notification"
    import LoginReg from "./LoginReg";

    export default {

        name: "EmailVerification",
        components: {notification},
        mounted(){
            if(this.$route.params.token){
                this.activeUserAccount();
            }
        },
        methods : {
            activeUserAccount(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Account active processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                    width : '30%'
                });

                let url = this.$store.state.baseUrl;

                this.$http.post(url+"/user/active",{
                    token : this.$route.params.token
                })
                .then(response=>{
                    if (response.status===200){
                        if (response.data.code === 200){
                            this.$refs.noti.setNotificationProperty({
                                title : 'Processing result',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : 'Account active successful, when admin will approved your account then you can login !',
                                status : 200
                            });
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Processing result',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : response.data.msg,
                                callBackMethod : this.activeUserAccount,
                                needTryAgain : true,
                                status : 400
                            });
                        }
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Account active unsuccessful !',
                            width : '30%',
                            callBackMethod : this.activeUserAccount,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(error=> {
                    console.log(error);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Processing result',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Account active unsuccessful !',
                        width : '30%',
                        callBackMethod : this.activeUserAccount,
                        needTryAgain : true,
                        status : 400
                    });
                });
            },
            goToLogin(){
                this.$router.push({
                    path: '/',
                    name: 'LoginReg',
                    component: LoginReg
                });
            }
        }
    }
</script>

<style scoped>

</style>