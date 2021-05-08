<template>
    <nav class="nav-menu" tabindex="0">
        <header class="nav-header">
            <button class="nav-btn-close" @click="closeNav">&times;</button> 
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

.nav-menu {
	background: #00A3B9;
	height: 100vh;
	width: 250px;
	position: fixed;
    box-shadow: 0 0px 10px #666;
}

.nav-header img {
    width: 100%;
    overflow: hidden;
    border: 0;
}

.nav-list a{
    padding: 1em;
    cursor: pointer;
    color: #fff;
    text-decoration: none;
}
.nav-list a:hover{
    background-color: #0092a6;
}
.nav-list a:focus{
    border:none;
} 

.nav-btn-close {
    cursor: pointer;
    border: none;
    background: none;
    color:#cccccc;
    font-size: 40px;
    position: absolute;
    right: 0;
    line-height: 30px;
    /* margin: 0; */
    padding: 5px 10px 0 0;
}
.nav-btn-close:hover {
  color: #ffffff;
}
</style>