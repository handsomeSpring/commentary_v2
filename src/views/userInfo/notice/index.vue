<template>
    <nav-back title="最新通知公告" />
    <n-tabs style="margin:12px 0" default-value="0" type="card" animated placement="left">
            <n-tab-pane v-for="(item, index) in noticeInfo" :key="index" :name="index.toString()" :tab="`公告${index + 1}`">
                <n-card>
                    <h2>{{ item.title }}</h2>
                    <n-divider></n-divider>
                    <n-ellipsis expand-trigger="click" line-clamp="5" :tooltip="false">
                        <p style="text-indent:2em">{{ item.msg }}</p>
                    </n-ellipsis>
                    <n-divider></n-divider>
                    <div class="footer-container">
                        <p>发布人：{{ item.formName.length > 8 ? item.formName.slice(0,8) + '...' : item.formName}}</p>
                        <p>{{ item.time.slice(0,10) }}</p>
                    </div>
                </n-card>
            </n-tab-pane>
        </n-tabs>
</template>

<script setup lang='ts'>
import { getNews } from "@/api/common"
const noticeInfo = ref([]);
const getNewsByApi = async ()=>{
    const { data } = await getNews('2');
    noticeInfo.value = data;
}
getNewsByApi();
</script>
<style lang="scss" scoped>
.footer-container{
    display:flex;
    justify-content: space-between;
    align-items: center;
    color:#7e7e7e;
    font-weight: bold;
}
</style>