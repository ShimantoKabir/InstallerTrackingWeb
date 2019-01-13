<template>
    <div class="vue-template" >
        <transition name="slide-fade" >
            <div class="notification-modal" v-if="isNotificationOpen" >
                <div class="notification-area" >
                    <div v-bind:style="notificationProperty" class="notification-con" >
                        <div class="notification-head" >
                            <div class="notification-head-left" >
                                <i v-if="notificationProperty.titleIcon" :class=notificationProperty.titleIcon ></i> &nbsp;
                                <h3 v-if="notificationProperty.title" >{{notificationProperty.title}}</h3>
                            </div>
                            <div class="notification-head-right" >
                                <i class="fas fa-times-circle" v-on:click="closeNotification" ></i>
                            </div>
                        </div>
                        <div class="notification-body" >
                            <div class="notification-body-icon" >
                                <i v-bind:style="bodyIconColor" v-if="notificationProperty.bodyIcon" :class=notificationProperty.bodyIcon ></i>
                            </div>
                            <div class="notification-body-msg" >
                                <p v-if="notificationProperty.bodyMsg" >{{notificationProperty.bodyMsg}}</p>
                            </div>
                        </div>
                        <div class="notification-foot" >
                            <div class="notification-foot-left" >
                                <button v-show="notificationProperty.needTryAgain" class="btn-try-again" v-on:click="tryAgain" >Try again</button>
                            </div>
                            <div class="notification-foot-right" >
                                <button style="margin-left: 3px" class="my-btn" v-on:click="closeNotification" >Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Notification",
        mounted(){

        },
        data(){
            return {
                isNotificationOpen : false,
                notificationProperty : {
                    title : '',
                    titleIcon : '',
                    bodyIcon : '',
                    bodyMsg : '',
                    width : '',
                    callBackMethod:{},
                    needTryAgain : false,
                    status : 200
                },
                bodyIconColor:{
                    color: ""
                }
            }
        },
        methods:{
            closeNotification(){
                this.isNotificationOpen = false;
            },
            tryAgain(){
                this.notificationProperty.callBackMethod();
            },
            showNotification(){
                this.isNotificationOpen = true;
            },
            setNotificationProperty(notificationProperty){
                this.showNotification();
                this.notificationProperty.title = notificationProperty.title;
                this.notificationProperty.titleIcon = notificationProperty.titleIcon;
                this.notificationProperty.bodyIcon = notificationProperty.bodyIcon;
                this.notificationProperty.bodyMsg = notificationProperty.bodyMsg;
                this.notificationProperty.width = notificationProperty.width;
                this.notificationProperty.callBackMethod = notificationProperty.callBackMethod;
                this.notificationProperty.needTryAgain = notificationProperty.needTryAgain;
                this.notificationProperty.status = notificationProperty.status;
                if (this.notificationProperty.status===400){
                    this.bodyIconColor.color = "red";
                }else if (this.notificationProperty.status===200){
                    this.bodyIconColor.color = "green";
                }else {
                    this.bodyIconColor.color = "gray";
                }
            }
        }
    }
</script>

<style scoped>
    .notification-modal {
        position: fixed;
        z-index: 2;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }
    .notification-area{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .notification-con{
        color: black;
        background-color: white;
    }
    .notification-head{
        display: flex;
        padding: 10px;
        justify-content: space-between;
        align-items: baseline;
        border-bottom: 1px solid #dddddd;
        background-color: #4CAF50;
        color: white;
    }
    .notification-head-left{
        display: flex;
        align-items: baseline;
    }
    .notification-head-right{
        cursor: pointer;
    }
    .notification-body{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px;
    }
    .notification-body-icon{
        font-size: 30px;
        padding: 10px;
    }
    .notification-body-msg{

    }
    .notification-foot{
        padding: 10px;
        border-top: 2px solid #dddddd;
        display: flex;
        justify-content: space-between;
    }
    .notification-foot-left{
        display: flex;
    }
    .notification-foot-right{
        display: flex;
    }
    .btn-try-again{
        background-color: #373d45;
        color: white;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        cursor: pointer;
        border-radius: 3px;
        border: 1px solid #373d45;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12);
        -webkit-transition-duration: 0.4s;
        transition-duration: 0.4s;
    }
    .btn-try-again:hover{
        font-family: Arial, Helvetica, sans-serif;
        border: 1px solid #373d45;
        background-color: transparent;
        color: #373d45;
    }
</style>