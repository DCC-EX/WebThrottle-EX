<template>
          <nav class="menu" id="side-menu" tabindex="0">
            <header class="avatar">
                <button class="nav-btn in" id="nav-close" @click="closeNav">&times;</button> 
                <img src="@/assets/cover.jpg" />
            </header>
            <ul>
                <li tabindex="0" class="throttle" id="throttle-nav"><span>Throttle</span></li>
                <li tabindex="0" class="locomotives" id="loco-nav"><span>Locomotives</span></li>
                <li tabindex="0" class="function-maps" id="fn-map-nav"><span>Function Maps</span></li>
                <li tabindex="0" class="settings" id="settings-nav"><span>Settings</span></li>
            </ul>
        </nav>
</template>

<script lang="ts">
export default {
    methods: {
        closeNav() {
            this.$emit('closeNav')
        }
    }
}
</script>

<style>
.menu {
	background: #00A3B9;
	height: 100vh;
	width: 250px;
	position: fixed;
	top: 0;
	left: 0;
    z-index: 1020;
    box-shadow: 0 0px 10px #666;
    border-right: 1px solid #929292;
    outline: none;
    /* left: -260px; */
    /* display: none; */
}
.menu .avatar img {
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border: 0;
}

.menu ul {
    list-style: none;
    padding: 0.5em 0;
    margin: 0;
    margin-top: 1em;
}
.menu ul li{
    padding: 1em;
    background-repeat: no-repeat;
    background-position: left 15px center;
    background-size: auto 20px;
    transition: all 0.15s linear;
    cursor: pointer;
    color: #fff;
    text-shadow: 0 0 1px #000;
}
.menu ul  li:hover{
    background-color:rgba(0,0,0,0.1);
}
.menu ul  li:focus{
    border:none;
} 
.nav-btn.in{
    color:#cccccc;
    font-size: 40px;
    position: absolute;
    right: 0;
    line-height: 30px;
    /* margin: 0; */
    padding: 5px 10px 0 0;
}
.nav-btn.in:hover{
  color: #ffffff;
}
.nav-btn {
    font-size: 30px;
    cursor: pointer;
    color: #666666;
    padding: 10px 15px;
    border: none;
    background: none;
    line-height: 38px;
}
.nav-btn:hover {
  color: #000000;
}
</style>