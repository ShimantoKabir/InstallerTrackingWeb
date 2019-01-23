<template>
    <router-view></router-view>
</template>
<script>

    import CookieManager from "./Helper/CookieManager"

    export default {
        name: "App",
        created() {
            window.addEventListener("beforeunload",this.saveLoginInitialDataBeforeUnload);
            this.updateUserPresence();
        },
        mounted(){
            this.getLoginInitialData();
            this.checkLogin();
        },
        methods : {
            saveLoginInitialDataBeforeUnload(){
                localStorage.setItem("loginInitialData",JSON.stringify(this.$store.state));
            },
            getLoginInitialData(){
                var loginInitialData = JSON.parse(localStorage.getItem('loginInitialData'));
                if (loginInitialData == null){
                    console.log("vuex has no data")
                }else {
                    this.$store.state.isSideNavBarOpen = loginInitialData.isSideNavBarOpen;
                    this.$store.state.menu = loginInitialData.menu;
                    this.$store.state.route = loginInitialData.route;
                    this.$store.state.baseUrl = loginInitialData.baseUrl;
                    this.$store.state.userInfo = loginInitialData.userInfo;
                    localStorage.removeItem('loginInitialData')
                }
            },
            checkLogin(){

                if (window.location.hash.includes("forgot-password") || window.location.hash.includes("email-verification")){

                }else {
                    if (CookieManager.check("userInfo")){
                        this.$router.push({path: '/'});
                    }
                }
            },
            updateUserPresence(){

                let _this = this;

                setInterval(function(){

                    if (_this.$store.state.userInfo){

                        let url = _this.$store.state.baseUrl;

                        _this.$http.post(url+"/user/update-presence",_this.$store.state.userInfo)
                        .catch(err=> {
                            console.log(JSON.stringify(err.response.data));
                        });

                    }

                }, 5000);

            }
        }
    }
</script>
