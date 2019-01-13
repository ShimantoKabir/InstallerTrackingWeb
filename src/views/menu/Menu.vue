<template>
    <div class="vue-template" >
        <div class="vue-template" >
            <div class="container-fluid" >
                <div class="row" >
                    <div class="col-sm-12" >
                        <div class="my-div" >
                            <div class="my-div-head" >
                                <div class="my-div-head-left" >
                                    <h3>Create menu</h3>
                                </div>
                                <div class="my-div-head-right" >
                                    <i class="fas fa-info-circle" ></i>
                                </div>
                            </div>
                            <div class="my-div-body" style="justify-content: flex-start" >
                                <div class="my-div-body-30" >

                                    <div class="menu-container">

                                        <div v-for="(c,i) in menu" class="my-menu" style="border-right: 1px solid #4CAF50;" >
                                            <p v-bind:class="{activeMenuStyle : selectedNode.i === i  && selectedNode.j===-1 && selectedNode.k===-1}"
                                               v-on:click="selectedMenu(i,-1,-1,c,$event)" >{{c.text}}</p>

                                            <div class="menu-container"  >

                                                <div v-for="(m,j) in c.children" class="my-menu" >
                                                    <p v-bind:class="{activeMenuStyle : selectedNode.i === i  && selectedNode.j===j && selectedNode.k===-1}"
                                                       v-on:click="selectedMenu(i,j,-1,m,$event)" ><i v-bind:class="m.icon" ></i> {{m.text}}</p>

                                                    <div class="menu-container" >

                                                        <div  v-for="(s,k) in m.children" class="my-menu" >
                                                            <p v-bind:class="{activeMenuStyle : selectedNode.i === i  && selectedNode.j===j && selectedNode.k===k}"
                                                               v-on:click="selectedMenu(i,j,k)" >{{s.text}}</p>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="my-div-body-20" >
                                    <table style="position: fixed" >
                                        <tbody>
                                        <tr>
                                            <td>
                                                <button class="my-btn" v-on:click="deleteChild" ><i class="fas fa-trash" ></i></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <button class="my-btn" v-on:click="addChild" ><i class="fas fa-plus" ></i></button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-div-body-50" >
                                    <table v-model="selectedMenuModel" >
                                        <tbody>
                                        <tr>
                                            <td>
                                                Text
                                            </td>
                                            <td>
                                                <input type="text" v-model="selectedMenuModel.text" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Icon
                                            </td>
                                            <td>
                                                <input type="text" v-model="selectedMenuModel.icon" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Link
                                            </td>
                                            <td>
                                                <input type="text" v-model="selectedMenuModel.link" />
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="my-div-foot" >
                                <div class="my-div-foot-left" >
                                    <button class="my-btn" v-on:click="save" >Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import Notification from "../notificaiton/Notification";
    export default {
        name: "Menu",
        components: {Notification},
        mounted(){
          this.getInitialData();
        },
        data(){
            return{
                menu : [],
                selectedNode : {
                    i : '',
                    j : '',
                    k : ''
                },
                isEditableFiledOpen : false,
                selectedMenuModel : {
                    link : '',
                    text: '',
                    icon: '',
                }
            }
        },
        methods : {
            getInitialData(){

                this.$http.post(this.$store.state.baseUrl+"/menu/get-by-user-id",this.$store.state.userInfo)
                .then(res=>{

                    console.log(res.data);

                    if (res.status===200){

                        this.menu = res.data;

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Can not get menu !',
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Can not get menu !',
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        status : 400
                    });
                })
            },
            selectedMenu(i,j,k){
                this.selectedNode.i = i;
                this.selectedNode.j = j;
                this.selectedNode.k = k;
                if (this.selectedNode.i !== -1 && this.selectedNode.j === -1 && this.selectedNode.k === -1) {
                    this.selectedMenuModel = this.menu[this.selectedNode.i];
                }else if (this.selectedNode.i !== -1 && this.selectedNode.j !== -1 && this.selectedNode.k === -1){
                    this.selectedMenuModel = this.menu[this.selectedNode.i].children[this.selectedNode.j];
                }else {
                    this.selectedMenuModel = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k];
                }
            },
            up(){

                try {

                    if (this.selectedNode.i !== -1 && this.selectedNode.j === -1 && this.selectedNode.k === -1) {

                        let x = this.menu[this.selectedNode.i].srl;
                        let y = this.menu[this.selectedNode.i-1].srl;

                        this.menu[this.selectedNode.i].srl = y;
                        this.menu[this.selectedNode.i-1].srl = x;

                        this.menu.sort(function(a, b){
                            return a.srl - b.srl;
                        });

                    }else if (this.selectedNode.i !== -1 && this.selectedNode.j !== -1 && this.selectedNode.k === -1){

                        if (this.selectedNode.i === 0 && this.selectedNode.j === 0 && this.selectedNode.k === -1){
                            console.log("last");
                        }else {

                            let x = this.menu[this.selectedNode.i].children[this.selectedNode.j].srl;
                            let y = this.menu[this.selectedNode.i].children[this.selectedNode.j-1].srl;

                            this.menu[this.selectedNode.i].children[this.selectedNode.j-1].srl = x;
                            this.menu[this.selectedNode.i].children[this.selectedNode.j].srl = y;

                            this.selectedNode.j = this.selectedNode.j-1;

                            this.menu[this.selectedNode.i].children.sort(function(a, b){
                                return a.srl - b.srl;
                            });

                        }

                    } else {

                        if (this.selectedNode.k > 0){

                            let x = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k].srl;
                            let y = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k-1].srl;

                            this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k-1].srl = x;
                            this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k].srl = y;

                            this.selectedNode.k = this.selectedNode.k-1;

                            this.menu[this.selectedNode.i].children[this.selectedNode.j].children.sort(function(a, b){
                                return a.srl - b.srl;
                            });

                        }else {

                            if (this.selectedNode.i===0 && this.selectedNode.j===0 && this.selectedNode.k===0){
                                console.log("last");
                            }else {
                                let obj = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k];
                                this.menu[this.selectedNode.i].children[this.selectedNode.j].children.splice(this.selectedNode.k,1);

                                let cLn = this.menu[this.selectedNode.i].children[this.selectedNode.j-1].children.length;

                                obj.srl = cLn+1;

                                this.menu[this.selectedNode.i].children[this.selectedNode.j-1].children.push(obj);

                                this.menu[this.selectedNode.i].children[this.selectedNode.j-1].children.sort(function(a, b){
                                    return a.srl - b.srl;
                                });

                                this.selectedNode.k = cLn;
                                this.selectedNode.j = this.selectedNode.j-1;
                            }

                        }

                    }

                }catch (e) {

                }

            },
            down(){

                if (this.selectedNode.i !== -1 && this.selectedNode.j === -1 && this.selectedNode.k === -1) {

                    let x = this.menu[this.selectedNode.i].srl;
                    let y = this.menu[this.selectedNode.i+1].srl;

                    this.menu[this.selectedNode.i].srl = y;
                    this.menu[this.selectedNode.i+1].srl = x;

                    this.menu.sort(function(a, b){
                        return a.srl - b.srl;
                    });

                }else if (this.selectedNode.i !== -1 && this.selectedNode.j !== -1 && this.selectedNode.k === -1){

                    let x = this.menu[this.selectedNode.i].children[this.selectedNode.j].srl;
                    let y = this.menu[this.selectedNode.i].children[this.selectedNode.j+1].srl;

                    this.menu[this.selectedNode.i].children[this.selectedNode.j+1].srl = x;
                    this.menu[this.selectedNode.i].children[this.selectedNode.j].srl = y;

                    this.selectedNode.j = this.selectedNode.j+1;

                    this.menu[this.selectedNode.i].children.sort(function(a, b){
                        return a.srl - b.srl;
                    });

                } else {

                    let ln = this.menu[this.selectedNode.i].children[this.selectedNode.j].children.length;
                    console.log(this.selectedNode.i+"|"+this.selectedNode.j+"|"+this.selectedNode.k+"| ln "+ln);
                    if (ln===this.selectedNode.j){
                        console.log("hi");
                    }

                    if (this.selectedNode.k !== (ln-1)){

                        let x = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k].srl;
                        let y = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k+1].srl;

                        this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k+1].srl = x;
                        this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k].srl = y;

                        this.selectedNode.k = this.selectedNode.k+1;

                        this.menu[this.selectedNode.i].children[this.selectedNode.j].children.sort(function(a, b){
                            return a.srl - b.srl;
                        });

                    }else {


                        console.log("c"+this.menu[this.selectedNode.i].children[this.selectedNode.j].children.indexOf(this.selectedNode.k));

                        let obj = this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k];
                        this.menu[this.selectedNode.i].children[this.selectedNode.j].children.splice(this.selectedNode.k,1);

                        obj.srl = 1;

                        this.menu[this.selectedNode.i].children[this.selectedNode.j+1].children.push(obj);

                        for (let i = 0; i < this.menu[this.selectedNode.i].children[this.selectedNode.j+1].children.length-1; i++) {
                            this.menu[this.selectedNode.i].children[this.selectedNode.j+1].children[i].srl = i+2;
                        }

                        this.menu[this.selectedNode.i].children[this.selectedNode.j+1].children.sort(function(a, b){
                            return a.srl - b.srl;
                        });

                        this.selectedNode.k = 0;
                        this.selectedNode.j = this.selectedNode.j+1;

                    }

                }

            },
            save(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait !',
                });

                this.$http.post(this.$store.state.baseUrl+"/menu/save",{
                    userBeen : this.$store.state.userInfo,
                    menuBeanList : this.menu
                }).then(res=>{

                    console.log(res.data);

                    if (res.data.code===200){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                        });
                    }

                }).catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : "Menu save unsuccessful !",
                        callBackMethod : this.save,
                        needTryAgain : true,
                        status : 400
                    });
                })
            },
            addChild(){
                if (this.selectedNode.i !== -1 && this.selectedNode.j === -1 && this.selectedNode.k === -1) {
                    // root
                    this.menu[this.selectedNode.i].children.push({
                        id: 0,
                        oId: 0,
                        text: 'New child',
                        icon: '',
                        parentId: 0,
                        rank: 0,
                        srl: 0,
                        children: []
                    });
                }else if (this.selectedNode.i !== -1 && this.selectedNode.j !== -1 && this.selectedNode.k === -1){
                    // menu
                    this.menu[this.selectedNode.i].children[this.selectedNode.j].children.push({
                        id: 0,
                        oId: 0,
                        text: 'New child',
                        icon: '',
                        parentId: 0,
                        rank: 0,
                        srl: 0,
                        menuPermissionList: []
                    });
                }else {
                    // child
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyMsg : 'Sorry, Sir/Mam you can not add child of the menu'
                    });
                }
            },
            deleteChild(){
                if (this.selectedNode.i !== -1 && this.selectedNode.j === -1 && this.selectedNode.k === -1) {
                    // root
                    if (this.menu[this.selectedNode.i].children.length>0){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyMsg : 'Sorry, Sir/Mam you can not delete this menu cause this menu got child'
                        });
                    }

                }else if (this.selectedNode.i !== -1 && this.selectedNode.j !== -1 && this.selectedNode.k === -1){
                    // menu

                    if (this.menu[this.selectedNode.i].children[this.selectedNode.j].children.length>0){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyMsg : 'Sorry, Sir/Mam you can not delete this menu cause this menu got child'
                        });
                    } else {
                        this.menu[this.selectedNode.i].children.splice(this.selectedNode.j,1);
                    }

                }else {

                    if (this.menu[this.selectedNode.i].children[this.selectedNode.j].children[this.selectedNode.k].menuPermissionList.length===0){

                        this.menu[this.selectedNode.i].children[this.selectedNode.j].children.splice(this.selectedNode.k,1);

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyMsg : 'Sorry, Sir/Mam you can not delete this menu cause this menu is permitted with some department !'
                        });
                    }

                }
            }
        }
    }
</script>

<style scoped>
    .menu-container{
        margin-left: 40px;
    }
    .my-menu{
        border-left: 1px solid #4CAF50;
    }
    .my-menu p{
        font-size: 15px;
        border-top: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
        border-left: 1px solid lightgray;
        padding: 3px;
        margin: 2px;
    }
    .my-menu p:hover{
        cursor: grab;
    }
    .activeMenuStyle{
        background-color: #4CAF50;
        color: white;
        border-radius: 3px;
    }
</style>