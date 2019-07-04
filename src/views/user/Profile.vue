<template>
    <div class="vue-template" >
        <div class="container-fluid" >
        <div class="row justify-content-center" >
            <div class="col-sm-4" >
                <div class="my-div" >
                    <div class="my-div-head" >
                        <div class="my-div-head-left" >
                            <h3>Profile</h3>
                        </div>
                        <div class="my-div-head-right" >
                            <i class="fas fa-info-circle" ></i>
                        </div>
                    </div>
                    <div class="my-div-body" >
                        <table>
                            <tr>
                                <td>Username</td>
                                <td><input type="text" v-model="userInfoModel.userName" /></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input readonly type="text" v-model="userInfoModel.userEmail" /></td>
                            </tr>
                            <tr>
                                <td>Department</td>
                                <td><input readonly type="text" v-model="userInfoModel.deptName" /></td>
                            </tr>
                            <tr>
                                <td v-on:click="onOpenMap" colspan="2" ><span style="cursor: pointer;font-size: 10px;color: #4caf50" ><i class="fas fa-map-marked-alt" ></i> &nbsp; Click here and pick address using map</span></td>
                            </tr>
                            <tr>
                                <td>Latitude</td>
                                <td><input type="text" v-model="userInfoModel.lat" ></td>
                            </tr>
                            <tr>
                                <td>Latitude</td>
                                <td><input type="text" v-model="userInfoModel.lon" ></td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td><textarea readonly type="text" v-model="userInfoModel.address" ></textarea></td>
                            </tr>
                        </table>
                    </div>
                    <div class="my-div-foot" >
                        <div class="my-div-foot-left" >
                            <button class="my-btn" v-on:click="saveUserProfile" >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isMapOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-10" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3 v-if="markerPosition.address" >{{markerPosition.address}}</h3>
                                        <h3 v-else >Pick address, latitude, longitude</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <button class="my-btn" v-on:click="placePickDone" >Done</button>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <div class="my-div-body-100" >
                                        <gmap-autocomplete style="padding: 7px 10px;width: 100%;border: 1px solid lightgray;border-radius: 3px"
                                                           @place_changed="setPlace">
                                        </gmap-autocomplete>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <div class="my-div-body-100" >

                                        <gmap-map :center="markerPosition" :zoom="10" style="width:100%;  height: 500px;" v-on:click="getCoordinate($event)" >

                                            <gmap-marker :position="markerPosition" ></gmap-marker>

                                        </gmap-map>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import Notification from "../notificaiton/Notification";
    import CookieManager from "../../Helper/CookieManager"

    export default {
        name: "Profile",
        components: {Notification},
        data(){
            return{
                isMapOpen : false,
                markerPosition : {
                    lat: -6.219502,
                    lng: 106.851511,
                    address : ''
                },
                url : this.$store.state.baseUrl,
                userInfoModel :{
                    userName : '',
                    userEmail : '',
                    deptName : '',
                    address : '',
                    lat : '',
                    lon : '',
                }
            }
        },
        mounted(){
            this.getInitData()
        },
        methods: {
            getInitData(){

                this.userInfoModel.userName = CookieManager.getParsedData("userInfo").userName;
                this.userInfoModel.userEmail = CookieManager.getParsedData("userInfo").userEmail;
                this.userInfoModel.deptName = CookieManager.getParsedData("userInfo").deptName;
                this.userInfoModel.address = CookieManager.getParsedData("userInfo").address;
                this.userInfoModel.lat = CookieManager.getParsedData("userInfo").lat;
                this.userInfoModel.lon = CookieManager.getParsedData("userInfo").lon;

            },
            saveUserProfile(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait !',
                });

                this.$http.post(this.url+"/user/save/profile",{
                    userBn : {
                        id : CookieManager.getParsedData("userInfo").id,
                        userEmail : CookieManager.getParsedData("userInfo").userEmail,
                        userName : this.userInfoModel.userName,
                        sessionId : CookieManager.getParsedData("userInfo").sessionId,
                        address : this.userInfoModel.address,
                        lat : this.userInfoModel.lat,
                        lon : this.userInfoModel.lon
                    },
                    menuBn :{
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    if (res.data.code===200){

                        this.getInitData();

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.saveUserProfile,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.saveUserProfile,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })
            },
            onOpenMap(){

                this.isMapOpen = true;
                if (this.site.id!==-1){
                    this.markerPosition.lat = this.site.lat;
                    this.markerPosition.lng = this.site.lon;
                    this.markerPosition.address = this.site.address;
                }

            },
            setPlace(place){

                this.markerPosition.lat = place.geometry.location.lat();
                this.markerPosition.lng = place.geometry.location.lng();
                this.markerPosition.address = place.formatted_address;

            },
            getCoordinate($event){
                console.log(JSON.stringify($event));
                this.markerPosition.lat = $event.latLng.lat();
                this.markerPosition.lng = $event.latLng.lng();

                this.$http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+this.markerPosition.lat+","+this.markerPosition.lng+"&key=AIzaSyAOHSMMhB3tSoIZuf8eRqQBeJbSl0CrfUw")
                    .then(res=>{
                        // console.log(JSON.stringify(res));
                        if (res.data.status==="OK"){
                            this.markerPosition.address = res.data.results[0].formatted_address;
                        }else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : "Can't get address !",
                            });
                        }
                    })
                    .catch(err=>{
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            status : err.response.data.status
                        });
                    })

            },
            placePickDone(){

                this.isMapOpen = false;

                if (this.markerPosition.address){
                    this.userInfoModel.address = this.markerPosition.address;
                    this.userInfoModel.lat = this.markerPosition.lat;
                    this.userInfoModel.lon = this.markerPosition.lng;
                }

            },
        }
    }
</script>

<style scoped>

</style>
