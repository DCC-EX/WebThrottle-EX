<template>
    <div class="view">
        <h1 class="view-title">Settings</h1>
        <div class="settings-view">
            <div class="settings-nav">
                <router-link to="/settings">General</router-link>
                <router-link to="/settings/storage">Storage</router-link>
                <router-link to="/settings/app">App</router-link>
                <router-link to="/settings/about">About</router-link>
            </div>
            <router-view/>
        </div>
    </div>
</template>

<style>
.view-title{
    padding: 10px;
    border-bottom: 1px solid #bbb;
    margin: 0;
    color: black;
}
.settings-view {
    display: flex;
}
.settings-nav {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: calc(100vh - 206px);
    border-right: 1px solid #bbb;
    margin-top: 0px;
    padding: 10px 0px;
}

.settings-nav a {
    padding: 10px 0px;
    text-decoration: none;
    color: #555;
    cursor: pointer;
}

.settings-nav a:hover {
    background-color: #d6d6d6;
    color: #111;
}

a.router-link-exact-active {
    color:black;
}
</style>