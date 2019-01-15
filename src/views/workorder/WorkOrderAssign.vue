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
                                            <td>Work order</td>
                                            <td>
                                                <select v-model="woAssign.woId" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="wl in workOrderList" v-bind:value="wl.id" >{{wl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Department</td>
                                            <td>
                                                <select v-on:change="departmentChange(deptOid)" v-model="deptOid" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-bind:value="d.oId" v-for="d in departmentBnList" >{{d.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Assign to</td>
                                            <td>
                                                <select v-model="woAssign.assignTo" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-bind:value="u.id" v-for="u in userList" >{{u.userName}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Date</td>
                                            <td><input type="date" v-model="woAssign.assignDate" /></td>
                                        </tr>
                                        <tr>
                                            <td>Time</td>
                                            <td><input type="time" v-model="woAssign.assignTime" /></td>
                                        </tr>
                                        <tr>
                                            <td>Scope</td>
                                            <td>
                                                <textarea v-model="woAssign.scope" ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Remark</td>
                                            <td>
                                                <textarea v-model="woAssign.remark" ></textarea>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                            <tr v-for="(c,i) in woAssign.woAssignDetailList" >
                                                <td>{{c.breakDown}}</td>
                                                <td><input v-model="c.cost" type="number" /></td>
                                                <td><i class="fas fa-times-circle" v-on:click="removeCostBreakDown(i)" ></i></td>
                                            </tr>
                                            <tr>
                                                <td><button class="my-btn" v-on:click="openCbdModel" ><i class="fas fa-plus" ></i></button></td>
                                                <td>Add cost break down</td>
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
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="woAssign.id===-1" class="my-btn" v-on:click="save" >Save</button>
                                <button v-else class="my-btn" v-on:click="" >Update</button>
                                <button class="my-btn" v-on:click="" >Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isCbdModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-3" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>Cost break down</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeCbdModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Break down</td>
                                            <td>
                                                <input type="text" v-model="cbd.breakDown" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Cost</td>
                                            <td>
                                                <input type="text" v-model="cbd.cost" />
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-div-foot" >
                                    <div class="my-div-foot-left" >
                                        <button class="my-btn" v-on:click="addCostBreakDown" >Add</button>
                                    </div>
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
    export default {
        name: "WorkOrderAssign",
        components: {Notification},
        mounted(){
            this.getInitData();
            this.woAssign.modifiedBy = this.$store.state.userInfo.id;
        },
        data(){
            return{
                tabButtons : ['Assign work order','Assign list'],
                selectedTab : 0,
                needToCloseNotification : true,
                woAssign:{
                    id : -1,
                    woId : '',
                    assignTo : '',
                    assignDate : '',
                    assignTime : '',
                    scope : '',
                    remark : '',
                    modifiedBy : '',
                    woAssignDetailList : []
                },
                cbd : {
                    breakDown : '',
                    cost : 0
                },
                workOrderList : [],
                departmentBnList : [],
                userList : [],
                deptOid : -1,
                isCbdModelOpen : false
            }
        },
        methods:{
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.get(url+"/wo-assign/init")
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.departmentBnList = res.data.departmentBnList;
                        this.workOrderList = res.data.workOrderList;

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
                        callBackMethod : this.getInitData,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                });

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            departmentChange(oId){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                if (this.selectedDepartmentId===-1){

                } else {

                    let url = this.$store.state.baseUrl;

                    this.$http.post(url+"/user/get-by-department",{
                        oId : oId
                    })
                    .then(response=>{
                        console.log(JSON.stringify(response.data));
                        if (response.data.code===200){
                            this.userList = response.data.list;
                            this.$refs.noti.closeNotification();
                        }else {

                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : response.data.msg,
                                status : response.data.code
                            });

                        }
                    })
                    .catch(error=> {
                        console.log(error);
                        this.$refs.noti.setNotificationProperty({
                            title : 'Processing result',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Did not get menu list',
                            width : '30%',
                            callBackMethod : this.getMenuByDepartment,
                            needTryAgain : true,
                            status : 400
                        });
                    });

                }

            },
            addCostBreakDown(){
                this.woAssign.woAssignDetailList.push(JSON.parse(JSON.stringify(this.cbd)));
                this.cbd.breakDown = "";
                this.cbd.cost = "";
                this.isCbdModelOpen = false;
            },
            closeCbdModel(){
                this.isCbdModelOpen = false;
            },
            openCbdModel(){
                this.isCbdModelOpen = true;
            },
            removeCostBreakDown(i){
                this.woAssign.woAssignDetailList.splice(i,1);
            },
            save(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-sync fa-spin',
                    bodyMsg : 'Please wait ... !'
                });

                let url = this.$store.state.baseUrl;
                this.$http.post(url+"/wo-assign/save",{
                    woAssignBn : this.woAssign
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;

                        this.$refs.noti.setNotificationProperty({
                            title : 'Success',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            status : res.data.code
                        });

                    } else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : res.data.msg,
                            callBackMethod : this.save,
                            needTryAgain : true,
                            status : 400
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'ERROR',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.save,
                        needTryAgain : true,
                        status : err.response.data.status
                    });
                });

            }
        }
    }
</script>

<style scoped>

</style>