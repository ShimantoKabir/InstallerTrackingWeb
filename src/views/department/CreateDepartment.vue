<template>
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
                                        <td>Department name</td>
                                        <td><input type="text" v-model="department.name" /></td>
                                    </tr>
                                    <tr>
                                        <td>Rank</td>
                                        <td><input type="number" v-model="department.rank" /></td>
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
                                            <th>Rank</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(dl,i) in departmentList" >
                                            <td>{{i+1}}</td>
                                            <td>{{dl.name}}</td>
                                            <td>{{dl.rank}}</td>
                                            <td><i class="fas fa-edit" ></i></td>
                                            <td><i class="fas fa-trash" ></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-show="selectedTab===0" class="my-tab-foot" >
                            <button class="my-btn" v-on:click="saveDepartment" >Save</button>
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
        name: "CreateDepartment",
        components: {Notification},
        mounted(){
            this.getInitialData();
        },
        data(){
            return{
                tabButtons : ['Create department','Department list'],
                selectedTab : 0,
                department : {
                    name : '',
                    rank : '',
                    userBeen : {}
                },
                departmentList : []
            }
        },
        methods:{
            getInitialData(){
                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/department/get-by-user",this.$store.state.userInfo)
                    .then(res=>{

                        if (res.data.code===200){
                            this.departmentList = res.data.list
                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Initial data processing error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : 'Can not get department list !',
                                callBackMethod : this.getInitialData,
                                needTryAgain : true,
                                status : 400
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(err);
                        this.$refs.noti.setNotificationProperty({
                            title : 'Initial data processing error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Can not get department list !',
                            callBackMethod : this.getInitialData,
                            needTryAgain : true,
                            status : 400
                        });
                    })
            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            saveDepartment(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Department save processing',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ...',
                });

                let url = this.$store.state.baseUrl;

                this.department.userBeen = this.$store.state.userInfo;

                this.$http.post(url+"/department/save",this.department)
                .then(response=>{

                    console.log(response.data);

                    if (response.data.code===200){
                        this.departmentList = response.data.list;
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-check-circle',
                            bodyMsg : response.data.msg,
                        });
                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : response.data.msg,
                            callBackMethod : this.saveDepartment,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(error=> {
                    console.log(error);
                    this.$refs.noti.setNotificationProperty({
                        title : 'Processing result',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : 'Department not save successfully !',
                        callBackMethod : this.saveDepartment,
                        needTryAgain : true,
                        status : 400
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .active {
        background-color: rgba(231, 231, 231, 0.72);
    }
</style>