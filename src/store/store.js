import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        isSideNavBarOpen : true,
        menu : '',
        route : [],
        userInfo : '',
        baseUrl : 'http://192.168.0.3:3307',
        userPresence : '',
        webSocketBaseUrl : "http://192.168.0.3:3307/ws"
    }
});