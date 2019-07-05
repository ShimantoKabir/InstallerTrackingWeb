<template>
    <div class="vue-template" >
        <div class="container-fluid" style="margin-bottom: 10px" >
            <div class="row" >
                <div class="col-sm-12" >
                    <div class="my-tab" >
                        <div class="my-tab-head" >
                            <button v-bind:class="{active : selectedTab === i}" v-for="(tb,i) in tabButtons" v-on:click="tabBtnClickListener(i)" >{{tb}}</button>
                        </div>
                        <div v-show="selectedTab===0" class="my-tab-body" >
                            <div class="my-tab-100" >
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td><input type="text" v-model="template.name"  /></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table class="my-tbl" >
                                    <thead>
                                    <tr>
                                        <th>Check</th>
                                        <th>Name</th>
                                        <th>Duration</th>
                                        <th>Cost</th>
                                        <th>Sequence number</th>
                                        <th>Task specialist</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr style="cursor: pointer"
                                        v-for="(tk,i) in taskList"
                                        v-bind:class="{activeTaskStyle : tk.checked }" >
                                        <td><input type="checkbox" v-model="tk.checked" /></td>
                                        <td>{{tk.name}}</td>
                                        <td>{{tk.duration}}</td>
                                        <td>{{tk.cost}}</td>
                                        <td><input type="number" v-model="tk.sequenceNumber" /></td>
                                        <td>{{tk.userEmail}}</td>
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
                                    <tr v-for="(t,i) in templateList" >
                                        <td>{{i+1}}</td>
                                        <td>{{t.name}}</td>
                                        <td><i class="fas fa-binoculars" v-on:click="openTaskListModel(t)" ></i></td>
                                        <td><i class="fas fa-edit" v-on:click="setUpdateDate(t)" ></i></td>
                                        <td><i class="fas fa-trash" ></i></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-show="selectedTab===0" class="my-tab-foot" >
                            <button v-if="template.id === -1" class="my-btn" v-on:click="verifyInput('save')" >save</button>
                            <button v-else class="my-btn" v-on:click="verifyInput('update')" >Update</button>
                            <button class="my-btn" v-on:click="reset" >Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isTaskListModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-4" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>{{template.name}}</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeTaskListModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <table class="my-tbl" >
                                        <thead>
                                        <tr>
                                            <th>Serial</th>
                                            <th>Name</th>
                                            <th>Cost</th>
                                            <th>Duration</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(tl,i) in taskList" >
                                            <td>{{i+1}}</td>
                                            <td>{{tl.name}}</td>
                                            <td>{{tl.cost}}</td>
                                            <td>{{tl.duration}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

    import Notification from "../notificaiton/Notification";
    import CookieManager from "../../Helper/CookieManager"
    import TableHead from "../../common/TableHead";

    export default {
        name: "Template",
        components: {TableHead, Notification},
        mounted(){
            this.getInitData();
        },
        data(){
            return{
                isTaskListModelOpen : false,
                url : this.$store.state.baseUrl,
                tabButtons : ['Create template','Template list'],
                selectedTab : 0,
                template :{
                    id : -1,
                    oId : -1,
                    name : '',
                    modifiedBy : CookieManager.getParsedData("userInfo").id,
                },
                templateList : [],
                templateBnList : [],
                taskList : [],
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
                        name : 'Task list',
                        sortBy : '',
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
                this.templateList = list;
            },
            openTaskListModel(t){
                this.isTaskListModelOpen = true;
                this.taskList = t.taskList;
                this.template.name = t.name;
            },
            closeTaskListModel(){
                this.isTaskListModelOpen = false;
                this.reset();
            },
            verifyInput(which){
                if (which==="save"){
                    if (this.template.name===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "Template name required",
                            code : 200
                        });
                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Would you like to submit ?',
                            callBackMethod : this.save,
                            needConfirmation : true
                        });
                    }
                }else if (which==="update"){
                    if (this.template.name===""){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "Template name required",
                            code : 200
                        });
                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Would you like to submit ?',
                            callBackMethod : this.update,
                            needConfirmation : true
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

                this.$http.post(this.url+"/template/get-init-data",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.$refs.th.setComTableData(res.data.templateBnList);
                        this.taskList = res.data.taskBnList;

                        if (this.needToCloseNotification){
                            this.$refs.noti.closeNotification();
                        }

                    } else {

                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getInitData,
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
                        callBackMethod : this.getInitData,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            save(){

                console.log(JSON.stringify(this.template));
                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.$http.post(this.url+"/template/save",{
                    templateBn : this.template,
                    taskBnList : this.taskList,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.reset();
                        this.getInitData();
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
                            code : res.data.msg,
                        });

                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.save,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            update(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/template/update",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    taskBnList : this.taskList,
                    menuBn : {
                        link : this.$route.path
                    },
                    templateBn : this.template,
                })
                .then(res=>{

                    if (res.data.code===200){

                        this.needToCloseNotification = false;
                        this.reset();
                        this.getInitData();

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
                            callBackMethod : this.update,
                            needTryAgain : true,
                            code : res.data.code
                        });

                    }

                })
                .catch(err=>{
                    console.log(err);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.update,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            setUpdateDate(t){

                this.selectedTab = 0;

                for (let i = 0; i < this.taskList.length; i++) {
                    this.taskList[i].checked = false;
                }

                this.template.name = t.name;
                this.template.id = t.id;
                this.template.oId = t.oId;

                for (let i = 0; i < this.taskList.length; i++) {
                    for (let j = 0; j < t.taskList.length; j++) {
                        if (this.taskList[i].id===t.taskList[j].id){
                            this.taskList[i].checked = true;
                            this.taskList[i].sequenceNumber = t.taskList[j].sequenceNumber;
                        }
                    }
                }

            },
            reset(){

                this.template.name = "";
                this.template.oId = -1;
                this.template.id = -1;
                for (let i = 0; i < this.taskList.length; i++) {
                    this.taskList[i].checked = false;
                    this.taskList[i].sequenceNumber = 0;
                }

            },
        }
    }
</script>

<style scoped>
    .activeTaskStyle{
        background-color: #4CAF50;
        color: white;
        border-radius: 3px;
    }
</style>
