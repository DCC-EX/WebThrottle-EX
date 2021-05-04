<template>
    <div class="topnav">
        <!-- <div class="row"> -->
            <!-- <div class="nav-btn-div"> -->
            <!-- <div class="column-2"> -->
                <button class="nav-btn" id="nav-open">☰</button>
            <!-- </div> -->
            <!-- <div class="column-6 align-center"> -->
            <!-- <div class="align-center"> -->
                <div  class="throttle-heading"> 
                    <!-- <a href="http://www.dcc-ex.com" target="_blank" rel="noopener noreferrer"><div class="wt-logo"></div></a> -->
                    <a href="http://www.dcc-ex.com" target="_blank" rel="noopener noreferrer"><img class="wt-logo" src="@/assets/WebThrottle.png" alt="DCC-EX logo"></a>
                    <!--img src="images/webthrottle.png" /> -->
                    <!-- <p>version 1.2.0</p> -->
                </div>
            <!-- </div> -->
            <!-- <div class="column-2"> -->
            <div class="btn-cluster">
                <button class="btn-expand" id="fs-toggle" state="ws" title="fullscreen">&#10530;</button>
                <button class="btn-info" id="info-tooltip" state="ws" title="information"><span class="icon-info"></span></button>
                <button class="btn-info" id="help-button" state="ws" title="help" onclick=" window.open('https://dcc-ex.com/throttles/ex-webthrottle.html', '_blank')"><span class="icon-question"></span></button>
            </div>
        <!-- </div>  -->
    </div>
</template>

<script lang="ts">
export default {

}
</script>

<style>
.topnav {
    display: flex;
    justify-content: space-between;
}
/* .nav-btn {
    text-align: left;
    width: 10%;
    float: left;
    padding: 5px, 15px;
}
.throttle-heading{
    float: left;
    /* width: 60%; */
    /* padding: 5px 15px; */
    /* text-align: center; */
    /* padding-top:5px; */
    /* font-size: 14px; */
    /* display: inline-block; */
/* } */
/* .topnav { */
    /* width: 100%; */
/* } */
/* .btn-cluster { */
    /* padding: 5px 15px; */
/*}

/* .topnav .row div, .add-loco-form .row label, .add-loco-form .row input{
    box-sizing: border-box;
} */
/* .row:after {
    content: "";
    display: block;
    clear: both;
} */
/* .topnav{
    position: fixed;
    z-index: 100;
    width: 100%;
} */
 .nav-btn {
    font-size: 30px;
    cursor: pointer;
    color: #666666;
    padding: 10px 15px;
    border: none;
    background: none;
    line-height: 38px;
}
.nav-btn.in{
    color:#cccccc;
    font-size: 40px;
    position: absolute;
    right: 0;
    line-height: 30px;
}
.nav-btn:hover {
  color: #000000;
}
.nav-btn.in:hover{
  color: #ffffff;
}
.btn-expand, .btn-info{
    float: right;
    font-size: 20px;
    cursor: pointer;
    color: #666666;
    padding: 10px 15px;
    border: none;
    background: none;
    line-height: 36px;
}
.btn-info{
    padding-top: 14px;
}
.align-center{
    text-align: center;
}
 .throttle-heading{
    text-align: center;
    padding-top:5px;
    font-size: 14px;
    display: inline-block;
} 
.throttle-heading .wt-logo{
    height: 48px;
    width: 142px;
    /* background: url(@/assets/WebThrottle.png); */
    display: inline-block;
    background-size: 100%;
    box-shadow: 0 0 3px #989898;
    border-radius: 6px;
}
.throttle-heading p{
    font-size: 12px;
    margin: 5px;
}  
</style>