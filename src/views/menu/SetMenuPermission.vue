<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-div" >
                        <div class="my-div-head" >
                            <div class="my-div-head-left" >
                                <h3>Set menu permission</h3>
                            </div>
                            <div class="my-div-head-right" >
                                <i v-on:click="reload" class="fas fa-sync"></i>
                            </div>
                        </div>
                        <div class="my-div-head" style="border-bottom: none" >
                            <div class="my-div-head-left" >
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Select department</td>
                                            <td>
                                                <select v-on:change="departmentChange" v-model="selectedDepartmentId" >
                                                    <option v-bind:value="d.oId" v-for="d in departments" >{{d.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="my-div-head-right" >
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><button v-on:click="save" class="my-btn" >Save <i class="fas fa-save"></i></button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="my-div-body" >
                            <div class="my-div-body-40" >
                                <div class="smp-menu" >
                                    <h4>Existing menu</h4>
                                    <div v-for="(em,emi) in existingMenu" class="smp-menu-box" >
                                        <div class="smp-menu-data" >
                                            <h4>{{em.text}}</h4>
                                            <div class="smp-menu-list" >
                                                <p v-bind:class="{activeMenuStyle : clickedParentMenu === emi && clickedChildMenu === emsi && clickedSideName === 'left'}" v-for="(ems,emsi) in em.children" v-on:click="selectExistingMenu(emi,emsi,ems)" >{{ems.text}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-div-body-20" >
                                <div class="smp-action" >
                                    <button class="my-btn" v-on:click="moveMenu('right')" ><i class="fas fa-arrow-right"></i></button>
                                    <button class="my-btn" v-on:click="moveMenu('left')" ><i class="fas fa-arrow-left"></i></button>
                                </div>
                            </div>
                            <div class="my-div-body-40" >
                                <div class="smp-menu" >
                                    <h4>Selected menu</h4>
                                    <div v-for="(em,emi) in selectedMenu" class="smp-menu-box" >
                                        <div class="smp-menu-data" >
                                            <h4>{{em.text}}</h4>
                                            <div class="smp-menu-list" >
                                                <div class="selected-menu-close" v-bind:class="{activeMenuStyle : clickedParentMenu === emi && clickedChildMenu === emsi && clickedSideName === 'right'}" v-for="(ems,emsi) in em.children" >
                                                    <p v-on:click="selectSelectedMenu(emi,emsi,ems)" >{{ems.text}}</p>
                                                    <i v-if="clickedParentMenu === emi && clickedChildMenu === emsi && clickedSideName === 'right'" v-on:click="selectedMenuRemove" class="fas fa-times-circle" ></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
    import CookieManager from "../../Helper/CookieManager"

    export default {

        name: "SetMenuPermission",
        components: {Notification},
        mounted(){
            this.getInitialData();
            this.getMenuByDepartment(CookieManager.getParsedData("userInfo").deptId,false);
            this.selectedDepartmentId = CookieManager.getParsedData("userInfo").deptId;
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                departments : [],
                selectedDepartmentId : '',
                existingMenu : [],
                selectedMenu : [],
                movingMenu : {
                    parentPos : '',
                    childPos : '',
                    childItem : ''
                },
                clickedChildMenu : '',
                clickedParentMenu : '',
                clickedSideName : '',
                needToCloseNotification : true
            }
        },
        methods:{
            reload(){
                this.needToCloseNotification = true;
                this.getInitialData();
            },
            getInitialData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/department/get-by-user",{
                    userBn : CookieManager.getParsedData("userInfo")
                })
                .then(res=>{

                    if (res.data.code===200){

                        this.departments = res.data.list;
                        if (this.needToCloseNotification){
                            this.$refs.noti.closeNotification();
                        }

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            code : res.data.msg
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            departmentChange(){

                this.getMenuByDepartment(this.selectedDepartmentId,true);

            },
            getMenuByDepartment(selectedDepartmentId,repeat){

                this.$http.post(this.url+"/menu/get-by-department",{
                    departmentBn : {
                        id : selectedDepartmentId
                    },
                    userBn : CookieManager.getParsedData("userInfo")
                })
                .then(response=>{
                    if (response.data.code===200){

                        if (repeat) {
                            this.selectedMenu = response.data.list[0].children;
                        }else {
                            localStorage.setItem('existingMenu',JSON.stringify(response.data.list[0].children));
                            this.existingMenu = JSON.parse(localStorage.getItem('existingMenu'));
                            localStorage.removeItem('existingMenu');
                            this.selectedMenu = response.data.list[0].children;
                        }

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.getMenuByDepartment,
                            needTryAgain : true,
                            code : response.data.code
                        });
                    }
                })
                .catch(error=> {
                    console.log(JSON.stringify(error.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : error.response.data.message,
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        code : error.response.data.status
                    });
                });

            },
            selectExistingMenu(parentPos,childPos,childItem){
                this.clickedSideName = 'left';
                this.clickedChildMenu = childPos;
                this.clickedParentMenu = parentPos;
                this.movingMenu.parentPos = parentPos;
                this.movingMenu.childPos = childPos;
                this.movingMenu.childItem = childItem;
            },
            selectSelectedMenu(parentPos,childPos,childItem){
                this.clickedSideName = 'right';
                this.clickedChildMenu = childPos;
                this.clickedParentMenu = parentPos;
                this.movingMenu.parentPos = parentPos;
                this.movingMenu.childPos = childPos;
                this.movingMenu.childItem = childItem;
            },
            moveMenu(side){
                if (side==='left'){
                    this.clickedSideName = 'left';
                    let checkExistingStatus = this.checkExistMenu(this.movingMenu.childItem.id,this.existingMenu[this.movingMenu.parentPos].children);
                    if (checkExistingStatus===1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'This menu already exist in left side',
                            width : '30%'
                        });
                    } else {
                        this.selectedMenu[this.movingMenu.parentPos].children.splice(this.movingMenu.childPos,1);
                        this.existingMenu[this.movingMenu.parentPos].children.push(this.movingMenu.childItem);
                        this.clickedChildMenu = this.existingMenu[this.movingMenu.parentPos].children.length-1;
                        this.movingMenu.childPos = this.existingMenu[this.movingMenu.parentPos].children.length-1;
                    }
                } else {
                    this.clickedSideName = 'right';
                    let checkExistingStatus = this.checkExistMenu(this.movingMenu.childItem.id,this.selectedMenu[this.movingMenu.parentPos].children);
                    if (checkExistingStatus===1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'This menu already exist in right side',
                            width : '30%'
                        });
                    } else {
                        this.existingMenu[this.movingMenu.parentPos].children.splice(this.movingMenu.childPos,1);
                        this.selectedMenu[this.movingMenu.parentPos].children.push(this.movingMenu.childItem);
                        this.clickedChildMenu = this.selectedMenu[this.movingMenu.parentPos].children.length-1;
                        this.movingMenu.childPos = this.selectedMenu[this.movingMenu.parentPos].children.length-1;
                    }
                }
            },
            checkExistMenu(id,children){
                let status = -1;
                if (children.length>0){
                    for (let i = 0; i < children.length; i++) {
                        if (id===children[i].id){
                            status = 1;
                            break;
                        }else {
                            status = 0;
                        }
                    }
                } else {
                    status = 0;
                }
                return status;
            },
            selectedMenuRemove(){
                this.selectedMenu[this.movingMenu.parentPos].children.splice(this.movingMenu.childPos,1);
            },
            save(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Set menu permission',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... ',
                    width : '30%'
                });
                
                let requestData = {
                    userBn : {
                        id : CookieManager.getParsedData("userInfo").id,
                        deptId : this.selectedDepartmentId,
                        userEmail : CookieManager.getParsedData("userInfo").userEmail
                    },
                    integerList : [],
                    menuBn :{
                        link : this.$route.path
                    }
                };

                for (let i = 0; i < this.selectedMenu.length; i++) {
                    if (this.selectedMenu[i].children.length>0){
                        for (let j = 0; j < this.selectedMenu[i].children.length; j++) {
                            requestData.integerList.push(this.selectedMenu[i].children[j].oId);
                        }
                    }
                }

                this.$http.post(this.url+"/menu/set-permission",requestData)
                .then(res=>{
                    // console.log(res.data);
                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.getInitialData();

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.save,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }
                })
                .catch(err=>{
                    console.log(JSON.stringify(err.response.data));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.save,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            }
        }
    }
</script>

<style scoped>
    .activeMenuStyle{
        background-color: #4CAF50;
        color: white;
        border-radius: 3px;
    }
    .smp-menu{
        border: 1px solid lightgray;
        margin: 20px;
    }
    .smp-menu > h4{
        padding: 10px;
        border-bottom: 1px solid lightgray;
    }
    .smp-menu-box{
        padding: 15px;
    }
    .smp-menu-data > h4{
        border-bottom: 1px solid lightgray;
        padding-bottom: 2px;
    }
    .smp-menu-list{
        display: flex;
        align-items: baseline;
        flex-direction: column;
        margin-left: 5px;
        padding: 5px 5px;
    }
    .smp-menu-list i{
        font-size: 10px;
    }
    .smp-menu-list p{
        cursor: pointer;
        padding: 2px 5px;
        width: 100%;
    }
    .smp-action {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }
    .smp-action > button {
        margin: 3px;
    }
    .selected-menu-close{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-right: 5px
    }
</style>