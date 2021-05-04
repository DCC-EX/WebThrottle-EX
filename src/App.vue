<template>
    <Nav v-show="showNav" @closeNav="toggleNav"></Nav>
    <TopBar @toggleNav="toggleNav"></TopBar>
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
