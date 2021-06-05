<template>
    <div class="view">
        <h1 class="view-title">Function Maps</h1>
        <div class="functions-view">
            <div class="view-nav">
                <a>Default</a>
            </div>
            <div class="functions-view-inner">
                <p>Select a map</p>
            </div>
        </div>
    </div>
</template>

<style>
.functions-view {
    display: flex;
}
.functions-view-inner  {
    display:flex;
    justify-content: center;
    width:100%;
}

@media only screen and (max-width: 768px){
    .functions-view {
        flex-direction: column;
    }
}
</style>