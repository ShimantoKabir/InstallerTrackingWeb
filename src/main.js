import Vue from 'vue'
import App from './App'
import router from './router'
import {store} from './store/store'
import axios from 'axios'
import * as VueGoogleMaps from "vue2-google-maps";
import CookieManager from "./Helper/CookieManager"

import '@/assets/css/grid.min.css'
import '@/assets/css/main.css'
import '@/assets/css/fontawesome.min.css'

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyAOHSMMhB3tSoIZuf8eRqQBeJbSl0CrfUw",
        libraries: "places" // necessary for places input
    }
});

new Vue({
    el: '#app',
    router,
    store:store,
    components: {App},
    template: '<App/>'
});

router.beforeEach((to, from, next) => {

    if (to.matched.some(record => record.meta.requiresAuth)) {

        if (CookieManager.check("userInfo")) {

            let routerList = store.state.route;
            let isNextOk = true;

            for (let i = 0; i < routerList.length; i++) {
                if (to.path === routerList[i]){
                    isNextOk = true;
                    break;
                }else {
                    isNextOk = false;
                }
            }

            if (isNextOk){
                next();
            }else {
                next({
                    name : 'Dashboard'
                })
            }

        } else {
            next({
                name : 'LoginReg'
            })
        }

    }else {
        // requiresAuth === false
        if (CookieManager.check("userInfo")) {
            next({
                name : 'Dashboard'
            })
        } else {
            next()
        }
    }

});
