export default class MyCookie {

    static setCookie(cname,cvalue,expires) {
        document.cookie = cname + "=" + expires + ";" + 0 + ";path=/";
    }

    static checkCookie(cname) {
        let user=this.getCookie("username");
        if (user !== "") {
            return false;
        } else {
            return true;
        }
    }

    static getCookie(cname) {

        let name = cname + "=";

        let decodedCookie = decodeURIComponent(document.cookie);

        let ca = decodedCookie.split(';');

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }

}