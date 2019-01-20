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
                                <button class="my-btn" v-on:click="showLocation" >Show location</button>
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
                                    <gmap-marker :key="index"
                                                 v-for="(m, index) in markers"
                                                 :position="m.position"
                                                 :clickable="true"
                                                 :draggable="true"
                                                 v-on:click="getPosition(m.position)"></gmap-marker>
                                    <gmap-polyline v-bind:path.sync="path" v-bind:options="{ strokeColor:'#7f8000'}"> </gmap-polyline>
                                    <gmap-info-window @closeclick="isPosAddressInfoOpen=false"
                                            :opened="isPosAddressInfoOpen"
                                            :position="selectedMarkerPosition" >
                                            <div v-if="addressInfo" >
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>Compound code</td>
                                                            <td>{{addressInfo.compoundCode}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Global code</td>
                                                            <td>{{addressInfo.globalCode}}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Formatted address</td>
                                                            <td>{{addressInfo.formattedAddress}}</td>
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

    export default {
        name: "TrackByUser",
        components: {Notification},
        mounted(){
            this.getInitData();
            this.geoLocate();
        },
        data(){
            return{
                departments : [],
                users : [],
                locations : [],
                selectedDepartmentId : -1,
                selectedUserId : -1,
                selectedMarkerPosition : {},
                date : '',
                locationInterval : '',
                isMapOpen : false,
                center: {
                    lat: '',
                    lng: ''
                },
                markers: [],
                path: [],
                isPosAddressInfoOpen : false,
                addressInfo : {
                    compoundCode : '',
                    globalCode : '',
                    formattedAddress : ''
                }
            }
        },
        methods:{
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait .... !',
                });

                let url = this.$store.state.baseUrl;

                this.$http.get(url+"/department/get")
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){
                            this.departments = res.data.list;
                            this.$refs.noti.closeNotification();
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Initial data processing error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : 'Can not get department list !',
                                width : '30%',
                                callBackMethod : this.getInitialData,
                                needTryAgain : true,
                                status : 400
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'Initial data processing error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Can not get department list !',
                            width : '60%',
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : 400
                        });
                    })

            },
            departmentChange(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait .... !',
                });

                let url = this.$store.state.baseUrl;

                this.$http.post(url+"/user/get-by-department",{
                    oId : this.selectedDepartmentId
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){
                        this.users = res.data.list;
                        this.$refs.noti.closeNotification();
                    } else {
                        this.users = [];
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.departmentChange,
                            needTryAgain : true,
                            status : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        width : '60%',
                        callBackMethod : this.departmentChange,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })

            },
            showLocation(){

                this.isMapOpen = true;
                let url = this.$store.state.baseUrl;

                this.$http.post(url+"/location/track-by-user",{
                    id : this.selectedUserId,
                    createdDate : this.date
                })
                .then(res=>{

                    if (res.data.code===200){
                        this.locations = res.data.list;
                        this.center.lat = res.data.list[0].lat;
                        this.center.lng = res.data.list[0].lon;
                        console.log(JSON.stringify(this.locations));
                    }

                })
                .catch(err=>{
                    // console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.showLocation,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })
                .finally(res=>{
                    this.markers = [];
                    // console.log(JSON.stringify(this .locations));
                    for (let i = 0; i < this.locations.length; i++) {

                        let marker = {
                            lat: this.locations[i].lat,
                            lng: this.locations[i].lon
                        };
                        this.markers.push({
                            position: marker
                        });
                        this.path.push({
                            lat: this.locations[i].lat,
                            lng: this.locations[i].lon
                        })
                    }

                    console.log(JSON.stringify(this.path));
                    this.countLocation();

                })

            },
            closeMap(){
                this.isMapOpen = false;
                clearInterval(this.locationInterval);
            },
            geoLocate() {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
            },
            getPosition(pos){

                this.selectedMarkerPosition = pos;
                this.isPosAddressInfoOpen = true;

                this.$http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+pos.lat+","+pos.lng+"&key=AIzaSyAOHSMMhB3tSoIZuf8eRqQBeJbSl0CrfUw")
                .then(res=>{
                    console.log(JSON.stringify(res));
                    if (res.data.status==="OK"){
                        this.addressInfo.compoundCode = res.data.plus_code.compound_code;
                        this.addressInfo.globalCode = res.data.plus_code.global_code;
                        this.addressInfo.formattedAddress = res.data.results[0].formatted_address;
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
            countLocation(){

                let lThis = this;
                let url = this.$store.state.baseUrl;

                this.locationInterval = setInterval(function(){

                    lThis.$http.post(url+"/location/count-by-user",{
                        id : lThis.selectedUserId,
                        createdDate : lThis.date
                    })
                    .then(res=>{

                        console.log(res.data);
                        if (res.data !== lThis.locations.length){
                            lThis.addNewMarker();
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                    })

                }, 5000);

            },
            addNewMarker(){

                let url = this.$store.state.baseUrl;

                this.$http.post(url+"/location/get-new",{
                    id : this.selectedUserId,
                    createdDate : this.date
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));
                    this.locations.push(res.data.object);

                    let marker = {
                        lat: res.data.object.lat,
                        lng: res.data.object.lon
                    };
                    this.markers.push({ position: marker });
                    this.path.push({
                        lat: res.data.object.lat,
                        lng: res.data.object.lon
                    })

                })
                .catch(err=>{
                    // console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.showLocation,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })

            }
        }
    }
</script>

<style scoped>

</style>