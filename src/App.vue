<template>
    <TopBar></TopBar>
</template>

<script>
import { defineComponent } from 'vue';
import TopBar from '@/components/TopBar';
export default defineComponent({
    components: {
        TopBar,
    },
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
