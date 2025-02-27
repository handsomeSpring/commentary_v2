<template>
    <!-- <img class="fit-picture" src="src/assets/icon/第一名.svg" alt="1"> -->
    <!-- <img class="fit-picture" src="src/assets/icon/第二名.svg" alt="2"> -->
    <!-- <img class="fit-picture" src="src/assets/icon/第三名.svg" alt="3"> -->
    <nav-back title="解说排名" />
    <full-screen-loading v-if="loading"></full-screen-loading>
    <template v-else>
        <div class="container-comlist">
            <header>
                <h1>排行榜</h1>
                <p>-解说场次排名前十-</p>
            </header>
            <div class="main-body">
                <div class="list-table-header">
                    <h4>排名</h4>
                    <h4>解说</h4>
                    <h4>场次</h4>
                </div>
                <div class="list-table-body" v-for="(item, index) in comList" :key="index">
                    <!-- TODO -1，2，3使用svg图片。后面用序号 -->
                    <div>
                        <img v-if="[0,1,2].includes(index)">
                        <p v-else>{{ index + 1 }}</p>
                    </div>
                    <p>{{ limitText(item.name,7,'无名氏') }}</p>
                    <p>{{ item.count }}</p>
                </div>
            </div>
        </div>
    </template>
</template>

<script setup lang='ts'>
import { limitText } from "@/utils";
import { useMessage } from "naive-ui";
const loading = ref(true);
const nMessage = useMessage();
const comList = ref([]);
async function getCommentor() {
    try {
        const { data, status } = await getRankForCommentary();
        if (status !== 200) throw new Error('服务端异常！');
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
    height: calc(100dvh - 45px);
    background: linear-gradient(173deg, #B3D4FF 0%, rgba(255, 255, 255, 0) 93%);
    header {
        height: 25%;
        width: 100%;
        //TODO-二十；排名榜 和 解说场次排名前十
        h1{
            text-align:center;
            font-family: '宋体' 'Microsoft Yahei',tahoma,arial,'Hiragin Sans GB';
            font-size: 40px;
            width: 100%;
            border: 2px solid #333;
            box-shadow: 8px 8px 5px #444;
            padding: 20px;
            background: linear-gradient(to right, #ff0000, #ffff00);
            mix-blend-mode: difference;
        }
        p{
            text-align:center;
            mix-blend-mode: difference;
            line-height: 10;
        }
    }
    .main-body {
        height: 75%;
        border-radius: 1em 1em 0 0;
        background:#fff;
        overflow: scroll;
        .list-table-header{
            margin:1em 0;

            width: 100%;
            display: grid;
            grid-template-columns: repeat(3,1fr);
        }
        .list-table-body {
            // TODO-二十：建议用flex或者grid布局，可以查一下这俩。
            // 一、让文字居中；二、让文字颜色适合；三、产生一定padding和margin，产生间隔。
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3,1fr);
            .fit-picture{
                width:auto;
            }
        }
    }
}

// TODO-二十-class加上这个类，文字就会自动有省略号了
.line-text-clip {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}
</style>