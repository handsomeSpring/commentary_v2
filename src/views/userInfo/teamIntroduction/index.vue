<template>
    <nav-back title="ASG团队&系统介绍" />
    <full-screen-loading v-if="loading"></full-screen-loading>
    <div class="container__box" v-else>
        <n-card title="团队介绍">
            <p>{{ introduction }}</p>
        </n-card>
        <n-card title="系统功能" style="margin-top: 12px;">
            <ul>
                <li v-for="(item, index) in systemIntro" :key="index">
                    <div class="title"><p class="dot"></p><p>{{ item.title }}</p></div>
                    <p class="info">{{ item.message }}</p>
                </li>
            </ul>
        </n-card>
    </div>
</template>

<script setup lang='ts'>
const introduction = ref('');
const systemIntro = ref([]);
const loading = ref(false);
const initData = ()=>{
    loading.value = true;
    getByCode('teamIntroduction').then(res=>{
        introduction.value = res.data;
    })
    getByCode('comSystemIntro').then(res=>{
        systemIntro.value = res.data;
    }).finally(()=>{
        nextTick(()=>{
            loading.value = false;
        })
    })
}
initData();
</script>
<style scoped lang='scss'>
.container__box{
    padding:12px;
    box-sizing: border-box;
    .title{
        display: flex;
        align-items: center;
        font-size: 1rem;
        margin:8px 0;
        font-weight: bold;
        .dot{
            width: 0.5rem;
            height:0.5rem;
            background-color: #9CC9E5;
            border-radius: 50%;
            margin-right: 8px;
        }
    }
    .info{
        text-indent: 2em;
        color:#606060;
    }
}
</style>