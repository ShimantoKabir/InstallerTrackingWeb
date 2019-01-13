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
                                        <td><input required type="email" v-model="user.userEmail" /></td>
                                    </tr>
                                    <tr>
                                        <td>Password</td>
                                        <td><input required type="password" v-model="user.password" /></td>
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
                                        <td><input required type="email" v-model="user.userEmail" /></td>
                                    </tr>
                                    <tr>
                                        <td>Password</td>
                                        <td><input required type="password" v-model="user.password"  /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" >
                                <button v-if="userAttempt===0" v-on:click="loginAttempt" class="my-btn" >Login</button>
                                <button v-else class="my-btn" v-on:click="registrationAttempt" >Registration</button>
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

    export default {
        name: "LoginReg",
        components: {Notification},
        created(){
            this.wh = window.innerHeight/4;
            this.styleObject.marginTop = this.wh.toString()+"px";
        },
        mounted(){
            this.$store.state.userInfo = '';
            console.log(this.$store.state.isLogIn);
        },
        data(){
            return{
                userAttempt : 0,
                wh : 0,
                styleObject: {
                    marginTop : ''
                },
                user : {
                    userEmail : '',
                    password : ''
                }
            }
        },
        methods:{
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

                this.$http.post(url+"/user/login",this.user)
                .then(response=>{

                    console.log(response.data);

                    if (response.data.code===200){

                        this.$store.state.userInfo = response.data.object;

                        this.getInitialData(response.data.object)


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
                    title : 'Registration processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                    width : '30%',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/registration",this.user)
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
            getInitialData(){

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/initial-data",this.$store.state.userInfo)
                .then(response=>{
                    if (response.data.code===200){

                        this.$store.state.route = response.data.list[0].list;
                        this.$store.state.menu = response.data.list[1].list;
                        this.$store.state.isLogIn = true;

                        console.log(JSON.stringify(this.$store.state));

                        this.$router.push({
                            path: '/dashboard',
                            name: 'Dashboard',
                            component: Dashboard
                        });

                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            width : '30%',
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : 400
                        });
                    }
                })
                .catch(error=>{
                    console.log(JSON.stringify(error));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : "Initial data getting error!",
                        width : '30%',
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        status : 400
                    });
                })

            },
            goForgotPasswordLayout(){
                this.$router.push({path: '/forgot-password/1'});
            }
        }
    }
</script>

<style scoped></style>