<template>
    <div class="full__size--fix">
        <div class="loader"></div>
        <p>数据加载中...</p>
    </div>
</template>

<script setup lang='ts'>
</script>
<style scoped lang='scss'>
/* HTML: <div class="loader"></div> */
.full__size--fix {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.48);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index:999999;
}

p {
    font-size: 14px;
    color: var(--main-theme-text);
}

/* HTML: <div class="loader"></div> */
.loader {
    width: fit-content;
    font-size: 32px;
    line-height: 1.5;
    font-family: system-ui, sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    color: #0000;
    -webkit-text-stroke: 1px #9CC9E5;
    background:
        radial-gradient(1.13em at 50% 1.6em, #9CC9E5 99%, #0000 101%) calc(50% - 1.6em) 0/3.2em 100% text,
        radial-gradient(1.13em at 50% -0.8em, #9CC9E5 99%, #9CC9E5 101%) 50% .8em/3.2em 100% repeat-x text;
    animation: l9 2s linear infinite;
}

.loader:before {
    content: "ASG";
}

@keyframes l9 {
    to {
        background-position: calc(50% + 1.6em) 0, calc(50% + 3.2em) .8em
    }
}
</style>