import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        menu : '',
        route : [],
        userInfo : '',
        // baseUrl : 'http://192.168.0.3:3307',
        baseUrl : 'http://52.37.3.109:3307',
        userPresence : '',
        // webSocketBaseUrl : "http://192.168.0.3:3307/ws",
        webSocketBaseUrl : "http://52.37.3.109:3307/ws"
    }
});