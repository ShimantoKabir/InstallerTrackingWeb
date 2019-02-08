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
                                <div class="my-tab-100" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Work order</td>
                                            <td>
                                                <select v-model="workOrderDetail.woId" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="wl in workOrderList" v-bind:value="wl.id" >{{wl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Template</td>
                                            <td>
                                                <select v-model="selectedTemplatePos" v-on:change="templateChange(selectedTemplatePos)" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="(tl,i) in templateList" v-bind:value="i" >{{tl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <table class="my-tbl" v-if="selectedTemplatePos!==-1" >
                                        <thead>
                                        <tr>
                                            <th>Task name</th>
                                            <th>Start date</th>
                                            <th>End date</th>
                                            <th>Photo quantity</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(tsk,i) in taskList" >
                                            <td>{{tsk.name}}</td>
                                            <td><input v-model="tsk.startDate" type="date" /></td>
                                            <td><input v-model="tsk.endDate" type="date" /></td>
                                            <td><input v-model="tsk.photoQuantity" type="number" /></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===1" class="my-tab-body" >
                                <div class="my-tab-100" >
                                    <table class="my-tbl" style="font-size: 13px" >
                                        <table-head
                                                ref="th"
                                                :row-par-page="3"
                                                :set-table-data="setTableData"
                                                :header-name-list="headerNameList" >
                                        </table-head>
                                        <tbody>
                                        <tr v-for="(wodl,i) in workOrderDetailList" >
                                            <td>{{i+1}}</td>
                                            <td>{{wodl.woName}}</td>
                                            <td>{{wodl.templateName}}</td>
                                            <td><i class="fas fa-binoculars" v-on:click="openUpdateWodModel(wodl,false)" ></i></td>
                                            <td><i class="fas fa-edit" v-on:click="openUpdateWodModel(wodl,true)" ></i></td>
                                            <td><i class="fas fa-trash" v-on:click="deleteWorkOrderDetail(wodl)" ></i></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="workOrderDetail.id===-1" class="my-btn" v-on:click="verifyInput('saveWorkOrderDetail')" >Save</button>
                                <button class="my-btn"  v-on:click="resetWorkOrderDetail" >Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <notification ref="noti" ></notification>
        <transition name="slide-fade" >
            <div class="my-model" v-show="isUpdateWodModelOpen" >
                <div class="container-fluid" >
                    <div class="row justify-content-center" >
                        <div class="col-sm-12" >
                            <div class="my-div" >
                                <div class="my-div-head" >
                                    <div class="my-div-head-left" >
                                        <h3>Update Work order detail</h3>
                                    </div>
                                    <div class="my-div-head-right" >
                                        <i class="fas fa-times-circle" v-on:click="closeUpdateWodModel" ></i>
                                    </div>
                                </div>
                                <div class="my-div-body" >
                                    <div class="my-div-body-100" >
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>Work order</td>
                                                <td>
                                                    <input readonly type="text" v-model="workOrderDetail.woName" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Template</td>
                                                <td>
                                                    <input readonly type="text" v-model="workOrderDetail.templateName" />
                                                </td>
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
                                                <th>Task name</th>
                                                <th>Start date</th>
                                                <th>End date</th>
                                                <th>Photo quantity</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(uTsk,i) in updateTaskList" >
                                                <td>{{uTsk.taskName}}</td>
                                                <td>
                                                    <input v-model="uTsk.startDate" type="date" />
                                                </td>
                                                <td>
                                                    <input v-model="uTsk.endDate" type="date" />
                                                </td>
                                                <td><input v-model="uTsk.photoQuantity" type="number" /></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="my-div-foot" >
                                    <div class="my-div-foot-left" >
                                        <button v-if="workOrderDetail.woId!==-1" class="my-btn" v-on:click="updateWorkOrderDetail" >Update</button>
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
    import DateFormatManager from "../../Helper/DateFormatManager";
    import CookieManager from "../../Helper/CookieManager";
    import TableHead from "../../common/TableHead";

    export default {
        name: "WorkOrderDetail",
        components: {TableHead, Notification},
        mounted(){
            this.getInitData();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                isUpdateWodModelOpen : false,
                tabButtons : ['Create work order details','Work order detail list'],
                selectedTab : 0,
                workOrderDetail : {
                    id : -1,
                    woId : -1,
                    woName : '',
                    templateOid : -1,
                    templateName : '',
                    modifiedBy : CookieManager.getParsedData("userInfo").id,
                },
                selectedTemplatePos : -1,
                workOrderList : [],
                templateList : [],
                taskList: [],
                updateTaskList: [],
                workOrderDetailList: [],
                needToCloseNotification : true,
                headerNameList : [
                    {
                        name : 'Sr',
                        sortBy : '',
                    },
                    {
                        name : 'Work order',
                        sortBy : 'woName',
                    },
                    {
                        name : 'Template',
                        sortBy : 'templateName',
                    },
                    {
                        name : 'Task',
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
                this.workOrderDetailList = list;
            },
            verifyInput(which){
                if (which==='saveWorkOrderDetail'){
                    if (this.workOrderDetail.templateOid===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Template selection required!',
                        });
                    } else if (this.workOrderDetail.woId===-1){
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'WorkOrder selection required!',
                        });
                    } else if (this.taskList.length<0) {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : 'Task list empty !',
                        });
                    }else {
                        this.$refs.noti.setNotificationProperty({
                            title : 'Alert',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : "Would you like to save?",
                            callBackMethod : this.saveWorkOrderDetail,
                            needConfirmation : true
                        });
                    }
                }
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.get(this.url+"/work-order-detail/get-init-data")
                    .then(res=>{

                        // console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.workOrderList = res.data.workOrderList;
                            this.templateList = res.data.templateList;
                            this.$refs.th.setComTableData(res.data.workOrderDetailList);

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
                        console.log(JSON.stringify(err));
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
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            saveWorkOrderDetail(){

                // console.log(JSON.stringify(this.taskList));

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/work-order-detail/save",{
                    workOrderDetailBn : {
                        id : this.workOrderDetail.id,
                        woId : this.workOrderDetail.woId,
                        templateOid : this.workOrderDetail.templateOid,
                        modifiedBy : this.workOrderDetail.modifiedBy
                    },
                    taskBnList : this.taskList,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    // console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.getInitData();
                        this.needToCloseNotification = false;
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
                            callBackMethod : this.saveWorkOrderDetail,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.saveWorkOrderDetail,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            },
            updateWorkOrderDetail(){

                // console.log(JSON.stringify(this.updateTaskList));

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/work-order-detail/update",{
                    workOrderDetailBn : {
                        modifiedBy : this.workOrderDetail.modifiedBy
                    },
                    taskBnList : this.updateTaskList,
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.needToCloseNotification = false;

                            this.getInitData();

                            this.$refs.noti.setNotificationProperty({
                                title : 'Success',
                                bodyIcon : 'fas fa-check-circle',
                                bodyMsg : res.data.msg,
                                code : res.data.code,
                                needOk : true
                            });

                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.updateWorkOrderDetail,
                                needTryAgain : true,
                                code : res.data.code
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.updateWorkOrderDetail,
                            needTryAgain : true,
                            code : err.response.data.status
                        });
                    })

            },
            resetWorkOrderDetail(){
                this.workOrderDetail.id = -1;
                this.workOrderDetail.woId = -1;
                this.workOrderDetail.templateOid = '';
                this.workOrderDetail.taskId = '';
                this.workOrderDetail.taskSqNo = '';
                this.workOrderDetail.startDate = '';
                this.workOrderDetail.endDate = '';
                this.workOrderDetail.photoQuantity = '';
                this.workOrderDetail.statusOid = '';
                this.workOrderDetail.remark = '';
                this.selectedTab = 0;
                this.taskList = [];
                this.selectedTemplatePos = -1;
            },
            templateChange(i){
                if (i===-1){
                    this.taskList = [];
                    this.workOrderDetail.templateOid = -1;
                } else {
                    this.taskList = this.templateList[i].taskList;
                    this.workOrderDetail.templateOid = this.templateList[i].oId;
                }
            },
            openUpdateWodModel(wod,isUpdateAttempt){

                this.isUpdateWodModelOpen = true;

                if (isUpdateAttempt){
                    this.workOrderDetail.woId = wod.woId;
                } else {
                    this.workOrderDetail.woId = -1;
                }

                this.workOrderDetail.templateName = wod.templateName;
                this.workOrderDetail.woName = wod.woName;
                this.updateTaskList = wod.taskList;

                for (let i = 0; i < this.updateTaskList.length; i++) {
                    this.updateTaskList[i].startDate = DateFormatManager.formate(this.updateTaskList[i].startDate);
                    this.updateTaskList[i].endDate = DateFormatManager.formate(this.updateTaskList[i].endDate);
                }

            },
            closeUpdateWodModel(){
                this.isUpdateWodModelOpen = false;
            },
            deleteWorkOrderDetail(wo){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/work-order-detail/delete",{
                    workOrderDetailBn : {
                        woId : wo.woId,
                        templateOid : wo.templateOid
                    },
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.needToCloseNotification = false;

                        this.getInitData();

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
                            callBackMethod : this.deleteWorkOrderDetail,
                            needTryAgain : true,
                            code : res.data.code
                        });
                    }

                })
                .catch(err=>{
                    console.log(JSON.stringify(err));
                    this.$refs.noti.setNotificationProperty({
                        title : 'Error',
                        bodyIcon : 'fas fa-exclamation-circle',
                        bodyMsg : err.response.data.message,
                        callBackMethod : this.deleteWorkOrderDetail,
                        needTryAgain : true,
                        code : err.response.data.status
                    });
                })

            }
        }
    }
</script>

<style scoped>

</style>