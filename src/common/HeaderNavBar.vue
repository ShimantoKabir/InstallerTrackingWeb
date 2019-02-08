<template>
    <div class="vue-template" >
        <div class="header-nav-bar" >
            <div class="header-nav-bar-left" >
                <i v-on:click="toggleSideNavBar" class="fas fa-th-list"></i>
            </div>
            <div class="header-nav-bar-right" >
                <a class="header-nav-bar-right-drp-dwn" >
                    <span class="header-nav-bar-right-drp-dwn-btn" v-on:click="openNotification" ><i class="fas fa-bell"></i> Notification </span>
                    <span class="my-badge" v-if="unseenNotification!==0" >{{unseenNotification}}</span>
                    <div class="header-nav-bar-right-drp-dwn-con" v-if="isNotificationOpen" style="overflow-y: auto;height: 400px" >
                        <div  v-for="n in serverNotification" class="notification" v-on:click="goDestination(n)" >
                            <h3 v-if="n.isSeen===0" style="color: darkgoldenrod" >{{n.message}}</h3>
                            <h3 v-else >{{n.message}}</h3>
                            <p>{{n.createdDate}}</p>
                        </div>
                    </div>
                </a>
                <a class="header-nav-bar-right-drp-dwn" >
                    <span class="header-nav-bar-right-drp-dwn-btn" v-on:click="openHeaderSubMenu" ><i class="fas fa-user"></i> {{userName}}</span>
                    <ul class="header-nav-bar-right-drp-dwn-con" v-if="isHeaderNavSubMenuOpen" >
                        <li v-on:click="closeHeaderNavSubMenu" ><router-link to="/profile" >Profile</router-link></li>
                        <li v-on:click="closeHeaderNavSubMenu" ><router-link to="/change-password" >Change password</router-link></li>
                    </ul>
                </a>
                <a style="cursor: pointer" v-on:click="logout" ><i class="fas fa-power-off"></i> Logout &nbsp;</a>
            </div>
        </div>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import LoginReg from "./../pages/LoginReg"
    import SockJS from "sockjs-client";
    import Stomp from "webstomp-client";
    import Notification from "../views/notificaiton/Notification";
    import CookieManager from "../Helper/CookieManager"

    export default {
        name: "HeaderNavBar",
        components: {Notification},
        mounted(){
            this.checkWebSocketConnection();
            this.setUserName(CookieManager.getParsedData("userInfo").userName);
            this.getNotification();
            this.connect();
            this.getRoute();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                isHeaderNavSubMenuOpen : false,
                isNotificationOpen : false,
                clickCount: 0,
                userName : '',
                serverNotification : [],
                connected : false,
                unseenNotification : 0
            }
        },
        methods:{
            getRoute(){

                this.$http.post(this.url+"/router/get-by-department",{
                    userBn : CookieManager.getParsedData("userInfo")
                })
                .then(response=>{

                    // console.log(JSON.stringify(response.data));

                    if (response.data.code===200){

                        this.$store.state.route = response.data.list;

                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.getRoute,
                            needTryAgain : true,
                            code : response.data.code
                        });
                    }
                })
                .catch(error=>{
                    console.log(JSON.stringify(error.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : error.response.data.message,
                        callBackMethod : this.getRoute,
                        needTryAgain : true,
                        code : error.response.data.status
                    });
                })

            },
            checkWebSocketConnection(){
                let lThis = this;
                setInterval(function(){
                    if (!lThis.connected){
                        lThis.connect();
                    }
                },5000);
            },
            setUserName(name){
                this.userName = name;
            },
            openHeaderSubMenu(){
                this.isHeaderNavSubMenuOpen = !this.isHeaderNavSubMenuOpen;
            },
            toggleSideNavBar(){
                this.$store.state.isSideNavBarOpen = !this.$store.state.isSideNavBarOpen;
            },
            logout(){
                this.$store.state.menu = "";
                this.$store.state.route = "";
                this.$store.state.userInfo = '';
                CookieManager.delete("userInfo");
                clearInterval(this.$store.state.userPresence);
                this.$router.push({
                    path: '/',
                    name: 'LoginReg',
                    component: LoginReg
                });
            },
            closeHeaderNavSubMenu(){
                this.isHeaderNavSubMenuOpen = false;
            },
            openNotification(){
                this.isNotificationOpen = !this.isNotificationOpen;
            },
            getNotification(){

                if (this.conversationId!==0){

                    this.$http.post(this.url+"/notification/get-by-receiver",{
                        notificationBn : {
                            receiver : CookieManager.getParsedData("userInfo").id
                        },
                        userBn : CookieManager.getParsedData("userInfo")
                    }).then(res=>{
                        this.serverNotification = res.data.list;
                        this.countUnseenNotification(this.serverNotification);
                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                    })

                }
            },
            connect() {
                this.socket = new SockJS(this.$store.state.webSocketBaseUrl);
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.debug = () => {};
                this.stompClient.connect({},
                    frame => {
                        this.connected = true;
                        this.stompClient.subscribe("/ws-response/notifications", tick => {
                            console.log(tick.body);
                            let notificationsList = JSON.parse(tick.body).list;
                            let obj = JSON.parse(tick.body).object;
                            if (notificationsList!==null){
                                if (CookieManager.getParsedData("userInfo").id === obj.receiver){
                                    this.serverNotification = notificationsList;
                                    this.countUnseenNotification(this.serverNotification);
                                }
                            }
                        });
                    },
                    error => {
                        console.log(error);
                        this.connected = false;
                    }
                );
            },
            goDestination(n){

                if (this.conversationId!==0){

                    this.$http.post(this.url+"/notification/seen",{
                        notificationBn : {
                            id : n.id
                        },
                        userBn : CookieManager.getParsedData("userInfo")
                    })
                    .then(res=>{

                        if (res.data.code===200){
                            this.isNotificationOpen = false;
                            let req = {
                                notificationBn : {
                                    receiver : n.receiver
                                },
                                userBn : CookieManager.getParsedData("userInfo")
                            };
                            this.stompClient.send("/ws-request/get-notification-by-receiver",JSON.stringify(req),{});
                            this.$router.push({path: n.link});
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg
                            });
                        }

                    })
                    .catch(err=>{
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.manageFriendRequest,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

                }
            },
            countUnseenNotification(notifications){

                this.unseenNotification = 0;

                for (let i = 0; i < notifications.length; i++) {

                    if (notifications[i].isSeen===0){
                        this.unseenNotification++;
                    }
                    
                }
            }
        },
        watch:{
            connected : {
                handler : function () {
                    if (!this.connected){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Loading',
                            bodyIcon : 'fas fa-sync fa-spin',
                            bodyMsg : "Connection lost,Please wait ... connecting !",
                        });

                        clearInterval(this.$store.state.userPresence);

                    } else {

                        let This = this;

                        this.$store.state.userPresence = setInterval(function(){
                            console.log("Updating user presence .... ");
                            let req = {
                                userBn : {
                                    id : CookieManager.getParsedData("userInfo").id
                                }
                            };
                            This.stompClient.send("/ws-request/update-user-presence",JSON.stringify(req),{});

                        }, 5000);

                        this.$refs.noti.closeNotification();
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .header-nav-bar{
        display: flex;
        background-color: #efefef;
        justify-content: space-between;
        align-items: baseline;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12);
    }
    .header-nav-bar-left{
        display: flex;
        align-items: baseline;
        justify-content: baseline;
        padding: 20px;
        cursor: pointer;
        color: #377e3a;
    }
    .header-nav-bar-right{
        display: flex;
        align-items: baseline;
        justify-content: baseline;
        color: #377e3a;
    }
    .header-nav-bar-right a{
        padding: 20px 5px;
        text-decoration: none;
        color: #377e3a;
    }
    .header-nav-bar-right a:hover{

    }
    .header-nav-bar-right-drp-dwn{
        z-index: 1;
        position: relative;
        display: inline-block;
    }
    .header-nav-bar-right-drp-dwn-btn{
        cursor: pointer;
    }
    .header-nav-bar-right-drp-dwn-con{
        box-sizing: border-box;
        transition: 0.5s;
        position: fixed;
        background-color: #f1f1f1;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12);
        top: 61px;
        list-style: none;
    }
    .header-nav-bar-right-drp-dwn > ul > li{
        border-bottom: 1px solid #d4d4d4;
        padding: 6px;
        font-size: 13px;
    }
    .header-nav-bar-right-drp-dwn > ul > li:hover{
        background-color: #d4d4d4;
    }
    .notification{
        display: flex;
        justify-content: center;
        flex-direction: column;
        border-bottom: 1px solid lightgray;
        cursor: pointer;
    }
    .notification > h3{
        padding: 10px;
        font-size: 13px;
        color: gray;
        text-align: justify-all;
    }
    .notification > p{
        display: flex;
        justify-content: flex-end;
        margin: 5px;
        font-size: 10px;
    }
</style>