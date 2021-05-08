<template>
    <div class="topnav">
        <button class="nav-btn" id="nav-open" @click="toggleNav">☰</button>
        <div  class="throttle-heading"> 
            <a href="http://www.dcc-ex.com" target="_blank" rel="noopener noreferrer"><img class="wt-logo" src="@/assets/WebThrottle.png" alt="DCC-EX logo"></a>
        </div>
        <div class="btn-cluster">
            <button class="btn-expand" id="fs-toggle" state="ws" title="fullscreen">&#10530;</button>
            <button class="btn-info" id="info-tooltip" state="ws" title="information"><span class="icon-info"></span></button>
            <button class="btn-info" id="help-button" state="ws" title="help" onclick=" window.open('https://dcc-ex.com/throttles/ex-webthrottle.html', '_blank')"><span class="icon-question"></span></button>
        </div>
    </div>
</template>

<script lang="js">
export default {
    methods: {
        toggleNav() {
            this.$emit('toggleNav')
        }
    }

}
</script>


<style scoped>
.topnav {
    display: flex;
    justify-content: space-between;
}
.nav-btn {
    font-size: 30px;
    cursor: pointer;
    color: #666666;
    padding: 10px 15px;
    padding-right: 108px;
    border: none;
    background: none;
    line-height: 38px;
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
    padding-top:15px;
    font-size: 14px;
    display: inline-block;
} 
.throttle-heading .wt-logo{
    height: 48px;
    width: 142px;
    box-shadow: 0 0 3px #989898;
    border-radius: 6px;
}
</style>