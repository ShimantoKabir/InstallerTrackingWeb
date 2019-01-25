<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="chat-user-head" >
                            <div class="my-div-head-left" >
                                <div class="chat-user" >
                                    <img style="width: 30px;height: 30px;" src="../../assets/img/user.png"/> &nbsp;
                                    <div>
                                        <h3 v-if="selectedUserInfo.name" >{{selectedUserInfo.name}}</h3>
                                        <h3 v-else >Select user</h3>
                                        <div v-if="selectedUserInfo.pos!==-1" >
                                            <p v-if="userList[this.selectedUserInfo.pos].isOnline!==1" style="font-size: 10px" >{{selectedUserInfo.lastPresenceDate}}</p>
                                            <p v-else style="font-size: 10px;color: #4CAF50" >Online
                                                <span v-if="userList[this.selectedUserInfo.pos].isTyping===1 && loggedInUserId===userList[this.selectedUserInfo.pos].forWho" > | Typing ... </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-div-head-right" >
                                <input placeholder="Search people" type="text" />
                            </div>
                        </div>
                        <div class="my-div-body" style="padding: 0px;background-color: rgba(185, 230, 244, 0.28)" >
                            <div class="my-div-body-70 chat-box" >
                                <div style="padding-bottom: 60px" >
                                    <div v-for="(c,i) in conversation" v-if="c.sender!==loggedInUserId" class="speech-start" >
                                        <img style="width: 30px;height: 30px;" src="../../assets/img/user.png"/>
                                        <div style="padding-left: 5px" >
                                            <!--<h5 v-if="c.isSeen===0 && c.receiver===selectedUserInfo.id" style="color: darkgoldenrod" >{{c.speech}}</h5>-->
                                            <!--<h5 v-else >{{c.speech}}</h5>-->
                                            <h5>{{c.speech}}</h5>
                                            <span class="speech-status" >{{c.sendDate}}</span>
                                        </div>
                                    </div>
                                    <div v-else class="speech-end" >
                                        <div style="padding-left: 5px" >
                                            <!--<h5 v-if="c.isSeen===0 && c.receiver===selectedUserInfo.id" style="color: darkgoldenrod" >{{c.speech}}</h5>-->
                                            <!--<h5 v-else >{{c.speech}}</h5>-->
                                            <h5>{{c.speech}}</h5>
                                            <span class="speech-status" >{{c.sendDate}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-div-body-30" >
                                <div class="people" >
                                    <div v-for="(u,i) in userList" class="people-single"  v-on:click="userClick(u,i)" v-if="u.id!==loggedInUserId" >
                                        <img style="width: 20px;height: 20px" src="../../assets/img/user.png"/>
                                        <div class="user-status" >
                                            <div>
                                                <h5 v-bind:class="{selectedUserStyle : selectedUserInfo.pos === i}" >{{u.userName}}</h5>
                                                <span v-if="u.isOnline!==1" style="font-size: 10px" >{{u.lastPresenceDate}}</span>
                                            </div>
                                            <i v-if="u.isOnline===1" style="font-size: 10px;color: #4CAF50" class="fas fa-circle" ></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="about" >
                                    <h3 v-if="selectedUserInfo.name" >{{selectedUserInfo.name}}</h3>
                                    <h3 v-else >People or friend info</h3>
                                    <p>{{selectedUserInfo.email}}</p>
                                    <p v-if="selectedUserInfo.deptName" > Department : {{selectedUserInfo.deptName}}</p>

                                    <button v-on:click="manageFriendRequest(0,selectedUserInfo.id)"
                                            v-if="selectedUserInfo.areFriend===0"
                                            style="margin-top: 10px" class="my-btn" >Send friend request</button>

                                    <button v-on:click="manageFriendRequest(2,selectedUserInfo.id)"
                                            v-if="selectedUserInfo.areFriend===2"
                                            style="margin-top: 10px" class="my-btn" >Un friend</button>

                                    <button v-on:click="manageFriendRequest(3,selectedUserInfo.id)"
                                            v-if="selectedUserInfo.areFriend===1 && selectedUserInfo.sender === this.loggedInUserId"
                                            style="margin-top: 10px" class="my-btn" >Cancel friend request</button>

                                    <button v-on:click="manageFriendRequest(1,selectedUserInfo.id)"
                                            v-if="selectedUserInfo.areFriend===1 && selectedUserInfo.sender !== this.loggedInUserId"
                                            style="margin-top: 10px" class="my-btn" >Accept friend request</button>

                                </div>

                            </div>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" style="width: 70%" >
                                <input type="text" placeholder="Type a message here ... "
                                v-model="speech"
                                v-on:keyup="speechChange"
                                v-on:focus="speechFocus"
                                v-on:blur="speechBlur"/>
                            </div>
                            <div class="my-div-foot-right" >
                                <button class="my-btn" v-on:click="sendSpeech" ><i class="fas fa-location-arrow" ></i></button>
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
    import SockJS from "sockjs-client";
    import Stomp from "webstomp-client";

    export default {
        name: "Messenger",
        components: {Notification},
        mounted(){
            this.checkWebSocketConnection();
            this.loggedInUserId = CookieManager.getParsedData("userInfo").id;
            this.connect();
            this.scrollToBottom();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                loggedInUserId : '',
                userList : [],
                userInfo : '',
                areFriend : '',
                activePfBtn : 0,
                pfButtons : ['People','Friend'],
                selectedUserInfo :{
                    pos : -1,
                    id : '',
                    name : '',
                    email : '',
                    deptName : '',
                    areFriend : '',
                    sender: '',
                    isOnline : '',
                    lastPresenceDate : ''
                },
                friendRequestId : '',
                speech : '',
                conversation : [],
                conversationId : 0,
                sendMessage: null,
                connected: false
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
            userClick(obj,i){

                this.conversation = [];
                this.selectedUserInfo.pos = i;
                this.selectedUserInfo.name = obj.userName;
                this.selectedUserInfo.email = obj.userEmail;
                this.selectedUserInfo.deptName = obj.deptName;
                this.selectedUserInfo.isOnline = obj.isOnline;
                this.selectedUserInfo.lastPresenceDate = obj.lastPresenceDate;
                this.selectedUserInfo.id = obj.id;

                if (obj.id !== CookieManager.getParsedData("userInfo").id) {

                    this.$http.post(this.url+"/friend-request/check-friend",{
                        friendRequestBn : {
                            sender : CookieManager.getParsedData("userInfo").id,
                            receiver : obj.id
                        },
                        userBn : CookieManager.getParsedData("userInfo")
                    }).then(res=>{

                        console.log(JSON.stringify(res.data));

                        this.selectedUserInfo.areFriend = res.data.object.areFriend;
                        this.selectedUserInfo.sender = res.data.object.sender;
                        this.friendRequestId = res.data.object.id;
                        this.conversationId = res.data.object.conversationId;

                        if (res.data.code===200){
                            this.fetchConversation();
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.manageFriendRequest,
                            needTryAgain : true,
                            code : err.response.data.status
                        });
                    })

                }else {
                    this.selectedUserInfo.areFriend = '';
                }

            },
            manageFriendRequest(i,receiver){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : "Please wait ... !",
                });

                this.$http.post(this.url+"/friend-request/manage",{
                    friendRequestBn : {
                        areFriend : i,
                        sender : CookieManager.getParsedData("userInfo").id,
                        receiver : receiver,
                        id : this.friendRequestId,
                        senderEmail : CookieManager.getParsedData("userInfo").userEmail,
                        receiverEmail : this.selectedUserInfo.email
                    },
                    userBn : CookieManager.getParsedData("userInfo")
                }).then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        if (i===0){
                            this.selectedUserInfo.areFriend = 1;
                            this.selectedUserInfo.sender = this.loggedInUserId;
                        } else if (i===1){
                            this.selectedUserInfo.areFriend = 2;
                        } else if (i===3){
                            this.selectedUserInfo.areFriend = 0;
                        }else {
                            this.selectedUserInfo.areFriend = 0;
                        }

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                        });

                        this.stompClient.send("/ws-request/get-notification-by-receiver",String(this.selectedUserInfo.id),{});

                    }

                })
                .catch(err=>{
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.manageFriendRequest,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            fetchConversation(){

                if (this.conversationId!==0){

                    this.$http.post(this.url+"/conversation/get-by-conversation-id",{
                        conversationBn : {
                            conversationId : this.conversationId
                        },
                        userBn : CookieManager.getParsedData("userInfo")
                    }).then(res=>{

                        if (res.data.code===200){
                            this.conversation = res.data.list;
                        }

                    }).catch(err=>{
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.fetchConversation,
                            needTryAgain : true,
                            code : err.response.data.status
                        });
                    }).finally(res=>{
                        this.scrollToBottom();
                    })

                }

            },
            sendSpeech(){

                if (this.selectedUserInfo.areFriend===2){

                    this.$http.post(this.url+"/conversation/save",{
                        conversationBn : {
                            sender : CookieManager.getParsedData("userInfo").id,
                            receiver : this.selectedUserInfo.id,
                            conversationId : this.conversationId,
                            speech : this.speech
                        },
                        userBn : CookieManager.getParsedData("userInfo")
                    }).then(res=>{

                        if (res.data.code===200){

                            console.log(res.data.msg);
                            this.speech = '';
                            if (this.stompClient && this.stompClient.connected) {
                                this.stompClient.send("/ws-request/get-conversation-by-id",String(this.conversationId),{});
                            }

                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.sendSpeech,
                                needTryAgain : true,
                                code : res.data.code
                            });
                        }

                    })
                    .catch(err=>{
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.sendSpeech,
                            needTryAgain : true,
                            code : err.response.data.status
                        });
                    })

                }else {
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'This person is not your friend !'
                    });
                }

            },
            speechChange(e){
                if (e.keyCode === 13) {
                    this.sendSpeech();
                }
            },
            speechFocus(){

                if (this.conversationId!==0){

                    this.$http.post(this.url+"/conversation/seen-the-unseen",{
                        conversationBn : {
                            conversationId : this.conversationId,
                            sender : this.loggedInUserId,
                            receiver : this.selectedUserInfo.id
                        },
                        userBn : CookieManager.getParsedData("userInfo")
                    }).then(res=>{

                        console.log(this.conversation.length);

                        if (res.data.code===400){
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.speechFocus,
                                needTryAgain : true,
                                code : res.data.code
                            });
                        }else {
                            for (let i = 0; i < this.conversation.length; i++) {
                                this.conversation[i].isSeen = 1
                            }
                        }


                    }).catch(err=>{
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.fetchConversation,
                            needTryAgain : true,
                            code : err.response.data.status
                        });
                    })

                }

            },
            speechBlur(){

                if (this.conversationId!==0){

                    this.$http.post(this.url+"/user/change-typing-status",{
                        userBn : CookieManager.getParsedData("userInfo")
                    }).then(res=>{

                        // console.log(JSON.stringify(res.data));
                        // this.conversation = res.data.list;
                        if (res.data.code===400){
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.speechBlur,
                                needTryAgain : true,
                                code : res.data.code
                            });
                        }

                    }).catch(err=>{
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.speechBlur,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

                }

            },
            scrollToBottom(){
                let chatBox = document.querySelector(".chat-box");
                chatBox.scrollTop = chatBox.scrollHeight;
            },
            connect() {
                this.socket = new SockJS("http://192.168.0.3:3307/ws");
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.debug = () => {};
                this.stompClient.connect({},
                    frame => {
                        this.connected = true;
                        console.log(frame);
                        this.stompClient.subscribe("/ws-response/user/get", tick => {
                            this.userList = JSON.parse(tick.body).list;
                            // console.log(JSON.stringify(this.userList))
                        });
                        this.stompClient.subscribe("/ws-response/conversations", tick => {
                            let conversationList = JSON.parse(tick.body).list;
                            let conversationListId = JSON.parse(tick.body).conversationId;
                            if (conversationList!==null){
                                if (this.conversation.length!==conversationList.length){
                                    if (this.conversationId===conversationListId){
                                        this.conversation.push(conversationList[conversationList.length-1]);
                                        this.scrollToBottom();
                                    }
                                }
                            }
                        });
                    },
                    error => {
                        console.log(error);
                        this.connected = false;
                    }
                );
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
    .people{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        height: 300px;
        overflow-y: auto;
    }
    .people-single{
        padding: 5px;
        border-bottom: 1px solid rgba(173, 216, 230, 0.36);
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .user-status{
        width: 100%;
        padding-left: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .about{
        height: 150px;
        border-top: 1px solid rgba(60, 137, 66, 0.37);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .active {
        color: #4CAF50;
    }
    .selectedUserStyle {
        color: #4CAF50;
    }
    .chat-user{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .chat-user-head{
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgba(60, 137, 66, 0.37);
    }
    .speech-start{
        display: flex;
        align-items: center;
        text-align: left;
        padding: 5px;
        margin: 5px;
    }
    .speech-end{
        display: flex;
        flex-direction: column;
        padding: 10px;
        margin: 10px;
        text-align: right;
    }
    .speech-status{
        font-size: 10px;
    }
    .chat-box{
        height: 450px;
        overflow-y: scroll;
    }
</style>