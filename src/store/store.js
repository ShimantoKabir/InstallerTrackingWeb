import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        isSideNavBarOpen : true,
        menu : '',
        route : [],
        userInfo : '',
        baseUrl : 'http://52.37.3.109:3307',
        userPresence : ''
    }
});