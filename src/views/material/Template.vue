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
                            <div v-show="selectedTab===0" class="my-tab-body" style="flex-direction: column" >
                                <div class="my-tab-100" >
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Name</td>
                                                <td><input type="text" v-model="template.name" /></td>
                                                <td><button class="my-btn" v-on:click="taskUp" ><i class="fas fa-arrow-up"></i></button></td>
                                                <td><button class="my-btn" v-on:click="taskDown" ><i class="fas fa-arrow-down" ></i></button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-tab-100" >
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
                                                v-for="(t,i) in taskList"
                                                v-bind:class="{activeTaskStyle : selectedTask.id === t.id }"
                                                v-on:change="changeTask(t,i,$event)"  v-on:click="clickTask(t,i)" >

                                                <td><input v-model="t.checked" type="checkbox" /></td>
                                                <td>{{t.name}}</td>
                                                <td>{{t.duration}}</td>
                                                <td>{{t.cost}}</td>
                                                <td>{{t.sequenceNumber}}</td>
                                                <td>{{t.userEmail}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===1" class="my-tab-body" >
                                <div class="my-tab-100" >
                                    <table class="my-tbl" >
                                        <thead>
                                        <tr>
                                            <th>Serial</th>
                                            <th>Name</th>
                                            <th>Task list</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(t,i) in templateList" >
                                                <td>{{i+1}}</td>
                                                <td>{{t.name}}</td>
                                                <td>
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
                                                            <tr v-for="(tl,i) in t.taskList" >
                                                                <td>{{i+1}}</td>
                                                                <td>{{tl.name}}</td>
                                                                <td>{{tl.cost}}</td>
                                                                <td>{{tl.duration}}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td><i class="fas fa-edit" v-on:click="openUpdateTemplateModel(t)" ></i></td>
                                                <td><i class="fas fa-trash" ></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button class="my-btn" v-on:click="saveTemplate" >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isUpdateTemplateModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-12" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>Update template</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeUpdateTemplateModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <div class="my-div-body-100" >
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>Name</td>
                                                <td><input type="text" v-model="template.name" /></td>
                                                <td><button class="my-btn" v-on:click="taskUp" ><i class="fas fa-arrow-up"></i></button></td>
                                                <td><button class="my-btn" v-on:click="taskDown" ><i class="fas fa-arrow-down" ></i></button></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <div class="my-div-body-100" >
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
                                            <tr style="cursor: pointer" v-for="(t,i) in taskList" v-bind:class="{activeTaskStyle : selectedTask.id === t.id }" v-on:click="clickTask(t,i)">
                                                <td>
                                                    <input v-model="t.checked" type="checkbox" />
                                                </td>
                                                <td>{{t.name}}</td>
                                                <td>{{t.duration}}</td>
                                                <td>{{t.cost}}</td>
                                                <td>{{t.sequenceNumber}}</td>
                                                <td>{{t.userEmail}}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="my-div-foot" >
                                    <div class="my-div-foot-left" >
                                        <button class="my-btn" v-on:click="updateTemplate" >Update</button>
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
    export default {
        name: "Template",
        components: {Notification},
        mounted(){
            this.getTemplate();
            this.template.modifiedBy = this.$store.state.userInfo.id;
        },
        data(){
            return{
                isUpdateTemplateModelOpen : false,
                tabButtons : ['Create template','Template list'],
                selectedTab : 0,
                selectedTask:{
                    pos : '',
                    id : -1,
                    name : '',
                    duration : '',
                    cost : '',
                    sequenceNumber : '',
                },
                template :{
                    id : -1,
                    oId : -1,
                    name : '',
                    modifiedBy : '',
                    taskList : []
                },
                templateList : [],
                taskList : []
            }
        },
        methods:{
            closeUpdateTemplateModel(){
                this.isUpdateTemplateModelOpen = false;
                this.getTemplate();
            },
            getTemplate(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.get(url+"/template/get")
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.templateList = res.data.list;

                        } else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.getTemplate,
                                needTryAgain : true,
                                status : res.data.code
                            });

                        }

                    })
                    .catch(err=>{
                        console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'ERROR',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.getTemplate,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })
                    .finally(res=>{
                        this.getTaskList();
                    })

            },
            saveTemplate(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/template/save",this.template)
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.template.name = '';
                            this.template.taskList = [];
                            for (let i = 0; i < this.taskList.length; i++) {
                                this.taskList[i].checked = false;
                            }

                            this.$refs.noti.setNotificationProperty({
                                title : 'Success',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : res.data.msg,
                                status : res.data.code
                            });

                        } else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.saveTemplate,
                                needTryAgain : true,
                                status : 400
                            });

                        }

                    })
                    .catch(err=>{
                        console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'ERROR',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.saveTemplate,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

            },
            tabBtnClickListener(i){
                this.selectedTab = i;

                this.template.name = '';
                this.template.taskList = [];
                for (let i = 0; i < this.taskList.length; i++) {
                    this.taskList[i].checked = false;
                }

                if (i===1){
                    this.getTemplate();
                }
            },
            getTaskList(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.get(url+"/task/get")
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.taskList = res.data.list;
                            this.$refs.noti.closeNotification();

                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.getTaskList,
                                needTryAgain : true,
                                status : 400
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'ERROR',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.getTaskList,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

            },
            changeTask(t,pos,$event){

                if ($event.target.checked){
                    this.template.taskList.push(t)
                }else {
                    this.template.taskList.splice(pos,1);
                }

                // console.log(JSON.stringify(this.template.taskList));
            },
            clickTask(t,pos){
                this.selectedTask.pos = pos;
                this.selectedTask.id = t.id;
                this.selectedTask.cost = t.cost;
                this.selectedTask.duration = t.duration;
                this.selectedTask.sequenceNumber = t.sequenceNumber;
            },
            taskUp(){

                if (this.selectedTask.pos < 1){
                    this.selectedTask.pos = 1;
                }

                let x = this.taskList[this.selectedTask.pos].sequenceNumber;
                let y = this.taskList[this.selectedTask.pos-1].sequenceNumber;

                this.taskList[this.selectedTask.pos].sequenceNumber = y;
                this.taskList[this.selectedTask.pos-1].sequenceNumber = x;

                this.selectedTask.pos = this.selectedTask.pos -1;

                this.taskList.sort(function(a, b){
                    return a.sequenceNumber - b.sequenceNumber;
                });

            },
            taskDown(){

                if (this.selectedTask.pos === this.taskList.length-1){
                    // this.selectedTask.pos = this.taskList.length-2;
                    this.selectedTask.pos = this.selectedTask.pos-1;
                }

                // console.log(this.selectedTask.pos );
                // console.log(this.taskList.length);

                let x = this.taskList[this.selectedTask.pos].sequenceNumber;
                let y = this.taskList[this.selectedTask.pos+1].sequenceNumber;

                this.taskList[this.selectedTask.pos].sequenceNumber = y;
                this.taskList[this.selectedTask.pos+1].sequenceNumber = x;

                this.selectedTask.pos = this.selectedTask.pos+1;

                this.taskList.sort(function(a, b){
                    return a.sequenceNumber - b.sequenceNumber;
                });

            },
            updateTemplate(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                this.template.taskList = this.taskList;

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/template/update",this.template)
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.$refs.noti.setNotificationProperty({
                                title : 'Success',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : res.data.msg,
                                status : res.data.code
                            });

                        } else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.updateTemplate,
                                needTryAgain : true,
                                status : 400
                            });

                        }

                    })
                    .catch(err=>{
                        console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'ERROR',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.updateTemplate,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

            },
            openUpdateTemplateModel(t){

                this.isUpdateTemplateModelOpen = true;

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

                this.taskList.sort(function(a, b){
                    return a.sequenceNumber - b.sequenceNumber;
                });

            }
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