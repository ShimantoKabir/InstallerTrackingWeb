<template>
    <div class="vue-template" >
        <SideNavBar ref="snb" ></SideNavBar>
        <div class="my-view-con" v-bind:style="expandMyViewConStyle" >
            <HeaderNavBar :on-header-toggle-btn-click="onHeaderToggleBtnClick" ></HeaderNavBar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

    import SideNavBar from "./../common/SideNavBar";
    import HeaderNavBar from "./../common/HeaderNavBar";
    import CookieManager from "../Helper/CookieManager";

    export default {
        name: "Dashboard",
        mounted(){

        },
        data(){
          return{
              expandMyViewConStyle:{
                  width: '80%',
                  marginLeft : "20%"
              }
          }
        },
        methods : {
            onHeaderToggleBtnClick(){
                if (this.expandMyViewConStyle.width==="80%"){
                    this.expandMyViewConStyle.width = '100%';
                    this.expandMyViewConStyle.marginLeft = '0%';
                    this.$refs.snb.minimizeSideNavBarStyle.width = '0%';
                } else {
                    this.expandMyViewConStyle.width = '80%';
                    this.expandMyViewConStyle.marginLeft = '20%';
                    this.$refs.snb.minimizeSideNavBarStyle.width = '20%';
                }
            }
        },
        components: {SideNavBar,HeaderNavBar}
    }
</script>

<style scoped>
    .my-view-con{
        margin-left: 20%;
        width: 80%;
        transition: 0.5s;
    }
</style>
