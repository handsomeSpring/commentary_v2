<template>
    <div class="page-container">
        <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
            <template #footer>
                <n-button @click="routerBack">去登录</n-button>
            </template>
        </n-result>
    </div>
</template>
<script setup lang="ts">
const router = useRouter();
const routerBack = ()=>{
    router.push('/login');
}
</script>
<style lang="scss" scoped>
.page-container{
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
