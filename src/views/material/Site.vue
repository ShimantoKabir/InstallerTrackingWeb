<template>
    <div class="vue-template" >
        <div class="vue-template" >
            <div class="container-fluid" >
                <div class="row" >
                    <div class="col-sm-12" >
                        <div class="my-tab" >
                            <div class="my-tab-head" >
                                <button v-bind:class="{active : selectedTab === i}" v-for="(tb,i) in tabButtons" v-on:click="tabBtnClickListener(i)" >{{tb}}</button>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-body" >
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td><input type="text" v-model="site.name" /></td>
                                        </tr>
                                        <tr>
                                            <td>Map</td>
                                            <td title="Pick up your address, latitude, longitude from google map" ><button class="my-btn" v-on:click="openMap" ><i class="fas fa-map-marked-alt" ></i></button></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Address</td>
                                            <td><textarea v-model="site.address" ></textarea></td>
                                        </tr>
                                        <tr>
                                            <td>Latitude</td>
                                            <td><input type="number" v-model="site.lat" /></td>
                                        </tr>
                                        <tr>
                                            <td>Longitude</td>
                                            <td><input type="number" v-model="site.lon" /></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===1" class="my-tab-body" >
                                <div class="my-tab-100" >
                                    <table class="my-tbl" >
                                        <table-head
                                                ref="th"
                                                :row-par-page="3"
                                                :set-table-data="setTableData"
                                            :header-name-list="headerNameList" >
                                        </table-head>
                                        <tbody>
                                            <tr v-for="(sl,i) in siteList" >
                                                <td>{{i+1}}</td>
                                                <td>{{sl.name}}</td>
                                                <td>{{sl.address}}</td>
                                                <td>{{sl.lat}}</td>
                                                <td>{{sl.lon}}</td>
                                                <td><i class="fas fa-edit" v-on:click="editClick(sl)" ></i></td>
                                                <td><i class="fas fa-trash" ></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="site.id===-1" class="my-btn" v-on:click="saveSite" >Save</button>
                                <button v-else v-on:click="updateSite" class="my-btn" >Update</button>
                                <button class="my-btn"  v-on:click="reset" >Reset</button>
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
    import TableHead from "../../common/TableHead";

    export default {
        name: "Site",
        components: {TableHead, Notification},
        mounted(){
            this.getSiteList();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                tabButtons : ['Create site','Site list'],
                selectedTab : 0,
                isMapOpen : false,
                markerPosition : {
                    lat: -6.219502,
                    lng: 106.851511,
                    address : ''
                },
                site :{
                    id : -1,
                    name : '',
                    address : '',
                    lat : '',
                    lon : '',
                    modifiedBy : CookieManager.getParsedData("userInfo").id
                },
                currentPlace: null,
                siteList : [],
                needToCloseNotification : true,
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'Name',
                        sortBy : 'name',
                    },
                    {
                        name : 'Address',
                        sortBy : 'address',
                    },
                    {
                        name : 'Latitude',
                        sortBy : 'lat',
                    },
                    {
                        name : 'Longitude',
                        sortBy : 'lon',
                    },
                    {
                        name : 'Edit',
                        sortBy : '',
                    },
                    {
                        name : 'Delete',
                        sortBy : '',
                    }
                ],
            }
        },
        methods:{
            setTableData(list){
                this.siteList = list;
            },
            getSiteList(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/site/get",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data.list));

                    if (res.data.code===200){
                        this.$refs.th.setComTableData(res.data.siteList);
                        if (this.needToCloseNotification){this.$refs.noti.closeNotification();}

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getSiteList,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.getSiteList,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            saveSite(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });


                this.$http.post(this.url+"/site/save",{
                    siteBn : this.site,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;

                        this.site.address = '';
                        this.site.lat = '';
                        this.site.lon = '';
                        this.site.name = '';

                        this.getSiteList();
                        this.needToCloseNotification = false;

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code,
                            needOk : true
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.saveSite,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.saveSite,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            setPlace(place){

                this.markerPosition.lat = place.geometry.location.lat();
                this.markerPosition.lng = place.geometry.location.lng();
                this.markerPosition.address = place.formatted_address;

            },
            openMap(){
                this.isMapOpen = true;
                if (this.site.id!==-1){
                    this.markerPosition.lat = this.site.lat;
                    this.markerPosition.lng = this.site.lon;
                    this.markerPosition.address = this.site.address;
                }
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
                    this.site.address = this.markerPosition.address;
                    this.site.lat = this.markerPosition.lat;
                    this.site.lon = this.markerPosition.lng;
                }

            },
            editClick(sl){
                this.selectedTab = 0;
                this.site.id = sl.id;
                this.site.name = sl.name;
                this.site.address = sl.address;
                this.site.lat = sl.lat;
                this.site.lon = sl.lon;
            },
            updateSite(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/site/update",{
                    siteBn : this.site,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.site.address = '';
                        this.site.id = -1;
                        this.site.name = '';
                        this.site.address = '';
                        this.site.lat = '';
                        this.site.lon = '';
                        this.markerPosition.lat = '';
                        this.markerPosition.lng = '';
                        this.markerPosition.address = '';

                        this.getSiteList();

                        this.needToCloseNotification = false;

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code,
                            needOk : true
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.updateSite,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.updateSite,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            reset(){
                this.selectedTab = 0;
                this.site.id = -1;
                this.site.name = '';
                this.site.address = '';
                this.site.lat = '';
                this.site.lon = '';
                this.markerPosition.lat = '';
                this.markerPosition.lng = '';
                this.markerPosition.address = '';
            }
        }
    }
</script>

<style scoped>

</style>
