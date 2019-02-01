<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>Tracking by user</h3>
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
                                        <td>Select department</td>
                                        <td>
                                            <select v-on:change="departmentChange" v-model="selectedDepartmentId" >
                                                <option v-bind:value="-1" >select</option>
                                                <option v-bind:value="d.oId" v-for="d in departments" >{{d.name}}</option>
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
                                        <td>Select user</td>
                                        <td>
                                            <select v-model="selectedUserId" >
                                                <option v-bind:value="-1" >select</option>
                                                <option v-bind:value="u.id" v-for="u in users" >{{u.userEmail}}</option>
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
                                        <td>Select date</td>
                                        <td>
                                            <input v-model="date" type="date" />
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div class="my-div-foot" >
                            <div class="my-div-foot-left" >
                                <button class="my-btn" v-on:click="verifyInput('showLocation')" >Show location</button>
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

                                    <gmap-marker v-on:click="getPosition(u,index)"
                                                 :key="index"
                                                 v-for="(u,index) in userLocationList"
                                                 :label="{ text: index.toString(),color : 'white'}"
                                                 :draggable="true"
                                                 :position="u.position">

                                        <gmap-circle
                                                :center="u.position"
                                                :radius="3000"
                                                :options="{fillColor:'green',fillOpacity:1.0}"
                                                :visible="true">
                                        </gmap-circle>

                                    </gmap-marker>

                                    <gmap-polyline v-bind:path.sync="userLocationList" v-bind:options="{ strokeColor:'green'}"> </gmap-polyline>

                                    <gmap-info-window @closeclick="isPosAddressInfoOpen=false"
                                                      :opened="isPosAddressInfoOpen"
                                                      :position="selectedMarkerPosition" >

                                        <div v-if="markerInfo" >
                                            <table class="my-tbl" >
                                                <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Description</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>Index</td>
                                                    <td>{{markerInfo.index}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Date</td>
                                                    <td>{{markerInfo.date}}</td>
                                                </tr>
                                                <tr>
                                                    <td>User name</td>
                                                    <td>{{markerInfo.userName}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Work order</td>
                                                    <td>{{markerInfo.workOrderName}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Address</td>
                                                    <td>{{markerInfo.formattedAddress}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Position</td>
                                                    <td>latitude : {{markerInfo.latitude}} , Longitude : {{markerInfo.longitude}}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <i v-else class="fas fa-sync fa-spin" ></i>
                                    </gmap-info-window>
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
    import CookieManager from "../../Helper/CookieManager";

    export default {
        name: "TrackByUser",
        components: {Notification},
        mounted(){
            this.checkWebSocketConnection();
            this.getInitData();
            this.connect();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                departments : [],
                users : [],
                locations : [],
                selectedDepartmentId : -1,
                selectedUserId : -1,
                selectedMarkerPosition : {},
                date : '',
                locationInterval : '',
                isMapOpen : false,
                connected : false,
                center: {
                    lat: 25.699035,
                    lng: 88.703594
                },
                markers: [],
                path: [],
                isPosAddressInfoOpen : false,
                markerInfo : {
                    index : '',
                    date : '',
                    userName : '',
                    workOrderName : '',
                    formattedAddress : '',
                    latitude : '',
                    longitude : ''
                },
                needToCloseNotification : true,
                userLocationList : [],
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
                if (which==="showLocation"){
                    if (this.selectedDepartmentId===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "You need to select a work order !",
                            needOk : true
                        });
                    } else if (this.selectedUserId===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "You need to choose a user !",
                            needOk : true
                        });
                    }else if (this.date===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "You need to choose a date !",
                            needOk : true
                        });
                    } else {
                        this.showLocation();
                    }
                }
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait .... !',
                });

                let url = this.$store.state.baseUrl;

                this.$http.get(url+"/department/get")
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){
                            this.departments = res.data.list;
                            if (this.needToCloseNotification){
                                this.$refs.noti.closeNotification();
                            }
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.getInitialData,
                                needTryAgain : true,
                                code : res.data.msg
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err.response.data));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            code : err.response.data.status
                        });
                    })

            },
            departmentChange(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait .... !',
                });

                this.$http.post(this.url+"/user/get-by-department",{
                    departmentBn : {
                        oId : this.selectedDepartmentId
                    },
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){
                        this.users = res.data.list;
                        if (this.needToCloseNotification){
                            this.$refs.noti.closeNotification();
                        }
                    } else {
                        this.users = [];
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.departmentChange,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.departmentChange,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            showLocation(){

                this.isMapOpen = true;

                let req = {
                    locationBn : {
                        userId : this.selectedUserId,
                        createdDate : this.date
                    }
                };

                this.stompClient.send("/ws-request/get-location-by-user",JSON.stringify(req),{});


            },
            closeMap(){
                this.isMapOpen = false;
            },
            getPosition(u,index){

                this.selectedMarkerPosition = u.position;
                this.isPosAddressInfoOpen = true;

                this.markerInfo.index = index;
                this.markerInfo.date = u.createdDate;
                this.markerInfo.userName = u.userName;
                this.markerInfo.workOrderName = u.workOrderName;
                this.markerInfo.latitude = u.position.lat;
                this.markerInfo.longitude = u.position.lng;

                this.$http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+u.position.lat+","+u.position.lng+"&key=AIzaSyAOHSMMhB3tSoIZuf8eRqQBeJbSl0CrfUw")
                    .then(res=>{
                        console.log(JSON.stringify(res));
                        if (res.data.status==="OK"){
                            this.markerInfo.formattedAddress = res.data.results[0].formatted_address;
                        }
                    })
                    .catch(err=>{
                        // console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            status : err.response.data.status
                        });
                    })

            },
            connect() {

                this.socket = new SockJS(this.$store.state.webSocketBaseUrl);
                this.stompClient = Stomp.over(this.socket);
                this.stompClient.debug = () => {};
                this.stompClient.connect({},
                    frame => {
                        this.connected = true;
                        this.stompClient.subscribe("/ws-response/location-by-user", tick => {
                            this.userLocationList = JSON.parse(tick.body).list;
                            // console.log(JSON.stringify(this.userLocationList))
                            this.center.lat = this.userLocationList[0].position.lat;
                            this.center.lng = this.userLocationList[0].position.lng;
                        });
                    },
                    error => {
                        console.log(error);
                        this.connected = false;
                    }
                );

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