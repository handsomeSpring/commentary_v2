<template>
    <nav-back title="解说成员" />
    <template v-if="loading">
        <n-skeleton text :repeat="4" />
        <n-skeleton text style="width: 87%" :repeat="2" />
        <n-skeleton text style="width: 70%" :repeat="2" />
        <n-skeleton text style="width: 50%" />
    </template>
    <template v-else>
        <div class="container-comlist">
            <n-card class="card-item" v-for="item in comList">
                <header>
                    <n-avatar :size="24" :src="item.base64 ?? `empty.png`" fallback-src="/logo/asg.png" />
                    <n-gradient-text type="info">
                        <p class="line-text-clip">{{ item.chinaname }}</p>
                    </n-gradient-text>
                    <n-gradient-text type="error">
                        {{ item.isadmin ? '（赛事组）' : '' }}
                    </n-gradient-text>
                </header>
            </n-card>
        </div>
    </template>
</template>

<script setup lang='ts'>
import { getByOpName } from "@/api/common";
import { useMessage } from "naive-ui";
const loading = ref(true);
const nMessage = useMessage();
const comList = ref([]);
async function getCommentor() {
    try {
        const { data, message, status } = await getByOpName('Commentator');
        if (status !== 200) throw new Error(message);
        comList.value = data;
    } catch (error) {
        nMessage.error(error?.response?.data?.message ?? '未知错误，请联系网站管理员');
    }
}
onMounted(async () => {
    await getCommentor();
    nextTick(() => {
        loading.value = false;
    })
})
</script>
<style scoped lang='scss'>
.container-comlist {
    width: calc(100% - 36px);
    padding: 12px 18px;

    .card-item {
        margin: 12px 0;

        header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 20px;
        }
    }
}
.line-text-clip{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:40vw;
}
</style>