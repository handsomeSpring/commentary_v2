<template>

    <nav-back/>
    <full-screen-loading v-if="loading"></full-screen-loading>
    <template v-else>
        <div class="container-comlist">
            <header>
                <h1>解说</h1>
                <h2>场次排名</h2>
            </header>
            <div class="main-body">
                <div class="list-table-body" v-for="(item, index) in comList" >
                    <p class="ranking">Top.<span>{{ index + 1 }}</span></p>
                    <div class="profile-photo">
                        <img v-if="item.base64" :src="item.base64"/>
                        <img v-else src="../../../assets/images/commontorphoto.jpg">
                    </div>
                    <div class="basic-message">
                        <p>{{ item.username }}</p>
                        <p>加入ASG<span class="add-time">{{ item.joinCount }}</span>天</p>
                    </div>
                    <div class="count-wrap">
                        <p>{{ item.count }}</p>
                    </div>
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
        comList.value = data.data.rows;
    } catch (error) {
        nMessage.error(error?.response?.data?.message ?? '未知错误，请联系网站管理员');
        // comList.value = [
        //     {
        //         name:'二十不会写前端',
        //         count:'5',
        //         joinTime:'100',
        //         avator:'null'
        //     },
        //     {
        //         name:'7000大帝',
        //         count:'7000',
        //         joinTime:'700',
        //         avator:'null'
        //     }
        // ]
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
    background: #9CC9E5;
    header {
        height: 25%;
        width: 100%;
        h1{
            text-align:left;
            font-size: 55px;
            width: 100%;
            padding: 5% 0 0 10%;
        }
        h2{
            text-align:left;
            font-size: 40px;
            width: 100%;
            padding: 0 0 0 10%;
        }
    }
    .main-body {
        height: 75%;
        border-radius: 2em 2em 0 0;
        background:#fff;
        overflow: scroll;
        .list-table-body {
            height: 50px;
            padding: 15px 20px;
            display: grid;
            align-items: center;
            grid-template-columns: 10% 20% auto 20%;
            .ranking{
                width: 100%;
                align-items: center;
            }
            .profile-photo{
                height:100%;
                width:100%;
                display: flex;
                align-items: center;
                justify-content: center;
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
            }
            .basic-message{
                width: 80%;
                margin: 0 auto;
                .add-time{
                    color: purple;
                    margin: 0 5px;
                }
            }
            .count-wrap{
                width: 80%;
                margin: 0 auto;
                border: black solid 1px;
                border-radius: 15px;
                background: #F5F6F7;
                text-align: center;
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