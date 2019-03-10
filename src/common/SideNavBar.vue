<template>
    <div class="vue-template" >
        <div class="side-nav-bar" v-bind:style="minimizeSideNavBarStyle" >
            <div class="side-nav-bar-head" >
                <i class="fas fa-map-marked-alt"></i> &nbsp;&nbsp; <h3>PT.GSPE</h3>
            </div>
            <div class="side-nav-bar-body" v-if="sideNavMenu" >
                <div class="snb-child-con" v-for="(mnu,i) in sideNavMenu.children" >
                    <div class="snb-child-head" v-on:click="subMenuChildHead(i)" >
                        <span><i :class="mnu.icon"></i>&nbsp; {{mnu.text}}</span>
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div v-if="openSnbListNumber===i" class="snb-child-list" >
                        <ul>
                            <li v-for="sbMnu in mnu.children" ><i class="fas fa-angle-right"></i>&nbsp; <router-link :to="sbMnu.link" >{{sbMnu.text}}</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import CookieManager from "../Helper/CookieManager"
    import Notification from "../views/notificaiton/Notification";

    export default {
        name: "SideNavBar",
        components: {Notification},
        mounted(){
            this.getMenu();
        },
        data() {
            return{
                url : this.$store.state.baseUrl,
                openSnbListNumber : -1,
                sideNavMenu : [],
                minimizeSideNavBarStyle:{
                    width: '20%'
                }
            }
        },
        methods:{
            getMenu(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : "Please wait, getting menu form server ... !",
                    needOk : true,
                });

                this.$http.post(this.url+"/menu/get-by-department",{
                    departmentBn : {
                        id : CookieManager.getParsedData("userInfo").deptId
                    }
                })
                .then(response=>{

                    console.log(JSON.stringify(response.data));

                    if (response.data.code===200){

                        this.$refs.noti.closeNotification();
                        this.sideNavMenu = response.data.menuBn;
                        this.$store.state.menu = response.data.menuBn;

                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.getMenu,
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
                        callBackMethod : this.getMenu,
                        needTryAgain : true,
                        code : error.response.data.status
                    });
                })

            },
            subMenuChildHead(i){
                this.openSnbListNumber = i;
            }
        }
    }
</script>

<style scoped>
    .side-nav-bar{
        height: 100%;
        width: 20%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        background-color: #2B3137;
        overflow-x: hidden;
        transition: 0.5s;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12);
    }
    .side-nav-bar-head{
        color: lightgray;
        display: flex;
        justify-content: center;
        align-items: baseline;
        background-color: #24292E;
        padding: 19px;
        cursor: pointer;
    }
    .side-nav-bar-body{
        color: white;
    }
    .snb-child-head{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        cursor: pointer;
        font-size: 12px;
        background-color: #31373e;
        padding: 10px;
        border-bottom: 1px solid #262b30;
    }
    .snb-child-list > ul{
        list-style: none;
    }
    .snb-child-list > ul > li {
        font-size: 12px;
        background-color: #24292E;
        padding: 10px;
        border-bottom: 1px solid #1f2227;
        color: white;
    }
    .snb-child-list > ul > li > a{
        text-decoration: none;
        color: white;
    }
</style>
