<template>
    <!-- <div id="about-div-flexbox"> -->
        <div id="about-div">
            <h2>About</h2>
            <img src='@/assets/WebThrottle.png' class="about-img"/>
            <p id="about-main">DCC-EX Web Throttle</p>
            <p>(WebThrottle-EX)</p>
            <p id="version-number">1.4.0-dev</p>
            <h3>Credits</h3>
            <p>Matt (matt-hu)</p>
            <p>Fred (FrightRisk)</p>
            <p>Mani (ManiAkasapu)</p>
        </div>
    <!-- </div> -->
</template>

<script>
export default {

}
</script>

<style>
#about-div-flexbox {
    display: flex;
    width:100%;
    justify-content: center;
}
#about-div{
    /* display: flex; */
    /* flex-direction: column; */
    /* justify-content: center; */
    color: black;
}
.about-img {
    width: 50%;
}
</style>