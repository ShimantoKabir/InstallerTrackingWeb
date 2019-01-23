<template>
    <div class="vue-template" >
        <SideNavBar></SideNavBar>
        <div class="my-view-con" v-bind:style="expandMyViewConStyle" >
            <HeaderNavBar></HeaderNavBar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

    import SideNavBar from "./../common/SideNavBar";
    import HeaderNavBar from "./../common/HeaderNavBar";
    import CookieManager from "../Helper/CookieManager"

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
        computed:{
            isSideNavBarOpen(){
                return this.$store.state.isSideNavBarOpen
            }
        },
        components: {SideNavBar,HeaderNavBar},
        watch: {
            isSideNavBarOpen() {
                try {
                    let isSideNavBarOpen = this.$store.state.isSideNavBarOpen;
                    if (isSideNavBarOpen){
                        this.expandMyViewConStyle.width = '100%';
                        this.expandMyViewConStyle.marginLeft = '0%';
                    } else {
                        this.expandMyViewConStyle.width = '80%';
                        this.expandMyViewConStyle.marginLeft = '20%';
                    }
                } catch (exp) {
                    alert(exp);
                }
            }
        }
    }
</script>

<style scoped>
    .my-view-con{
        margin-left: 20%;
        width: 80%;
        transition: 0.5s;
    }
</style>