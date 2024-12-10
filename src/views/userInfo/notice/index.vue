<template>
    <nav-back title="最新通知公告" />
    <full-screen-loading v-if="loading"></full-screen-loading>
    <div class="new-content" v-else>
        <li v-for="(item, index) in noticeInfo" :key="index" @click="goDetail(item)">
             <p class="title">{{ item.title }}</p>
             <p class="timer">{{ item.time.slice(0,10) }}</p>
        </li>
    </div>
</template>

<script setup lang='ts'>
import { getNews } from "@/api/common";
import { useMessage } from "naive-ui";
const router = useRouter();
const noticeInfo = ref([]);
const message = useMessage();
const loading = ref(false);
const getNewsByApi = async ()=>{
    try {
        loading.value = true; 
        const { data, status } = await getNews('2');
        if(status !== 200) throw new Error('服务端异常！');
        noticeInfo.value = data;
    } catch (error) {
        message.error(error.message)
    } finally{
        loading.value = false;
    }
}
const goDetail = (item)=>{
    router.push({path:'/userInfo/notice/details', query:item})
}
getNewsByApi();
</script>
<style lang="scss" scoped>
.new-content{
  margin:12px auto;
  width:95%;
  li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:1.2em 0;
    border-bottom: 1px dashed #e7e7e7;
    .title{
        color:#303030;
        font-size: 1.1em;
        font-weight: 500;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width:100%;
        font-family: 'HarmonyOS_Regular';
    }
    .timer{
        font-size: 0.8em;
        color:#979797;
        font-weight: 400;
        width: 7em;
    }
  }
}
</style>