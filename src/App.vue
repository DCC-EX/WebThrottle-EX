<template>
    <div>
        <Nav v-show="showNav" @closeNav="toggleNav"/>
        <TopBar @toggleNav="toggleNav"/>
        <router-view @click="closeNav"/>
    </div>
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

</style>
