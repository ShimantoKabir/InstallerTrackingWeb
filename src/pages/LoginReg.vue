<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row justify-content-center" >
                <div class="col-sm-4" >
                    <div class="my-div" v-bind:style="styleObject" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3 v-if="userAttempt===0" >Login</h3>
                                <h3 v-else >Registration</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i v-on:click="registration" v-if="userAttempt===0" class="fas fa-arrow-right"></i>
                                <i v-on:click="login" v-else class="fas fa-arrow-left"></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <table v-if="userAttempt===0" style="width: 100%" >
                                <tbody>
                                    <tr>
                                        <td>Email</td>
                                        <td><input required type="email" v-model="loginUserDate.userEmail" /></td>
                                    </tr>
                                    <tr>
                                        <td>Password</td>
                                        <td><input required type="password" v-model="loginUserDate.password" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" ><p v-on:click="registration" style="color: green;font-size: 12px;margin-top: 15px;cursor: pointer">Don't have account click hare !</p></td>
                                    </tr>
                                </tbody>
                            </table>
                            <table v-else style="width: 100%" >
                                <tbody>
                                    <tr>
                                        <td>Email</td>
                                        <td><input required type="email" v-model="regUserDate.userEmail" /></td>
                                    </tr>
                                    <tr>
                                        <td>Password</td>
                                        <td><input required type="password" v-model="regUserDate.password"  /></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Register with
                                        </td>
                                        <td>
                                            <button v-on:click="onFaceBookLogin" class="my-btn"  >FB</button>
                                            <button v-on:click="onVkLogin" class="my-btn"  >VK</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" >
                                <button v-if="userAttempt===0" v-on:click="verifyInput('login')" class="my-btn" >Login</button>
                                <button v-else v-on:click="verifyInput('reg')" class="my-btn" >Registration</button>
                            </div>
                            <div>
                                <p v-if="userAttempt===0" v-on:click="goForgotPasswordLayout" style="color: red;cursor: pointer;font-size: 12px;font-style: italic" >Forgot password ?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Notification ref="noti" ></Notification>
    </div>
</template>

<script>

    import Dashboard from "./Dashboard";
    import Notification from "../views/notificaiton/Notification";
    import CookieManager from "../Helper/CookieManager";

    export default {
        name: "LoginReg",
        components: {Notification},
        created(){
            this.wh = window.innerHeight/4;
            this.styleObject.marginTop = this.wh.toString()+"px";
        },
        mounted(){

        },
        data(){
            return{
                userAttempt : 0,
                wh : 0,
                styleObject: {
                    marginTop : ''
                },
                loginUserDate : {
                    userEmail : '',
                    password : ''
                },
                regUserDate : {
                    userEmail : '',
                    password : ''
                }
            }
        },
        methods:{
            verifyInput(which){
                if (which==="login"){
                    if (this.loginUserDate.userEmail===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Email required !',
                            needOk: true
                        });
                    } else if (this.loginUserDate.password===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Password required !',
                            needOk: true
                        });
                    } else {
                        this.loginAttempt();
                    }
                }else if (which==="reg"){
                    if (this.regUserDate.userEmail===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Email required !',
                            needOk: true
                        });
                    } else if (this.regUserDate.password===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Password required !',
                            needOk: true
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Would you like to submit ?',
                            callBackMethod : this.registrationAttempt,
                            needConfirmation : true
                        });
                    }
                }
            },
            registration(){
                this.userAttempt = 1;
            },
            login(){
                this.userAttempt = 0;
            },
            loginAttempt(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                });

                let url = this.$store.state.baseUrl;

                this.$http.post(url+"/user/login",{
                    userBn : this.loginUserDate
                })
                .then(response=>{

                    console.log(JSON.stringify(response.data));

                    if (response.data.code===200){

                        this.$refs.noti.closeNotification();
                        this.$store.state.userInfo = response.data.userBn;

                        CookieManager.set("userInfo",JSON.stringify(response.data.userBn),0);
                        this.$router.push({path: '/dashboard'});


                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.loginAttempt,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(error=> {
                    console.log(error.status);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Login fail',
                        callBackMethod : this.loginAttempt,
                        needTryAgain : true,
                        status : 400
                    });
                });

            },
            registrationAttempt(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                    width : '30%',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/registration",{
                    userBn : this.regUserDate
                })
                .then(response=>{

                    if (response.status===200){

                        console.log(response.data);

                        if (response.data.code===200){
                            this.$refs.noti.setNotificationProperty({
                                title : 'Success',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : 'Registration successful, a link has been sent to your email, click the link and active your account',
                                width : '30%',
                                status : 200
                            });
                        }else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : 'Registration unsuccessful !',
                                width : '30%',
                                callBackMethod : this.registrationAttempt,
                                needTryAgain : true,
                                status : 400
                            });

                        }

                    } else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Registration unsuccessful !',
                            width : '30%',
                            callBackMethod : this.registrationAttempt,
                            needTryAgain : true,
                            status : 400
                        });

                    }

                })
                .catch(error=> {
                    console.log(JSON.stringify(error));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Registration unsuccessful !',
                        width : '30%',
                        callBackMethod : this.registrationAttempt,
                        needTryAgain : true,
                        status : 400
                    });
                });

            },
            goForgotPasswordLayout(){
                this.$router.push({path: '/forgot-password/1'});
            },
            onFaceBookLogin(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                });

                let url = this.$store.state.baseUrl;

                this.$http.get(url+"/fb/login")
                .then(response=>{

                    console.log(JSON.stringify(response.data));

                    if (response.data.code===200){

                        window.open(response.data.facebookLoginUrl);
                        this.$refs.noti.closeNotification();


                    }else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.code,
                            callBackMethod : this.onFaceBookLogin,
                            needTryAgain : true,
                            status : response.data.code
                        });

                    }

                })
                .catch(error=> {
                    console.log(error.status);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Login fail',
                        callBackMethod : this.onFaceBookLogin,
                        needTryAgain : true,
                        status : 400
                    });
                });

            },
            onVkLogin(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                });

                let url = this.$store.state.baseUrl;

                this.$http.get(url+"/vk/login")
                    .then(response=>{

                        console.log(JSON.stringify(response.data));

                        if (response.data.code===200){

                            window.open(response.data.vkLoginUrl);
                            this.$refs.noti.closeNotification();


                        }else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : response.data.code,
                                callBackMethod : this.onFaceBookLogin,
                                needTryAgain : true,
                                status : response.data.code
                            });

                        }

                    })
                    .catch(error=> {
                        console.log(error.status);
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Login fail',
                            callBackMethod : this.onFaceBookLogin,
                            needTryAgain : true,
                            status : 400
                        });
                    });

            }
        }
    }
</script>

<style scoped></style>
