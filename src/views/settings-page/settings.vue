<template>
    <div class="view">
        <h1 class="view-title">Settings</h1>
        <div class="settings-view">
            <div class="view-nav">
                <router-link to="/settings">General</router-link>
                <router-link to="/settings/storage">Storage</router-link>
                <router-link to="/settings/app">App</router-link>
                <router-link to="/settings/about">About</router-link>
            </div>
            <div class="settings-view-inner">
                <router-view/>
            </div>
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
.view-nav {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: calc(100vh - 206px);
    border-right: 1px solid #bbb;
    margin-top: 0px;
    padding: 10px 0px;
}

.view-nav a {
    padding: 10px 0px;
    text-decoration: none;
    color: #555;
    cursor: pointer;
}

.view-nav a:hover {
    background-color: #d6d6d6;
    color: #111;
}

.view-nav .router-link-exact-active {
    color:black;
}

.settings-view-inner {
    display: flex;
    width: 100%;
    justify-content: center;
}

@media only screen and (max-width: 768px){
    .view-nav {
        width: auto;
        height: auto;
        border-bottom: 1px solid #bbb;

    }
    .settings-view {
        flex-direction: column;
    }
}

</style>