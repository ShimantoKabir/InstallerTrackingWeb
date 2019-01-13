<template>
    <div class="vue-template" >
        <div class="container-fluid" >
            <div class="row justify-content-center" >
                <div class="col-sm-4">
                    <div class="my-div">
                        <div class="my-div-head" >
                            <h3>Unauthorized url</h3>
                        </div>
                        <div class="my-div-body" >
                            <i style="font-size: 30px;color: red" class="fas fa-exclamation-circle" ></i> &nbsp;
                            <h3>Sorry : Sir/Mam you want's go an unauthorized page or this url don't have any existing !</h3>
                        </div>
                        <div class="my-div-foot" >
                            <button class="my-btn" v-on:click="goBack" >Go back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Unauthorized",
        methods: {
            goBack(){
                window.history.back();
            }
        }
    }
</script>

<style scoped></style>