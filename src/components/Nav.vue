<template>
    <nav class="menu" id="side-menu" tabindex="0">
        <header class="avatar">
            <button class="nav-btn in" id="nav-close" @click="closeNav">&times;</button> 
            <img src="@/assets/cover.jpg" />
        </header>
        <div class="nav-list">
            <router-link @click="closeNav" to="/">Throttle</router-link>
            <router-link @click="closeNav" to="/locomotives">Locomotives</router-link>
            <router-link @click="closeNav" to="/functions">Function Map</router-link>
            <router-link @click="closeNav" to="/settings">Settings</router-link>
        </div>
    </nav>
</template>

<script lang="js">
export default {
    methods: {
        closeNav() {
            this.$emit('closeNav')
        }
    }
}
</script>

<style scoped>
.nav-list {
    display: flex;
    flex-direction: column;
}

.menu {
	background: #00A3B9;
	height: 100vh;
	width: 250px;
	position: fixed;
    box-shadow: 0 0px 10px #666;
}
.menu .avatar img {
    width: 100%;
    overflow: hidden;
    border: 0;
}

.menu div a{
    padding: 1em;
    cursor: pointer;
    color: #fff;
    text-decoration: none;
}
.menu div a:hover{
    background-color: #0092a6;
}
.menu div a:focus{
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
    cursor: pointer;
    border: none;
    background: none;
}
.nav-btn:hover {
  color: #000000;
}
</style>