<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>Tracking by work order</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i class="fas fa-info-circle" ></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <div class="my-div-body-30" >
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Work order</td>
                                        <td>
                                            <select v-model="woId" >
                                                <option v-bind:value="-1" >-- select --</option>
                                                <option v-for="wl in workOrderList" v-bind:value="wl.id" >{{wl.name}}</option>
                                            </select>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="my-div-body-30" >
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Date</td>
                                        <td><input type="date" v-model="date" /></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" >
                                <button class="my-btn" v-on:click="verifyInput('openGoogleMap')" >Open google map</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid" v-if="isMapOpen" style="margin-bottom: 20px" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>Map</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i class="fas fa-times-circle" v-on:click="closeMap" ></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <div class="my-div-body-100" >
                                <gmap-map :center="center" :zoom="10" style="width:100%;  height: 500px;" >
                                    <span v-for="ul in userLocationList" >
                                        <gmap-marker
                                                :key="index"
                                                v-for="(m, index) in ul.locationList"
                                                :position="m.position" >
                                        </gmap-marker>
                                        <gmap-polyline v-bind:path.sync="ul.locationList" v-bind:options="{ strokeColor:randomColorGenerator.generate()}"> </gmap-polyline>
                                    </span>
                                </gmap-map>
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
    import SockJS from "sockjs-client";
    import Stomp from "webstomp-client";
    import RandomColorGenerator from "../../Helper/RandomColorGenerator";

    export default {
        name: "TrackByWorkOrder",
        components: {Notification},
        mounted(){
            this.checkWebSocketConnection();
            this.getWorkOrder();
            this.connect();

        },
        data(){
            return{
                randomColorGenerator : RandomColorGenerator,
                url : this.$store.state.baseUrl,
                workOrderList : [],
                needToCloseNotification : true,
                woId : -1,
                date : '',
                connected : false,
                isMapOpen : false,
                center: {
                    lat: 25.699035,
                    lng: 88.703594
                },
                userLocationList : ''
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
            verifyInput(which){
                if (which==="openGoogleMap"){
                    if (this.woId===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "You need to select a work order !",
                            needOk : true
                        });
                    } else if (this.date===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "You need to choose a date !",
                            needOk : true
                        });
                    } else {
                        this.openGoogleMap();
                    }
                }
            },
            getWorkOrder(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.get(this.url+"/work-order/get")
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.workOrderList = res.data.list;
                            if (this.needToCloseNotification){
                                this.$refs.noti.closeNotification();
                            }

                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.getInitData,
                                needTryAgain : true,
                                status : 400
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    });
            },
            openGoogleMap(){

                this.isMapOpen = true;

                let req = {
                    locationBn : {
                        createdDate : this.date
                    },
                    workOrderBn : {
                        id : this.woId
                    },
                    userBn : this.$store.state.userInfo,
                    menuBn : {
                        link : "/track-by-work-order"
                    }
                };

                this.stompClient.send("/ws-request/get-location-by-work-order",JSON.stringify(req),{});

            },
            connect() {

                this.socket = new SockJS("http://192.168.0.3:3307/ws");
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.debug = () => {};
                this.stompClient.connect({},
                    frame => {
                        this.connected = true;
                        this.stompClient.subscribe("/ws-response/locations", tick => {
                            this.userLocationList = JSON.parse(tick.body).list;
                            console.log(JSON.stringify(this.userLocationList))
                        });
                    },
                    error => {
                        console.log(error);
                        this.connected = false;
                    }
                );

            },
            closeMap(){
                this.isMapOpen = false;
            },
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

</style>