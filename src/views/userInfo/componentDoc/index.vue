<template>
    <nav-back title="前端公共组件代码" />
    <div v-if="!isAuth" class="listTable">
        <asg-empty description="您是游客，您没有权限查看！"></asg-empty>
    </div>
    <div v-else class="auth-container">
        <n-alert title="查阅提示" type="success">
           这是我们第五人格ASG解说端系统，基于vue3和typescript开发的公共组件文档库。便于其他前端开发者学习和使用，注意：该组件库只能在本项目中使用，在其他项目中使用无效。
        </n-alert>
        <Document />
    </div>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import Document from './Document.vue';

const userStore = useUserStore();
// 拥有职位的人才能查看
const isAuth = computed(() => {
    return userStore?.userInfo?.officium ?? false;
})

</script>
<style scoped lang='scss'>
.listTable {
    height: calc(100dvh - 45px);
}
.auth-container{
    background: var(--main-bg-color);
    min-height: calc(100dvh - 45px);
}
</style>