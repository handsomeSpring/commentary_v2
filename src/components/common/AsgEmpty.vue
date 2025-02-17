<template>
    <div class="asg-empty">
        <img src="../../assets/images/empty.png">
        <p>{{ props.description }}</p>
    </div>
</template>

<script setup lang='ts'>

const props = defineProps({
    description: {
        type: String,
        default: ''
    }
})
</script>

<style scoped lang='scss'>
.asg-empty {
    height: 100%;
    min-height: calc(100dvh - 52px - 56px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap:23pt;
    p{
        color:var(--main-theme-text);
        font-size: 14px;
    }
}
</style>