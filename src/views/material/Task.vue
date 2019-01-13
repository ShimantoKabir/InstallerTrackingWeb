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
                                        <thead>
                                        <tr>
                                            <th>Serial</th>
                                            <th>Name</th>
                                            <th>Duration</th>
                                            <th>Cost</th>
                                            <th>Task specialist</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                        </thead>
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
                                <button class="my-btn" v-on:click="saveTask" >Save</button>
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
                                        <button class="my-btn" v-on:click="updateTaskAttempt" >Update</button>
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
        name: "Task",
        components: {Notification},
        mounted(){
            this.getUserList();
            console.log(JSON.stringify(this.$store.state.userInfo));
            this.task.modifiedBy = this.$store.state.userInfo.id;
            console.log(JSON.stringify(this.task));
        },
        data(){
            return{
                tabButtons : ['Create task','Task list'],
                selectedTab : 0,
                task:{
                    id : -1,
                    name : '',
                    duration : '',
                    cost : '',
                    taskSpecialist : -1,
                    modifiedBy : ''
                },
                taskList : [],
                userList : [],
                isUpdateTaskModelOpen : false
            }
        },
        methods:{
            getUserList(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.get(url+"/user/get")
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.userList = res.data.list;
                        this.$refs.noti.closeNotification();

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.getUserList,
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
                        callBackMethod : this.getInitialData,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                })
                .finally(res=>{
                    this.getTaskList();
                })

            },
            saveTask(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/task/save",this.task)
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.getTaskList();
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
                                callBackMethod : this.saveTask,
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
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

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

                    console.log(JSON.stringify(res.data));

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
            tabBtnClickListener(i){
                this.selectedTab = i;
                this.task.id = '';
                this.task.name = '';
                this.task.duration = '';
                this.task.cost = '';
                this.task.taskSpecialist = -1;
            },
            closeUpdateTaskModel(){
                this.isUpdateTaskModelOpen = false;
            },
            updateTaskAttempt(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/task/update",this.task)
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.getTaskList();
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
                                callBackMethod : this.saveTask,
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
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : err.response.data.status
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
            }
        }
    }
</script>

<style scoped>

</style>