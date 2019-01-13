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
    import Messenger from "./../views/communication/Messenger"

    export default {
        name: "HeaderNavBar",
        components: {Notification},
        mounted(){
            this.checkWebSocketConnection();
            this.setUserName(this.$store.state.userInfo.userName);
            this.getNotification();
            this.connect();
        },
        data(){
            return{
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
                this.$store.state.isLogIn = false;
                this.$store.state.userInfo = '';
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

                let url = this.$store.state.baseUrl;

                if (this.conversationId!==0){

                    this.$http.post(url+"/notification/get-by-receiver",{
                        receiver : this.$store.state.userInfo.id
                    }).then(res=>{

                        console.log(JSON.stringify(res.data));
                        this.serverNotification = res.data.list;
                        this.countUnseenNotification(this.serverNotification);

                    })
                    .catch(err=>{

                    })

                }
            },
            connect() {
                this.socket = new SockJS("http://192.168.0.3:3307/ws");
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.debug = () => {};
                this.stompClient.connect({},
                    frame => {
                        this.connected = true;
                        // console.log(frame);
                        this.stompClient.subscribe("/ws-response/notifications", tick => {
                            let notificationsList = JSON.parse(tick.body).list;
                            let obj = JSON.parse(tick.body).object;
                            // console.log(notificationsList);
                            if (notificationsList!==null){
                                if (this.$store.state.userInfo.id === obj.receiver){
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

                let url = this.$store.state.baseUrl;

                if (this.conversationId!==0){

                    this.$http.post(url+"/notification/seen",{
                        id : n.id
                    })
                    .then(res=>{

                        if (res.data.code===200){
                            this.isNotificationOpen = false;
                            this.stompClient.send("/ws-request/get-notification-by-receiver",this.$store.state.userInfo.id,{});
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

                    // console.log(JSON.stringify(notifications[i]));
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
                    } else {
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
        padding: 10px;
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