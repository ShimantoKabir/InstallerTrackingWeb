<template>
    <thead style="border: none" >
        <tr>
            <th :colspan="headerNameList.length" >
                <div class="data-table" >
                    <div class="dt-left" >
                        <input type="text" placeholder="Search" v-model="searchText" v-on:keyup="onSearchKeyUp" >
                    </div>
                    <div class="dt-right" >
                        <span v-on:click="searchByPageNumber" v-if="list.length > 0" >{{currentPage}} - {{Math.ceil(list.length/rowParPage)}} | </span>
                        <i class="fas fa-arrow-left" v-on:click="prevPage" ></i>
                        <i class="fas fa-arrow-right" v-on:click="nextPage" ></i>
                    </div>
                </div>
            </th>
        </tr>
        <tr>
            <th class="my-tbl-head" v-on:click="sort(hn.sortBy)" v-for="hn in headerNameList" >
                {{hn.name}} <i v-if="hn.sortBy" :class="sortIcon" ></i>
            </th>
        </tr>
    </thead>
</template>

<script>
    export default {
        name: "TableHead",
        props: {
            rowParPage : {
                type: Number,
            },
            headerNameList : {
                type: Array,
            },
            setTableData: {
                type: Function,
                default() {
                    return function (list) {};
                }
            }
        },
        mounted(){

        },
        data(){
            return{
                list : [],
                pageSize:this.rowParPage,
                currentPage:1,
                currentSort:'id',
                currentSortDir:'asc',
                sortIcon : "fas fa-arrow-down",
                searchText : ""
            }
        },
        methods : {
            searchByPageNumber(){
                let pn = prompt("Search by page number","");
                if (pn){
                    this.currentPage = pn;
                    this.setTableData(this.sortedList);
                }
            },
            onSearchKeyUp(){
                this.setTableData(this.sortedList);
            },
            setComTableData(l){
                this.list = l;
                this.setTableData(this.sortedList);
            },
            nextPage() {
                if((this.currentPage * this.pageSize) < this.list.length) {
                    this.currentPage++;
                    this.setTableData(this.sortedList);
                }
            },
            prevPage() {
                if(this.currentPage > 1) {
                    this.currentPage--;
                    this.setTableData(this.sortedList);
                }
            },
            sort(hn){
                if(hn === this.currentSort) {
                    this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
                    this.sortIcon = this.currentSortDir==='asc'?'fas fa-arrow-down':'fas fa-arrow-up';
                }
                this.currentSort = hn;
                this.setTableData(this.sortedList);
            }
        },
        computed:{

            sortedList : function() {

                return this.list.sort((a,b) => {
                    let modifier = 1;
                    if(this.currentSortDir === 'desc') modifier = -1;
                    if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                    if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
                    return 0;
                }).filter((row, index) => {
                    let start = (this.currentPage-1)*this.pageSize;
                    let end = this.currentPage*this.pageSize;
                    if(index >= start && index < end) return true;
                }).filter((item)=>{
                    return JSON.stringify(item).toLowerCase().match(this.searchText.toLowerCase());
                });

            }

        }
    }
</script>

<style scoped>
    .data-table{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
    .dt-left{

    }
    .dt-right{
        font-size: 10px;
        color: #429846;
    }
    .dt-right > i {
        padding: 3px;
        cursor: pointer;
        color: darkgoldenrod;
    }
    .dt-right > span {
        cursor: pointer;
    }
    .my-tbl-head{
        cursor: pointer;
    }
    .my-tbl-head i{
        font-size: 7px;
        color: darkgoldenrod;
    }
</style>