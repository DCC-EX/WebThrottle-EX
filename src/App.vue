<template>
    <Nav v-show="showNav" @closeNav="toggleNav"/>
    <TopBar @toggleNav="toggleNav"/>
    <router-view @click="closeNav"/>
</template>

<script>
import { defineComponent } from 'vue';

import Nav from '@/components/Nav';
import TopBar from '@/components/TopBar';
export default defineComponent({
    components: {
        TopBar,
        Nav,
    },
    data() {
        return {
            showNav:  false,
        }
    },
    methods: {
        toggleNav() {
            this.showNav = ~this.showNav;
        },
        closeNav() {
            if (this.showNav) {
                this.showNav = false
            }
        }
    }
})
</script>

<style>
#app {
    font-family: Arial, Helvetica, sans-serif;
    /* font-family: Avenir, Helvetica, Arial, sans-serif; */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.view {
    border: 0px solid grey;
    border-radius: 10px;
    margin: 40px;
    height: calc(100vh - 148px);
    background-color: #e3e3e3;
    box-shadow: 0 0 5px 0px #777777;
}

@media only screen and (max-width: 768px) {
    .view {
        margin: 20px;
        height: calc(100vh - 110px);
    }
}
</style>
