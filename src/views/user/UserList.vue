<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>User list</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i class="fas fa-info-circle" ></i>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <table class="my-tbl" >
                                <table-head
                                        ref="th"
                                        :row-par-page="10"
                                        :set-table-data="setTableData"
                                        :header-name-list="headerNameList" >
                                </table-head>
                                <tbody>
                                <tr v-for="(u,i) in userBnList" >
                                    <td>{{i}}</td>
                                    <td>{{u.userName}}</td>
                                    <td>{{u.userEmail}}</td>
                                    <td>{{u.deptName}}</td>
                                    <td v-if="u.isUserActive===1" >Yes</td>
                                    <td v-else >No</td>
                                    <td v-if="u.isUserApproved===1" >Yes</td>
                                    <td v-else >No</td>
                                    <td><i class="fas fa-edit" v-on:click="manageUser(u)" ></i></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <notification ref="noti" ></notification>

        <transition name="slide-fade" >
            <div class="my-model" v-show="isManageUserModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-3" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>Manage user</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeManageUserModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Department</td>
                                            <td>
                                                <select v-model="manageUserInfo.deptId" >
                                                    <option v-bind:value="-1" >--select--</option>
                                                    <option v-bind:value="dl.oId" v-for="dl in departmentList" >{{dl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-if="isApproved" >Unapprove</td>
                                            <td v-else >Approve</td>
                                            <td><input v-model="isApproved" v-on:change="approveChange" type="checkbox" /></td>
                                        </tr>
                                        <tr>
                                            <td v-if="isActive" >Deactive</td>
                                            <td v-else >Active</td>
                                            <td><input v-model="isActive" v-on:change="activeChange" type="checkbox" /></td>
                                        </tr>
                                        <tr>
                                            <td v-on:click="onOpenMap" colspan="2" ><span style="cursor: pointer;font-size: 10px;color: #4caf50" ><i class="fas fa-map-marked-alt" ></i> &nbsp; Click here and pick address using map</span></td>
                                        </tr>
                                        <tr>
                                            <td>Latitude</td>
                                            <td>
                                                <input type="text" readonly v-model="manageUserInfo.lat" >
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Longitude</td>
                                            <td>
                                                <input type="text" readonly v-model="manageUserInfo.lon" >
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>
                                                <textarea readonly v-model="manageUserInfo.address" ></textarea>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-div-foot" >
                                    <div class="my-div-foot-left" >
                                        <button class="my-btn" v-on:click="manageUserAttempt" >Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

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

    </div>
</template>

<script>

    import Notification from "../notificaiton/Notification";
    import CookieManager from "../../Helper/CookieManager"
    import TableHead from "../../common/TableHead";

    export default {
        name: "UserList",
        components: {TableHead, Notification},
        data(){
            return{
                userBnList : [],
                isManageUserModelOpen : false,
                departmentList : [],
                isApproved : '',
                isActive : '',
                manageUserInfo : {
                    id : '',
                    deptId : -1,
                    isUserActive : '',
                    isUserApproved : '',
                    lat : '',
                    lon : '',
                    address : ''
                },
                isMapOpen : false,
                needToCloseNotification : true,
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'Name',
                        sortBy : 'userName',
                    },
                    {
                        name : 'Email',
                        sortBy : 'userEmail',
                    },
                    {
                        name : 'Department name',
                        sortBy : 'deptName',
                    },
                    {
                        name : 'Is active',
                        sortBy : '',
                    },
                    {
                        name : 'Is approved',
                        sortBy : '',
                    },
                    {
                        name : 'Manage',
                        sortBy : '',
                    }
                ],
                markerPosition : {
                    lat: -6.219502,
                    lng: 106.851511,
                    address : ''
                },
            }
        },
        mounted(){
            this.getInitData();
        },
        methods:{
            onOpenMap() {

                this.isMapOpen = true;

            },
            placePickDone(){

                this.isMapOpen = false;

                if (this.markerPosition.address){
                    this.manageUserInfo.address = this.markerPosition.address;
                    this.manageUserInfo.lat = this.markerPosition.lat;
                    this.manageUserInfo.lon = this.markerPosition.lng;
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
            setTableData(list){
                this.userBnList = list;
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/manage-init",{
                    userBn : CookieManager.getParsedData("userInfo")
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.$refs.th.setComTableData(res.data.userBnList);
                        this.departmentList = res.data.departmentBnList;

                        if (this.needToCloseNotification){this.$refs.noti.closeNotification();}

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Initial data processing error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            status : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.manageUserAttempt,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })

            },
            manageUser(u){

                if (u.deptId){
                    this.manageUserInfo.deptId = u.deptId;
                }else {
                    this.manageUserInfo.deptId = -1;
                }

                if (u.isUserActive===1){
                    this.isActive = true;
                    this.manageUserInfo.isUserActive=1;
                }else {
                    this.isActive = false;
                    this.manageUserInfo.isUserActive=0;
                }
                if (u.isUserApproved===1){
                    this.isApproved = true;
                    this.manageUserInfo.isUserApproved=1;
                }else {
                    this.isApproved = false;
                    this.manageUserInfo.isUserApproved=0;
                }
                this.isManageUserModelOpen = true;
                this.manageUserInfo.id = u.id;
                this.manageUserInfo.address = u.address;
                this.manageUserInfo.lon = u.lon;
                this.manageUserInfo.lat = u.lat;

                // this.markerPosition.lat = u.lat;
                // this.markerPosition.lng = u.lon;
                // this.markerPosition.address = u.address;

            },
            closeManageUserModel(){
                this.isManageUserModelOpen = false;
            },
            manageUserAttempt(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait',
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/user/manage",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    manageUserBn : this.manageUserInfo
                })
                .then(res=>{
                    console.log(JSON.stringify(res.data));
                    if (res.data.code===200){
                        this.getInitData();
                        this.needToCloseNotification = false;
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            status : res.data.code,
                            needOk : true
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.manageUserAttempt,
                            needTryAgain : true,
                            status : res.data.code
                        });
                    }
                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.manageUserAttempt,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })
            },
            approveChange(){
                if (this.isApproved){
                    this.manageUserInfo.isUserApproved=1;
                } else {
                    this.manageUserInfo.isUserApproved=0;
                }
            },
            activeChange(){
                if (this.isActive){
                    this.manageUserInfo.isUserActive=1;
                } else {
                    this.manageUserInfo.isUserActive=0;
                }
            }
        }
    }
</script>

<style scoped>

</style>
