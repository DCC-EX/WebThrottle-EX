<template>
    <div class="view">
        <div class="throttle-header">
            <div id="locomotive-id">
                <div id="locomotive-id-inner">
                    <p id="locomotive-id-label">Locomotive ID</p>
                    <input type="text" id="locomotive-id-input">
                </div>
                <p><span class="icon-circle-right"></span></p>
            </div>
            <div>
                <select name="connection method" id="connection-method">
                    <option value="serial">Serial</option>
                    <option value="emulator">Emulator</option>
                </select>
                <button id="connection-button">Connect</button>
            </div>
        </div>
    </div>
</template>

<style>
.throttle-header {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #bbb;
    padding-bottom: 5px;
    justify-content: space-between;
}

#locomotive-id-label {
    font-size: 10px;
    margin: 0;
}
#connection-button {
    height: 30px;
    margin: 10px 0px;
    float: left;
}
</style>