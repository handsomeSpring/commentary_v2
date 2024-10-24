<template>

    <div>Token:{{ token }}</div>
</template>

<script setup lang='ts'>

const props = defineProps({
    sitekey: {
        type: String,
        required: false,
        default: "0x4AAAAAAAfglgZKAlbqw_YO"
    }
})
const token = ref('');
</script>
<style scoped lang='scss'></style>