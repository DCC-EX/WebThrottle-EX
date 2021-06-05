<template>
    <div class="topnav">
        <button class="nav-btn-open" title="Open sidebar" @click="toggleNav">☰</button>
        <div class="heading-div" title="DCC-EX Website"> 
            <a href="http://www.dcc-ex.com" target="_blank" rel="noopener noreferrer"><img class="heading-logo" src="@/assets/WebThrottle.png" alt="DCC-EX logo"></a>
        </div>
        <div class="btn-cluster">
            <button class="btn-expand" id="fs-toggle" state="ws" title="Fullscreen mode">&#10530;</button>
            <router-link to="/settings/about"><button class="btn-info" id="info-tooltip" state="ws" title="Information"><span class="icon-info"></span></button></router-link>
            <button class="btn-info" id="help-button" state="ws" title="Help" onclick=" window.open('https://dcc-ex.com/throttles/ex-webthrottle.html', '_blank')"><span class="icon-question"></span></button>
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


<style>
.topnav {
    display: flex;
    justify-content: space-between;
}
.nav-btn-open {
    font-size: 30px;
    cursor: pointer;
    color: #666666;
    padding: 10px 15px;
    margin-right: 93px;
    border: none;
    background: none;
    line-height: 38px;
}
.nav-btn-open:hover {
  color: #000000;
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
.heading-div{
    text-align: center;
    padding-top:15px;
    font-size: 14px;
    display: inline-block;
} 
.heading-div .heading-logo{
    height: 48px;
    width: 142px;
    box-shadow: 0 0 3px #989898;
    border-radius: 6px;
}

@media only screen and (max-width: 768px) {
    #help-button {
        display: none;
    }
    #info-tooltip {
        display: none;
    }
    #fs-toggle {
        margin-left: 10px;
    }
    .nav-btn-open {
        margin-right: 0px;
    }
}
</style>