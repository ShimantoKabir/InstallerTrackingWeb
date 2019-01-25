<template>
    <router-view></router-view>
</template>
<script>

    import CookieManager from "./Helper/CookieManager"

    export default {
        name: "App",
        mounted(){
            this.checkLogin();
        },
        methods : {
            checkLogin(){

                if (!CookieManager.check("userInfo")){
                    this.$router.push({path: '/'});
                }else {
                    // this.$router.push({path: '/dashboard'});
                }

            }
        }
    }
</script>
