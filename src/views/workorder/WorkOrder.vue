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
                                            <td><input type="text" v-model="workOrder.name" /></td>
                                        </tr>
                                        <tr>
                                            <td>Site</td>
                                            <td>
                                                <select v-model="workOrder.siteId" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="sl in siteList" v-bind:value="sl.id" >{{sl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Site PICT</td>
                                            <td>
                                                <input type="text" v-model="workOrder.sitePiCt" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Wo PICH</td>
                                            <td>
                                                <select v-model="workOrder.woPiCh" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="ul in userList" v-bind:value="ul.id" >{{ul.userName}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>
                                                <select v-model="workOrder.statusOid" >
                                                    <option v-for="sl in statusList" v-bind:value="sl.oId" >{{sl.name}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="my-tab-50" >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>Requester</td>
                                            <td>
                                                <select v-model="workOrder.requester" >
                                                    <option v-bind:value="-1" >-- select --</option>
                                                    <option v-for="ul in userList" v-bind:value="ul.id" >{{ul.userName}}</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Dead line</td>
                                            <td>
                                                <input type="date" v-model="workOrder.deadLine" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Remark</td>
                                            <td>
                                                <textarea v-model="workOrder.remark" ></textarea>
                                            </td>
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
                                            <tr v-for="(wol,i) in workOrderList" >
                                                <td>{{i+1}}</td>
                                                <td>{{wol.name}}</td>
                                                <td>{{wol.woPiChName}}</td>
                                                <td>{{wol.requesterName}}</td>
                                                <td>{{wol.deadLine}}</td>
                                                <td>{{wol.remark}}</td>
                                                <td>{{wol.siteName}}</td>
                                                <td>{{wol.sitePiCt}}</td>
                                                <td>{{wol.status}}</td>
                                                <td><i class="fas fa-edit" v-on:click="setUpdateWorkOrderData(wol)" ></i></td>
                                                <td><i class="fas fa-trash" v-on:click="deleteWorkOrder(wol.id)" ></i></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-show="selectedTab===0" class="my-tab-foot" >
                                <button v-if="workOrder.id===-1" class="my-btn" v-on:click="saveWorkOrder" >Save</button>
                                <button v-else class="my-btn" v-on:click="updateWorkOrder" >Update</button>
                                <button class="my-btn"  v-on:click="resetWorkOrder" >Reset</button>
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
    import DateFormatManager from "../../Helper/DateFormatManager";
    import CookieManager from "../../Helper/CookieManager";
    import TableHead from "../../common/TableHead";

    export default {
        name: "WorkOrder",
        components: {TableHead, Notification},
        mounted(){
            this.getInitData();
        },
        data(){
            return{
                url : this.$store.state.baseUrl,
                tabButtons : ['Create work order','Work order list'],
                selectedTab : 0,
                workOrder :{
                    id : -1,
                    deadLine : '',
                    name : '',
                    woPiCh : '',
                    remark : '',
                    requester : '',
                    siteId : '',
                    sitePic : '',
                    modifiedBy : Number(CookieManager.getParsedData("userInfo").id),
                    statusOid : 101,
                    sitePiCt : ''
                },
                siteList : [],
                userList : [],
                statusList : [],
                workOrderList : [],
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
                        name : 'Wo PICH',
                        sortBy : 'woPiChName',
                    },
                    {
                        name : 'Requester',
                        sortBy : 'requesterName',
                    },
                    {
                        name : 'Deadline',
                        sortBy : 'deadLine',
                    },
                    {
                        name : 'Remark',
                        sortBy : 'remark',
                    },
                    {
                        name : 'Site name',
                        sortBy : 'siteName',
                    },
                    {
                        name : 'Site PICT',
                        sortBy : 'sitePiCt',
                    },
                    {
                        name : 'Status',
                        sortBy : 'status',
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
                this.workOrderList = list;
            },
            getInitData(){

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(this.url+"/work-order/get-init-data",{
                    userBn : CookieManager.getParsedData("userInfo"),
                    menuBn : {
                        link : this.$route.path
                    }
                })
                .then(res=>{

                    console.log(JSON.stringify(res.data));

                    if (res.data.code===200){

                        this.siteList = res.data.siteList;
                        this.userList = res.data.userList;
                        this.statusList = res.data.statusList;
                        this.$refs.th.setComTableData(res.data.workOrderList);

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
                            status : res.data.code
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
                        status : err.response.data.status
                    });
                })

            },
            tabBtnClickListener(i){
                this.selectedTab = i;
            },
            saveWorkOrder(){

                let url = this.$store.state.baseUrl;

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(url+"/work-order/save",this.workOrder)
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){
                            this.needToCloseNotification = false;
                            this.getInitData();
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
                                callBackMethod : this.saveWorkOrder,
                                needTryAgain : true,
                                status : res.data.code
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.saveWorkOrder,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })

            },
            updateWorkOrder(){

                let url = this.$store.state.baseUrl;

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(url+"/work-order/update",this.workOrder)
                    .then(res=>{

                        console.log(JSON.stringify(res.data));

                        if (res.data.code===200){

                            this.needToCloseNotification = false;
                            this.getInitData();
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
                                callBackMethod : this.updateWorkOrder,
                                needTryAgain : true,
                                status : res.data.code
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.updateWorkOrder,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })
            },
            resetWorkOrder(){
                this.workOrder.id = -1;
                this.workOrder.name = '';
                this.workOrder.deadLine = '';
                this.workOrder.woPiCh = '';
                this.workOrder.requester = '';
                this.workOrder.siteId = '';
                this.workOrder.remark = '';
                this.selectedTab = 0;
                this.workOrder.statusOid = '';
                this.workOrder.sitePiCt = '';
            },
            setUpdateWorkOrderData(wo){

                this.workOrder.id = wo.id;
                this.workOrder.name = wo.name;
                this.workOrder.deadLine = DateFormatManager.formate(wo.deadLine);
                this.workOrder.woPiCh = wo.woPiCh;
                this.workOrder.requester = wo.requester;
                this.workOrder.siteId = wo.siteId;
                this.workOrder.remark = wo.remark;
                this.selectedTab = 0;
                this.workOrder.statusOid = wo.statusOid;
                this.workOrder.sitePiCt = wo.sitePiCt;
            },
            deleteWorkOrder(id){

                let url = this.$store.state.baseUrl;

                this.$refs.noti.setNotificationProperty({
                    title : 'Loading',
                    bodyIcon : 'fas fa-spin fa-sync',
                    bodyMsg : 'Please wait ... !',
                });

                this.$http.post(url+"/work-order/delete",{
                    id : id
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
                                status : res.data.code
                            });

                        } else {
                            this.$refs.noti.setNotificationProperty({
                                title : 'Error',
                                bodyIcon : 'fas fa-exclamation-circle',
                                bodyMsg : res.data.msg,
                                callBackMethod : this.deleteWorkOrder,
                                needTryAgain : true,
                                status : res.data.code
                            });
                        }

                    })
                    .catch(err=>{
                        console.log(JSON.stringify(err));
                        this.$refs.noti.setNotificationProperty({
                            title : 'Error',
                            bodyIcon : 'fas fa-exclamation-circle',
                            bodyMsg : err.response.data.message,
                            callBackMethod : this.deleteWorkOrder,
                            needTryAgain : true,
                            status : err.response.data.status
                        });
                    })
            }
        }
    }
</script>

<style scoped>

</style>