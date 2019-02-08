<template>
    <div class="vue-template" >
        <div class="vue-template" >
            <div class="container-fluid" >
                <div class="row" >
                    <div class="col-sm-12" >
                        <div class="my-tab" >
                            <div class="my-tab-head" >
                                <button v-bind:class="{active : selectedTab === i}" v-for="(tb,i) in tabButtons" v-on:click="tabBtnClickListener(i)" >{{tb}}</button>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-body" >
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td><input type="text" v-model="task.name" /></td>
                                        </tr>
                                        <tr>
                                            <td>Duration</td>
                                            <td><input placeholder="Duration in minute" type="number" v-model="task.duration" /></td>
                                        </tr>
                                        <tr>
                                            <td>Cost</td>
                                            <td><input type="number" v-model="task.cost" /></td>
                                        </tr>
                                        <tr>
                                            <td>Task specialist</td>
                                            <td>
                                                <select v-model="task.taskSpecialist" >
                                                    <option v-bind:value="-1" >-- Select --</option>
                                                    <option v-for="u in userList" v-bind:value="u.id" >{{u.userEmail}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===1" class="my-tab-body" >
                                <div class="my-tab-100" >
                                    <table class="my-tbl" >
                                        <table-head
                                                ref="th"
                                                :row-par-page="3"
                                                :set-table-data="setTableData"
                                                :header-name-list="headerNameList" >
                                        </table-head>
                                        <tbody>
                                            <tr v-for="(t,i) in taskList" >
                                                <td>{{i+1}}</td>
                                                <td>{{t.name}}</td>
                                                <td>{{t.duration}}</td>
                                                <td>{{t.cost}}</td>
                                                <td>{{t.userEmail}}</td>
                                                <td><i  v-on:click="openUpdateTaskModel(t)" class="fas fa-edit" ></i></td>
                                                <td><i class="fas fa-trash" ></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button class="my-btn" v-on:click="verifyInput('save')" >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isUpdateTaskModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-4" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>Update task</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeUpdateTaskModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td><input type="text" v-model="task.name" /></td>
                                        </tr>
                                        <tr>
                                            <td>Duration</td>
                                            <td><input placeholder="Duration in minute" type="number" v-model="task.duration" /></td>
                                        </tr>
                                        <tr>
                                            <td>Cost</td>
                                            <td><input type="number" v-model="task.cost" /></td>
                                        </tr>
                                        <tr>
                                            <td>Task specialist</td>
                                            <td>
                                                <select v-model="task.taskSpecialist" >
                                                    <option v-for="u in userList" v-bind:value="u.id" >{{u.userEmail}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-div-foot" >
                                    <div class="my-div-foot-left" >
                                        <button class="my-btn" v-on:click="verifyInput('update')" >Update</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <notification ref="noti" ></notification>
    </div>
</template>

<script>

    import Notification from "../notificaiton/Notification";
    import CookieManager from "../../Helper/CookieManager";
    import TableHead from "../../common/TableHead";

    export default {
        name: "Task",
        components: {TableHead, Notification},
        mounted(){
            this.getInitData();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                tabButtons : ['Create task','Task list'],
                selectedTab : 0,
                task:{
                    id : -1,
                    name : '',
                    duration : '',
                    cost : '',
                    taskSpecialist : -1,
                    modifiedBy : CookieManager.getParsedData("userInfo").id
                },
                taskList : [],
                userList : [],
                isUpdateTaskModelOpen : false,
                needToCloseNotification : true,
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'Name',
                        sortBy : 'name',
                    },
                    {
                        name : 'Duration',
                        sortBy : 'duration',
                    },
                    {
                        name : 'Cost',
                        sortBy : 'cost',
                    },
                    {
                        name : 'Task specialist',
                        sortBy : 'taskSpecialist',
                    },
                    {
                        name : 'Edit',
                        sortBy : '',
                    },
                    {
                        name : 'Delete',
                        sortBy : '',
                    }
                ],
            }
        },
        methods:{
            setTableData(list){
                this.taskList = list;
            },
            verifyInput(which){
                if (which==="save"){
                    if (this.task.name==="") {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task name required !',
                            code : 400
                        });
                    }else if (this.task.duration===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task duration required !',
                            code : 400
                        });
                    } else if (this.task.cost===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task cost required !',
                            code : 400
                        });
                    } else if (this.task.taskSpecialist===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Please select a specialist !',
                            code : 400
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Would you like to submit ?',
                            callBackMethod : this.save,
                            needConfirmation : true,
                        });
                    }
                } else if (which==="update") {
                    if (this.task.name==="") {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task name required !',
                            code : 400
                        });
                    }else if (this.task.duration===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task duration required !',
                            code : 400
                        });
                    } else if (this.task.cost===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task cost required !',
                            code : 400
                        });
                    } else if (this.task.taskSpecialist===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Please select a specialist !',
                            code : 400
                        });
                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Would you like to submit ?',
                            callBackMethod : this.update,
                            needConfirmation : true,
                        });
                    }
                }
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/task/init-data",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.$refs.th.setComTableData(res.data.taskResponse.list);
                        this.userList = res.data.userResponse.list;
                        
                        if (this.needToCloseNotification) {this.$refs.noti.closeNotification();}

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getInitData,
                            needTryAgain : true,
                            code : 400
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                });

            },
            save(){

                console.log(JSON.stringify(this.task));

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/task/save",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    taskBn : this.task,
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.getInitData();
                        this.reset();

                        console.log()

                        this.needToCloseNotification = false;
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code,
                            needOk :true
                        });

                    } else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.saveTask,
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
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            closeUpdateTaskModel(){
                this.isUpdateTaskModelOpen = false;
            },
            update(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/task/update",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    taskBn : this.task,
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.getInitData();
                        this.isUpdateTaskModelOpen = false;
                        this.reset();

                        console.log(JSON.stringify(this.task));

                        this.needToCloseNotification = false;
                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : res.data.msg,
                            code : res.data.code,
                            needOk: true
                        });

                    } else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.saveTask,
                            needTryAgain : true,
                            code : res.data.code,
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
            openUpdateTaskModel(task){
                this.isUpdateTaskModelOpen = true;
                this.task.id = task.id;
                this.task.name = task.name;
                this.task.duration = task.duration;
                this.task.cost = task.cost;
                this.task.taskSpecialist = task.taskSpecialist;
            },
            reset(){
                this.isUpdateTaskModelOpen = false;
                this.task.id = -1;
                this.task.name = "";
                this.task.duration = "";
                this.task.cost = "";
                this.task.taskSpecialist = -1;
            }
        }
    }
</script>

<style scoped>

</style>