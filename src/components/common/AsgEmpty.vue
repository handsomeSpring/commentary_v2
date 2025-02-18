<template>
    <div class="asg-empty" :class="showMinHeight ? 'show-minHeight' : ''">
        <img src="../../assets/images/empty.png">
        <p>{{ description }}</p>
    </div>
</template>

<script setup lang='ts'>

const props = defineProps({
    description: {
        type: String,
        default: ''
    },
    showMinHeight:{
        type:Boolean,
        default:true
    }
})
</script>

<style scoped lang='scss'>
.asg-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap:23pt;
    &.show-minHeight{
        min-height: calc(100dvh - 52px - 56px);
    }
    p{
        color:var(--main-theme-text);
        font-size: 14px;
    }
}
</style>