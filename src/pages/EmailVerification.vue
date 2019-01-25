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
        data(){
            return{
                url : this.$store.state.baseUrl
            }
        },
        mounted(){
            if(this.$route.params.token){
                this.activeUserAccount();
            }
        },
        methods : {
            activeUserAccount(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/user/active",{
                    userBn : {
                        token : this.$route.params.token
                    }
                })
                .then(response=>{

                    if (response.data.code === 200){
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
                            callBackMethod : this.activeUserAccount,
                            needTryAgain : true,
                            code : response.data.code
                        });
                    }

                })
                .catch(error=> {
                    console.log(JSON.stringify(error.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : error.response.data.message,
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        code : error.response.data.status
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