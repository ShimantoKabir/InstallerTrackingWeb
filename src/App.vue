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

                // don't check cookie for email-verification and forgot password
                if (!window.location.href.includes("email-verification") && !window.location.href.includes("forgot-password")){
                    if (!CookieManager.check("userInfo")){
                        this.$router.push({path: '/'});
                    }else {
                        // this.$router.push({path: '/dashboard'});
                    }
                }

            }
        }
    }
</script>
